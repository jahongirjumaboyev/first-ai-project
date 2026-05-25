import { useState } from 'react'
import { apiPost } from '../../api'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import PersonSelectModal from './PersonSelectModal'
import Toast from '../ui/Toast'

const kunlar = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba']
const dayMap = { Dushanba: 'MONDAY', Seshanba: 'TUESDAY', Chorshanba: 'WEDNESDAY', Payshanba: 'THURSDAY', Juma: 'FRIDAY', Shanba: 'SATURDAY', Yakshanba: 'SUNDAY' }
const initForm = { name: '', course: '', room: '', days: [], time: '09:00', endTime: '11:00', startDate: '', endDate: '', description: '', teachers: [], students: [], maxStudent: '' }

const inputCls = 'w-full border border-[#e8e8e8] dark:border-[#2d3748] rounded-[10px] px-3.5 py-2.5 text-sm bg-white dark:bg-[#0f1827] text-[#1a1a2e] dark:text-[#e2e8f0] outline-none focus:border-[#7E56D8] transition-colors duration-200'
const selectCls = `${inputCls} cursor-pointer`

function LabelEl({ text, required }) {
    return (
        <p className="m-0 mb-1.5 text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0]">
            {text}{required && <span className="text-[#e53935] ml-0.5">*</span>}
        </p>
    )
}

export default function GroupDrawer({ open, onClose, onSaved, rooms, courses, apiTeachers, apiStudents, groups }) {
    const [form, setForm] = useState(initForm)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState(null)
    const [modalType, setModalType] = useState(null)

    function showToast(message, type) {
        setToast({ message, type })
        setTimeout(() => setToast(null), type === 'error' ? 5000 : 3000)
    }

    const upd = (key, val) => setForm(prev => ({ ...prev, [key]: val }))
    const toggleDay = (day) => setForm(prev => ({
        ...prev,
        days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day]
    }))

    const closeDrawer = () => { setForm(initForm); onClose() }

    const removeTag = (type, id) => {
        const key = type === 'teacher' ? 'teachers' : 'students'
        upd(key, form[key].filter(x => x !== id))
    }
    const getPersonName = (type, id) => {
        const list = type === 'teacher' ? apiTeachers : apiStudents
        return list.find(p => p.id === id)?.full_name ?? id
    }

    const toMins = (t) => { const [h, m] = (t ?? '').split(':').map(Number); return (h || 0) * 60 + (m || 0) }
    const newStartMins = toMins(form.time)
    const newEndMins = toMins(form.endTime) || newStartMins + 120

    const roomConflicts = (() => {
        if (!form.room || form.days.length === 0) return []
        const selectedRoom = rooms.find(r => String(r.id) === String(form.room))
        if (!selectedRoom) return []
        const selectedDays = form.days.map(d => dayMap[d])
        return groups.filter(g => {
            const gRoomId = g.room?.id ?? g.room_id ?? g.room
            const gRoomName = g.room?.name ?? ''
            const sameRoom = String(gRoomId) === String(form.room) || gRoomName === selectedRoom.name
            if (!sameRoom) return false
            const gDays = Array.isArray(g.week_day) ? g.week_day : []
            if (!gDays.some(d => selectedDays.includes(d))) return false
            if (!g.start_time) return false
            const gStart = toMins(g.start_time)
            const gEnd = g.end_time ? toMins(g.end_time) : gStart + 120
            return newStartMins < gEnd && newEndMins > gStart
        })
    })()

    const saveGroup = async () => {
        if (!form.name || !form.course || !form.room || form.days.length === 0 || !form.startDate) {
            showToast("⚠️ Guruh nomi, kurs, xona, kun va sana majburiy!", 'error')
            return
        }
        setSaving(true)
        try {
            await apiPost('/groups', {
                name:        form.name,
                description: form.description || form.name,
                course_id:   Number(form.course),
                teachers:    form.teachers,
                students:    form.students,
                room_id:     Number(form.room),
                start_date:  form.startDate,
                end_date:    form.endDate || undefined,
                week_day:    form.days.map(d => dayMap[d]),
                start_time:  form.time.length === 5 ? form.time + ':00' : form.time,
                max_student: Number(form.maxStudent) || 0,
            })
            await onSaved()
            showToast("✅ Guruh muvaffaqiyatli qo'shildi!", 'success')
            setTimeout(() => closeDrawer(), 1200)
        } catch (err) {
            showToast(`⚠️ ${err.message}`, 'error')
        } finally {
            setSaving(false)
        }
    }

    const tagList = (type, ids) => ids.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
            {ids.map((id) => (
                <span key={id} className="flex items-center gap-1 bg-[#ede8fb] dark:bg-[#2a1f4a] text-[#7E56D8] rounded-lg px-2.5 py-1 text-[13px] font-medium">
                    {getPersonName(type, id)}
                    <button onClick={() => removeTag(type, id)} className="border-none bg-transparent cursor-pointer text-[#7E56D8] flex p-0 leading-none hover:text-[#e53935] transition-colors duration-150">
                        <CloseIcon sx={{ fontSize: 13 }} />
                    </button>
                </span>
            ))}
        </div>
    )

    const addBtn = (onClick) => (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-center gap-1.5 border border-dashed border-[#7E56D8] text-[#7E56D8] rounded-[10px] py-2.5 text-[13px] font-medium cursor-pointer hover:bg-[#f5f0ff] dark:hover:bg-[#2a1f4a] transition-colors duration-200 bg-transparent"
        >
            <AddIcon sx={{ fontSize: 16 }} /> Qo'shish
        </button>
    )

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} />}

            <div
                onClick={closeDrawer}
                className={`fixed inset-0 bg-black/45 z-200 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            />

            <div className={`fixed top-0 right-0 bottom-0 w-full sm:w-88 bg-white dark:bg-[#1e2a3a] z-201 flex flex-col shadow-[-6px_0_32px_rgba(0,0,0,0.18)] transition-transform duration-350 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>

                <div className="px-6 pt-5.5 pb-4 border-b border-[#e8e8e8] dark:border-[#2d3748] shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="m-0 text-lg font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Guruh qo'shish</h2>
                            <p className="mt-1 mb-0 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">Yangi guruh yaratish uchun quyidagi ma'lumotlarni kiriting.</p>
                        </div>
                        <button onClick={closeDrawer} className="border-none bg-transparent cursor-pointer text-[#6b7280] dark:text-[#94a3b8] flex p-1 mt-0.5 hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0] transition-colors">
                            <CloseIcon sx={{ fontSize: 20 }} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4.5">

                    <div>
                        <LabelEl text="Guruh nomi" required />
                        <input value={form.name} onChange={e => upd('name', e.target.value)} placeholder="Frontend 2024" className={inputCls} />
                    </div>

                    <div>
                        <LabelEl text="Kurs" required />
                        <select value={form.course} onChange={e => upd('course', e.target.value)} className={selectCls}>
                            <option value="" disabled hidden>Kurs tanlang</option>
                            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <LabelEl text="Xona" required />
                        <select value={form.room} onChange={e => upd('room', e.target.value)} className={selectCls}>
                            <option value="" disabled hidden>Xona tanlang</option>
                            {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>

                        {form.room && (() => {
                            const roomBookings = groups.filter(g => {
                                const gRoomId = g.room?.id ?? g.room_id ?? g.room
                                const gRoomName = g.room?.name ?? ''
                                const selectedRoom = rooms.find(r => String(r.id) === String(form.room))
                                return String(gRoomId) === String(form.room) || gRoomName === selectedRoom?.name
                            })
                            if (roomBookings.length === 0) return null
                            return (
                                <div className="mt-2 bg-[#f9f8ff] dark:bg-[#1a1f30] border border-[#e0d9f7] dark:border-[#2d3748] rounded-lg px-3 py-2.5 text-[12px]">
                                    <p className="m-0 font-semibold mb-1.5 text-[#7E56D8]">Bu xonadagi mavjud dars jadval:</p>
                                    {roomBookings.map(g => {
                                        const days = Array.isArray(g.week_day) ? g.week_day.join(', ') : '—'
                                        const time = g.start_time ? `${g.start_time.slice(0, 5)}${g.end_time ? `–${g.end_time.slice(0, 5)}` : ''}` : '—'
                                        const selectedDays = form.days.map(d => dayMap[d])
                                        const gDays = Array.isArray(g.week_day) ? g.week_day : []
                                        const dayOverlap = gDays.some(d => selectedDays.includes(d))
                                        const gStart = toMins(g.start_time)
                                        const gEnd = g.end_time ? toMins(g.end_time) : gStart + 120
                                        const timeOverlap = dayOverlap && g.start_time && newStartMins < gEnd && newEndMins > gStart
                                        return (
                                            <div key={g.id} className={`flex items-center gap-2 py-1 ${timeOverlap ? 'text-[#c0392b] dark:text-[#f87171]' : 'text-[#6b7280] dark:text-[#94a3b8]'}`}>
                                                <span className={`w-2 h-2 rounded-full shrink-0 ${timeOverlap ? 'bg-[#e53935]' : 'bg-[#16a34a]'}`} />
                                                <span className="font-medium">{g.name}</span>
                                                <span className="ml-auto">{time}</span>
                                                <span className="text-[11px] opacity-70">{days}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })()}

                        {roomConflicts.length > 0 && (
                            <div className="mt-2 bg-[#fff3f3] dark:bg-[#3a1f1f] border border-[#f44336] rounded-lg px-3 py-2.5 text-[12px] text-[#c0392b] dark:text-[#f87171]">
                                <p className="m-0 font-semibold mb-1">⚠️ Vaqt to'qnashuvi bor — quyidagi guruhlar bilan ustma-ust tushadi:</p>
                                {roomConflicts.map(g => (
                                    <p key={g.id} className="m-0">
                                        • {g.name} — {g.start_time?.slice(0, 5) ?? '?'}–{g.end_time?.slice(0, 5) ?? '?'} ({Array.isArray(g.week_day) ? g.week_day.join(', ') : '—'})
                                    </p>
                                ))}
                                <p className="m-0 mt-1 font-medium">Boshqa vaqt yoki boshqa xona tanlang.</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <LabelEl text="Dars kunlari" required />
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                            {kunlar.map(kun => (
                                <label key={kun} className="flex items-center gap-2.5 cursor-pointer text-sm text-[#1a1a2e] dark:text-[#e2e8f0]">
                                    <input type="checkbox" checked={form.days.includes(kun)} onChange={() => toggleDay(kun)} className="w-4 h-4 accent-[#7E56D8] cursor-pointer shrink-0" />
                                    {kun}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <LabelEl text="Boshlanish vaqti" required />
                            <input type="time" value={form.time} onChange={e => upd('time', e.target.value)} className={inputCls} />
                        </div>
                        <div>
                            <LabelEl text="Tugash vaqti" required />
                            <input type="time" value={form.endTime} onChange={e => upd('endTime', e.target.value)} className={inputCls} />
                        </div>
                    </div>

                    <div>
                        <LabelEl text="Boshlanish sanasi" required />
                        <input type="date" value={form.startDate} onChange={e => upd('startDate', e.target.value)} className={inputCls} />
                    </div>

                    <div>
                        <LabelEl text="Tugash sanasi" />
                        <input type="date" value={form.endDate} onChange={e => upd('endDate', e.target.value)} className={inputCls} />
                    </div>

                    <div>
                        <LabelEl text="Tavsif" />
                        <textarea value={form.description} onChange={e => upd('description', e.target.value)} placeholder="Guruh haqida qo'shimcha ma'lumot (ixtiyoriy)" rows={3} className={`${inputCls} resize-none`} />
                    </div>

                    <div>
                        <LabelEl text="Max talabalar soni" />
                        <input type="number" min="0" value={form.maxStudent} onChange={e => upd('maxStudent', e.target.value)} placeholder="30" className={inputCls} />
                    </div>

                    <div>
                        <LabelEl text="O'qituvchilar" />
                        {tagList('teacher', form.teachers)}
                        {addBtn(() => setModalType('teacher'))}
                    </div>

                    <div>
                        <LabelEl text="Talabalar" />
                        {tagList('student', form.students)}
                        {addBtn(() => setModalType('student'))}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-[#e8e8e8] dark:border-[#2d3748] flex justify-end gap-2.5 shrink-0">
                    <button onClick={closeDrawer} className="px-5.5 py-2.5 rounded-[10px] text-sm font-medium border border-[#e8e8e8] dark:border-[#2d3748] bg-transparent text-[#1a1a2e] dark:text-[#e2e8f0] cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors duration-200">
                        Bekor qilish
                    </button>
                    <button
                        onClick={saveGroup}
                        disabled={saving || roomConflicts.length > 0}
                        className={`px-5.5 py-2.5 rounded-[10px] text-sm font-semibold border-none text-white transition-colors duration-200 ${saving || roomConflicts.length > 0 ? 'bg-[#a78bda] cursor-not-allowed' : 'bg-[#7E56D8] hover:bg-[#6a44c0] cursor-pointer'}`}
                    >
                        {saving ? 'Saqlanmoqda...' : roomConflicts.length > 0 ? 'Xona band' : 'Saqlash'}
                    </button>
                </div>
            </div>

            {modalType && (
                <PersonSelectModal
                    type={modalType}
                    people={modalType === 'teacher' ? apiTeachers : apiStudents}
                    initialSelected={modalType === 'teacher' ? form.teachers : form.students}
                    onClose={() => setModalType(null)}
                    onApply={(selected) => {
                        upd(modalType === 'teacher' ? 'teachers' : 'students', selected)
                        setModalType(null)
                    }}
                />
            )}
        </>
    )
}
