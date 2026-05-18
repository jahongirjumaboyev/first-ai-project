import { useState, useEffect } from 'react'
import { apiPost, apiGet } from '../api'
import AddIcon from '@mui/icons-material/Add'
import PeopleIcon from '@mui/icons-material/People'
import SchoolIcon from '@mui/icons-material/School'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import RefreshIcon from '@mui/icons-material/Refresh'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'


const avatarStack = [
    { label: 'M', color: '#7E56D8' },
    { label: 'A', color: '#e91e63' },
    { label: 'S', color: '#16a34a' },
]



const kunlar  = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba']
const dayMap  = { Dushanba: 'MONDAY', Seshanba: 'TUESDAY', Chorshanba: 'WEDNESDAY', Payshanba: 'THURSDAY', Juma: 'FRIDAY', Shanba: 'SATURDAY', Yakshanba: 'SUNDAY' }

const initForm = { name: '', course: '', room: '', days: [], time: '09:00', endTime: '11:00', startDate: '', description: '', teachers: [], students: [], maxStudent: '' }

export default function Groups() {
    const [groups, setGroups]         = useState([])
    const [activeTab, setActiveTab]   = useState('guruhlar')
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [form, setForm]             = useState(initForm)
    const [saving, setSaving]         = useState(false)
    const [toast, setToast]           = useState(null)
    const [rooms, setRooms]           = useState([])
    const [courses, setCourses]       = useState([])
    const [apiTeachers, setApiTeachers] = useState([])
    const [apiStudents, setApiStudents] = useState([])

    const loadGroups = () =>
        apiGet('/groups/all').then(d => setGroups(Array.isArray(d) ? d : d?.data ?? [])).catch(() => {})

    useEffect(() => {
        loadGroups()
        apiGet('/rooms').then(d => setRooms(Array.isArray(d) ? d : d?.data ?? [])).catch(() => {})
        apiGet('/courses').then(d => setCourses(Array.isArray(d) ? d : d?.data ?? [])).catch(() => {})
        apiGet('/teachers').then(d => setApiTeachers(Array.isArray(d) ? d : d?.data ?? [])).catch(() => {})
        apiGet('/students?page=1&limit=100').then(d => setApiStudents(Array.isArray(d) ? d : d?.data ?? [])).catch(() => {})
    }, [])

    function showToast(message, type) {
        setToast({ message, type })
        setTimeout(() => setToast(null), type === 'error' ? 5000 : 3000)
    }

    /* Modal state: null | 'teacher' | 'student' */
    const [modalType, setModalType]   = useState(null)
    const [modalSearch, setModalSearch] = useState('')
    const [tempSelected, setTempSelected] = useState([])

    const toggleActive = (id) =>
        setGroups(prev => prev.map(g => g.id === id ? { ...g, active: !g.active } : g))

    const upd = (key, val) => setForm(prev => ({ ...prev, [key]: val }))
    const toggleDay = (day) => setForm(prev => ({
        ...prev,
        days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day]
    }))

    const closeDrawer = () => { setDrawerOpen(false); setForm(initForm) }

    /* Modal helpers */
    const openModal = (type) => {
        const current = type === 'teacher' ? form.teachers : form.students
        setTempSelected([...current])
        setModalSearch('')
        setModalType(type)
    }
    const closeModal = () => setModalType(null)
    const toggleTemp = (id) =>
        setTempSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    const applyModal = () => {
        if (modalType === 'teacher') upd('teachers', tempSelected)
        else upd('students', tempSelected)
        closeModal()
    }
    const removeTag = (type, id) => {
        const key = type === 'teacher' ? 'teachers' : 'students'
        upd(key, form[key].filter(x => x !== id))
    }
    const getPersonName = (type, id) => {
        const list = type === 'teacher' ? apiTeachers : apiStudents
        return list.find(p => p.id === id)?.full_name ?? id
    }

    const modalPeople  = modalType === 'teacher' ? apiTeachers : apiStudents
    const modalTitle   = modalType === 'teacher' ? "O'qituvchi qo'shish" : "Talaba qo'shish"
    const modalSub     = modalType === 'teacher' ? "Bir yoki bir nechta o'qituvchini tanlang" : "Bitta yoki bir nechta talabani tanlang"
    const modalPlaceholder = modalType === 'teacher' ? "O'qituvchi qidirish..." : "Talaba qidirish..."
    const filtered     = modalPeople.filter(x => (x.full_name ?? '').toLowerCase().includes(modalSearch.toLowerCase()))

    /* Room conflict check against already-loaded groups */
    const roomConflicts = (() => {
        if (!form.room || form.days.length === 0) return []
        const selectedRoom = rooms.find(r => String(r.id) === String(form.room))
        if (!selectedRoom) return []
        const selectedDays = form.days.map(d => dayMap[d])
        const toMins = (t) => { const [h, m] = (t ?? '').split(':').map(Number); return (h || 0) * 60 + (m || 0) }
        const startMins = toMins(form.time)
        const endMins   = toMins(form.endTime) || startMins + 120

        return groups.filter(g => {
            const gRoomName = g.room?.name ?? (typeof g.room === 'string' ? g.room : '')
            const gRoomId   = g.room?.id ?? g.room_id
            const sameRoom  = gRoomName === selectedRoom.name || String(gRoomId) === String(form.room)
            if (!sameRoom) return false
            const gDays = Array.isArray(g.week_day) ? g.week_day : []
            if (!gDays.some(d => selectedDays.includes(d))) return false
            if (!g.start_time) return true
            const gStart = toMins(g.start_time)
            const gEnd   = g.end_time ? toMins(g.end_time) : gStart + 120
            return startMins < gEnd && endMins > gStart
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
                week_day:    form.days.map(d => dayMap[d]),
                start_time:  form.time.length === 5 ? form.time + ':00' : form.time,
                max_student: Number(form.maxStudent) || 0,
            })
            await loadGroups()
            showToast("✅ Guruh muvaffaqiyatli qo'shildi!", 'success')
            setTimeout(() => closeDrawer(), 1200)
        } catch (err) {
            showToast(`⚠️ ${err.message}`, 'error')
        } finally {
            setSaving(false)
        }
    }

    const inputCls  = 'w-full border border-[#e8e8e8] dark:border-[#2d3748] rounded-[10px] px-3.5 py-2.5 text-sm bg-white dark:bg-[#0f1827] text-[#1a1a2e] dark:text-[#e2e8f0] outline-none focus:border-[#7E56D8] transition-colors duration-200'
    const selectCls = `${inputCls} cursor-pointer`
    const labelEl   = (text, required) => (
        <p className="m-0 mb-1.5 text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0]">
            {text}{required && <span className="text-[#e53935] ml-0.5">*</span>}
        </p>
    )
    const addBtn = (onClick) => (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-center gap-1.5 border border-dashed border-[#7E56D8] text-[#7E56D8] rounded-[10px] py-2.5 text-[13px] font-medium cursor-pointer hover:bg-[#f5f0ff] dark:hover:bg-[#2a1f4a] transition-colors duration-200 bg-transparent"
        >
            <AddIcon sx={{ fontSize: 16 }} /> Qo'shish
        </button>
    )
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

    return (
        <div>
            {toast && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-9999 flex items-center gap-2.5 px-4 sm:px-7 py-3 sm:py-3.5 rounded-[10px] text-[13px] sm:text-[15px] font-semibold text-white w-[calc(100vw-32px)] sm:w-auto text-center justify-center shadow-[0_6px_24px_rgba(0,0,0,0.25)] ${toast.type === 'success' ? 'bg-[#1F2D5C]' : 'bg-[#c0392b]'}`}>
                    {toast.message}
                </div>
            )}
            {/* Page header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-5">
                <h1 className="m-0 text-2xl font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Guruhlar</h1>
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="flex items-center gap-1.5 bg-[#7E56D8] hover:bg-[#6a44c0] text-white border-none rounded-[10px] px-4.5 py-2.5 text-[13px] font-semibold cursor-pointer transition-colors duration-200 w-fit shrink-0"
                >
                    <AddIcon sx={{ fontSize: 18 }} /> Guruh qo'shish
                </button>
            </div>

            {/* Main card */}
            <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] overflow-hidden">

                {/* Tabs */}
                <div className="flex border-b border-[#e8e8e8] dark:border-[#2d3748] px-4">
                    {[
                        { id: 'guruhlar', label: 'Guruhlar', icon: null },
                        { id: 'arxiv',    label: 'Arxiv',    icon: <CalendarMonthIcon sx={{ fontSize: 15 }} /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-none bg-transparent cursor-pointer transition-colors duration-200 border-b-2 -mb-px ${activeTab === tab.id ? 'text-[#7E56D8] border-[#7E56D8]' : 'text-[#6b7280] dark:text-[#94a3b8] border-transparent hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0]'}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 border-b border-[#e8e8e8] dark:border-[#2d3748]">
                    <div className="border border-[#e8e8e8] dark:border-[#2d3748] rounded-xl p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-[#6b7280] dark:text-[#94a3b8] text-[13px]">
                                <PeopleIcon sx={{ fontSize: 20, color: '#6b7280' }} /> Jami guruhlar
                            </div>
                            <button className="border-none bg-transparent cursor-pointer text-[#94a3b8] hover:text-[#555] dark:hover:text-[#e2e8f0] flex p-0.5 transition-colors">
                                <MoreVertIcon sx={{ fontSize: 18 }} />
                            </button>
                        </div>
                        <span className="text-3xl font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">{groups.length}</span>
                    </div>
                    <div className="border border-[#e8e8e8] dark:border-[#2d3748] rounded-xl p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-[#6b7280] dark:text-[#94a3b8] text-[13px]">
                                <PeopleIcon sx={{ fontSize: 20, color: '#6b7280' }} /> O'qituvchilar
                            </div>
                            <button className="border-none bg-transparent cursor-pointer text-[#94a3b8] hover:text-[#555] dark:hover:text-[#e2e8f0] flex p-0.5 transition-colors">
                                <MoreVertIcon sx={{ fontSize: 18 }} />
                            </button>
                        </div>
                        <span className="text-3xl font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">0</span>
                    </div>
                    <div className="border border-[#e8e8e8] dark:border-[#2d3748] rounded-xl p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-[#6b7280] dark:text-[#94a3b8] text-[13px]">
                                <SchoolIcon sx={{ fontSize: 20, color: '#6b7280' }} /> O'quvchilar
                            </div>
                            <button className="border-none bg-transparent cursor-pointer text-[#94a3b8] hover:text-[#555] dark:hover:text-[#e2e8f0] flex p-0.5 transition-colors">
                                <MoreVertIcon sx={{ fontSize: 18 }} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-3xl font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">0</span>
                            <div className="flex -space-x-2">
                                {avatarStack.map((a, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1e2a3a] flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: a.color }}>
                                        {a.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max border-collapse text-[13px]">
                        <thead>
                            <tr className="bg-[#f9f8ff] dark:bg-[#162032]">
                                <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium whitespace-nowrap">Status</th>
                                <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium whitespace-nowrap">Guruh nomi</th>
                                <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium whitespace-nowrap">Kurs</th>
                                <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium whitespace-nowrap">Davomiyligi</th>
                                <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium whitespace-nowrap">Dars vaqti</th>
                                <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium whitespace-nowrap">Xona</th>
                                <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium whitespace-nowrap">O'qituvchi</th>
                                <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium whitespace-nowrap">Talabalar</th>
                                <th className="px-4 py-3 w-10">
                                    <RefreshIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-10 text-center text-[#6b7280] dark:text-[#94a3b8]">Hech narsa topilmadi</td>
                                </tr>
                            ) : groups.map(g => (
                                <tr key={g.id} className="border-b border-[#e8e8e8] dark:border-[#2d3748] hover:bg-[#faf8ff] dark:hover:bg-[#172033] transition-colors duration-150">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleActive(g.id)}
                                                className={`relative w-9 h-5 rounded-full border-none cursor-pointer transition-colors duration-200 shrink-0 ${g.active ? 'bg-[#7E56D8]' : 'bg-[#d1d5db] dark:bg-[#4a5568]'}`}
                                            >
                                                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${g.active ? 'translate-x-4' : 'translate-x-0'}`} />
                                            </button>
                                            <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${g.active ? 'text-[#16a34a] bg-[#dcfce7] dark:bg-[#166534]/40' : 'text-[#6b7280] bg-[#f3f4f6] dark:bg-[#374151]'}`}>
                                                {g.active ? 'FAOL' : 'NOFAOL'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">{g.name}</td>
                                    <td className="px-4 py-3">
                                        <span className="text-[#7E56D8] bg-[#ede8fb] dark:bg-[#2a1f4a] px-2.5 py-0.5 rounded-md text-[12px] font-medium whitespace-nowrap">{g.course?.name ?? g.course ?? '—'}</span>
                                    </td>
                                    <td className="px-4 py-3 text-[#6b7280] dark:text-[#94a3b8]">{g.course?.duration_month ? `${g.course.duration_month} oy` : '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-[#1a1a2e] dark:text-[#e2e8f0]">{g.start_time ?? '—'}</div>
                                        <div className="text-[12px] text-[#6b7280] dark:text-[#94a3b8]">{Array.isArray(g.week_day) ? g.week_day.join(', ') : (g.week_day ?? '—')}</div>
                                    </td>
                                    <td className="px-4 py-3 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">{g.room?.name ?? g.room ?? '—'}</td>
                                    <td className="px-4 py-3 text-[#1a1a2e] dark:text-[#e2e8f0] whitespace-nowrap">{Array.isArray(g.teachers) ? g.teachers.length : '—'}</td>
                                    <td className="px-4 py-3 text-[#1a1a2e] dark:text-[#e2e8f0] font-medium">{Array.isArray(g.students) ? g.students.length : (g.max_student ?? '—')}</td>
                                    <td className="px-4 py-3">
                                        <button className="border-none bg-transparent cursor-pointer text-[#94a3b8] hover:text-[#555] dark:hover:text-[#e2e8f0] flex p-1 rounded transition-colors">
                                            <MoreVertIcon sx={{ fontSize: 18 }} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Overlay */}
            <div
                onClick={closeDrawer}
                className={`fixed inset-0 bg-black/45 z-200 transition-opacity duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            />

            {/* Drawer */}
            <div className={`fixed top-0 right-0 bottom-0 w-full sm:w-88 bg-white dark:bg-[#1e2a3a] z-201 flex flex-col shadow-[-6px_0_32px_rgba(0,0,0,0.18)] transition-transform duration-350 ease-in-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
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

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4.5">

                    <div>
                        {labelEl('Guruh nomi', true)}
                        <input value={form.name} onChange={e => upd('name', e.target.value)} placeholder="Frontend 2024" className={inputCls} />
                    </div>

                    <div>
                        {labelEl('Kurs', true)}
                        <select value={form.course} onChange={e => upd('course', e.target.value)} className={selectCls}>
                            <option value="" disabled hidden>Kurs tanlang</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        {labelEl('Xona', true)}
                        <select value={form.room} onChange={e => upd('room', e.target.value)} className={selectCls}>
                            <option value="" disabled hidden>Xona tanlang</option>
                            {rooms.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                        {roomConflicts.length > 0 && (
                            <div className="mt-2 bg-[#fff3f3] dark:bg-[#3a1f1f] border border-[#f44336] rounded-lg px-3 py-2.5 text-[12px] text-[#c0392b] dark:text-[#f87171]">
                                <p className="m-0 font-semibold mb-1">⚠️ Bu xona quyidagi guruhlar bilan to'qnashadi:</p>
                                {roomConflicts.map(g => (
                                    <p key={g.id} className="m-0">
                                        • {g.name} — {g.start_time ?? '?'}{g.end_time ? `–${g.end_time}` : ''} ({Array.isArray(g.week_day) ? g.week_day.join(', ') : '—'})
                                    </p>
                                ))}
                                <p className="m-0 mt-1 font-medium">Boshqa xona yoki boshqa vaqt tanlang.</p>
                            </div>
                        )}
                    </div>


                    <div>
                        {labelEl('Dars kunlari', true)}
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
                            {labelEl('Boshlanish vaqti', true)}
                            <input type="time" value={form.time} onChange={e => upd('time', e.target.value)} className={inputCls} />
                        </div>
                        <div>
                            {labelEl('Tugash vaqti', true)}
                            <input type="time" value={form.endTime} onChange={e => upd('endTime', e.target.value)} className={inputCls} />
                        </div>
                    </div>

                    <div>
                        {labelEl('Boshlanish sanasi', true)}
                        <input type="date" value={form.startDate} onChange={e => upd('startDate', e.target.value)} className={inputCls} />
                    </div>

                    <div>
                        {labelEl('Tavsif', false)}
                        <textarea value={form.description} onChange={e => upd('description', e.target.value)} placeholder="Guruh haqida qo'shimcha ma'lumot (ixtiyoriy)" rows={3} className={`${inputCls} resize-none`} />
                    </div>

                    <div>
                        {labelEl('Max talabalar soni', false)}
                        <input
                            type="number"
                            min="0"
                            value={form.maxStudent}
                            onChange={e => upd('maxStudent', e.target.value)}
                            placeholder="30"
                            className={inputCls}
                        />
                    </div>

                    {/* O'qituvchilar */}
                    <div>
                        {labelEl("O'qituvchilar", false)}
                        {tagList('teacher', form.teachers)}
                        {addBtn(() => openModal('teacher'))}
                    </div>

                    {/* Talabalar */}
                    <div>
                        {labelEl('Talabalar', false)}
                        {tagList('student', form.students)}
                        {addBtn(() => openModal('student'))}
                    </div>
                </div>

                {/* Footer */}
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

            {/* Selection modal */}
            {modalType && (
                <>
                    <div onClick={closeModal} className="fixed inset-0 bg-black/40 z-299" />
                    <div className="fixed inset-0 flex items-center justify-center z-300 p-4">
                        <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.22)] w-full max-w-sm flex flex-col">
                            {/* Modal header */}
                            <div className="px-6 pt-5 pb-4 border-b border-[#e8e8e8] dark:border-[#2d3748]">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="m-0 text-base font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">{modalTitle}</h3>
                                        <p className="mt-0.5 mb-0 text-[12px] text-[#6b7280] dark:text-[#94a3b8]">{modalSub}</p>
                                    </div>
                                    <button onClick={closeModal} className="border-none bg-transparent cursor-pointer text-[#6b7280] dark:text-[#94a3b8] flex p-1 hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0] transition-colors">
                                        <CloseIcon sx={{ fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mt-3 bg-[#f5f5f5] dark:bg-[#0f1827] border border-[#e8e8e8] dark:border-[#2d3748] rounded-lg px-3 py-1.75">
                                    <SearchIcon sx={{ color: '#94a3b8', fontSize: 17 }} />
                                    <input
                                        value={modalSearch}
                                        onChange={e => setModalSearch(e.target.value)}
                                        placeholder={modalPlaceholder}
                                        className="border-none outline-none bg-transparent text-[13px] text-[#1a1a2e] dark:text-[#e2e8f0] w-full"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            {/* List */}
                            <div className="px-6 py-3 flex flex-col gap-0.5 max-h-56 overflow-y-auto">
                                {filtered.length === 0 ? (
                                    <p className="text-center text-[13px] text-[#6b7280] dark:text-[#94a3b8] py-4">Hech narsa topilmadi</p>
                                ) : filtered.map(item => (
                                    <label key={item.id} className="flex items-center gap-3 px-2 py-2.5 rounded-lg cursor-pointer hover:bg-[#f5f0ff] dark:hover:bg-[#2a1f4a] transition-colors duration-150">
                                        <input
                                            type="checkbox"
                                            checked={tempSelected.includes(item.id)}
                                            onChange={() => toggleTemp(item.id)}
                                            className="w-4 h-4 accent-[#7E56D8] cursor-pointer shrink-0"
                                        />
                                        <span className="text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0]">{item.full_name}</span>
                                    </label>
                                ))}
                            </div>
                            {/* Modal footer */}
                            <div className="px-6 py-4 border-t border-[#e8e8e8] dark:border-[#2d3748] flex justify-end gap-2.5">
                                <button onClick={closeModal} className="px-5 py-2 rounded-[10px] text-sm font-medium border border-[#e8e8e8] dark:border-[#2d3748] bg-transparent text-[#1a1a2e] dark:text-[#e2e8f0] cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors duration-200">
                                    Bekor qilish
                                </button>
                                <button onClick={applyModal} className="px-5 py-2 rounded-[10px] text-sm font-semibold border-none bg-[#7E56D8] hover:bg-[#6a44c0] text-white cursor-pointer transition-colors duration-200">
                                    Saqlash
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
