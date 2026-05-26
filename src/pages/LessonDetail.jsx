import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiGet, apiPost } from '../api'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const monthUz = {
    January: 'Yan', February: 'Fev', March: 'Mar', April: 'Apr',
    May: 'May', June: 'Iyun', July: 'Iyul', August: 'Avg',
    September: 'Sen', October: 'Okt', November: 'Noy', December: 'Dek',
}
const monthToNum = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
}
const AVATAR_COLORS = ['#7c3aed', '#16a34a', '#2563eb', '#d97706', '#dc2626', '#0891b2', '#0d9488', '#9333ea']
const RADIO_LABELS  = ["O'quv reja bo'yicha", 'Boshqa']
const STAFF_TABS    = ['Assistant', 'Teacher']

function getInitials(name = '') {
    return name.trim().split(/\s+/).map(w => w[0] ?? '').join('').slice(0, 2).toUpperCase() || '?'
}

function toISODate(day, month, year = new Date().getFullYear()) {
    const m = (monthToNum[month] ?? 0) + 1
    return `${year}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function fmtDateFull(day, month, year) {
    if (!day || !month) return '—'
    return `${day} ${monthUz[month] ?? month}, ${year}`
}

function normalizeArr(res) {
    if (!res) return []
    if (Array.isArray(res)) return res
    for (const k of ['data', 'students', 'items', 'result', 'content', 'rows']) {
        if (Array.isArray(res[k])) return res[k]
    }
    return []
}

export default function LessonDetail() {
    const { id, date } = useParams()
    const navigate     = useNavigate()

    const [schedules, setSchedules]             = useState(null)
    const [monthIdx, setMonthIdx]               = useState(0)
    const [selectedDay, setSelectedDay]         = useState(null)
    const [staffTab, setStaffTab]               = useState(0)
    const [teacherData, setTeacherData]         = useState(null)
    const [teacherLoading, setTeacherLoading]   = useState(false)
    const [students, setStudents]               = useState([])
    const [attendance, setAttendance]           = useState({})
    const [topic, setTopic]                     = useState('')
    const [description, setDescription]         = useState('')
    const [radioOption, setRadioOption]         = useState(0)
    const [loading, setLoading]                 = useState(true)
    const [saving, setSaving]                   = useState(false)
    const [toast, setToast]                     = useState(null)

    const showToast = (message, type) => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3500)
    }

    useEffect(() => {
        let cancelled = false
        Promise.all([
            apiGet(`/groups/${id}/schedules`),
            apiGet(`/groups/${id}/students`),
        ]).then(([schedRes, studRes]) => {
            if (cancelled) return
            let sched = Array.isArray(schedRes)
                ? (schedRes[0] ?? {})
                : (schedRes?.data && !Array.isArray(schedRes.data) ? schedRes.data : schedRes) ?? {}
            setSchedules(sched)

            const studs = normalizeArr(studRes)
            setStudents(studs)
            const initAtt = {}
            studs.forEach(s => { initAtt[s.id] = false })
            setAttendance(initAtt)
        }).catch(err => {
            if (!cancelled) showToast(err.message || "Ma'lumot yuklanmadi", 'error')
        }).finally(() => {
            if (!cancelled) setLoading(false)
        })
        return () => { cancelled = true }
    }, [id])

    useEffect(() => {
        if (!schedules) return
        const keys = Object.keys(schedules).sort((a, b) => Number(a) - Number(b))
        if (!keys.length) return

        const year    = new Date().getFullYear()
        const today   = new Date()
        const todayD  = today.getDate()
        const todayM  = today.toLocaleString('en', { month: 'long' })

        let urlD = null, urlM = null
        if (date) {
            const parsed = new Date(date)
            if (!isNaN(parsed)) {
                urlD = parsed.getDate()
                urlM = parsed.toLocaleString('en', { month: 'long' })
            }
        }

        const findDay = (targetD, targetM) => {
            for (let mi = 0; mi < keys.length; mi++) {
                const days = schedules[keys[mi]]?.days ?? []
                const found = days.find(d => d.day === targetD && d.month === targetM)
                if (found) return { found, mi }
            }
            return null
        }

        const tryUrl = urlD ? findDay(urlD, urlM) : null
        if (tryUrl) { setSelectedDay({ ...tryUrl.found, year }); setMonthIdx(tryUrl.mi); return }

        const tryToday = findDay(todayD, todayM)
        if (tryToday) { setSelectedDay({ ...tryToday.found, year }); setMonthIdx(tryToday.mi); return }

        const firstDays = schedules[keys[0]]?.days ?? []
        if (firstDays.length) { setSelectedDay({ ...firstDays[0], year }); setMonthIdx(0) }
    }, [schedules, date])

    const selectedDateStr = selectedDay ? toISODate(selectedDay.day, selectedDay.month, selectedDay.year) : null

    useEffect(() => {
        if (staffTab !== 1 || !selectedDateStr) return
        let cancelled = false
        setTeacherLoading(true)
        setTeacherData(null)
        apiGet(`/groups/${id}/lesson/${selectedDateStr}/teacher`)
            .then(res => { if (!cancelled) setTeacherData(res?.data ?? res) })
            .catch(() => { if (!cancelled) setTeacherData(null) })
            .finally(() => { if (!cancelled) setTeacherLoading(false) })
        return () => { cancelled = true }
    }, [staffTab, selectedDateStr, id])

    const monthKeys      = schedules ? Object.keys(schedules).sort((a, b) => Number(a) - Number(b)) : []
    const currentDays    = monthKeys[monthIdx] ? (schedules?.[monthKeys[monthIdx]]?.days ?? []) : []

    const handleSave = async () => {
        if (!topic.trim()) { showToast('Mavzu kiriting', 'error'); return }
        if (!selectedDay)  { showToast('Sana tanlanmagan', 'error'); return }
        setSaving(true)
        try {
            await apiPost(`/groups/${id}/lesson`, {
                date: selectedDateStr,
                topic: topic.trim(),
                description: description.trim(),
                attendance: Object.entries(attendance).map(([studentId, present]) => ({
                    studentId: Number(studentId),
                    present,
                })),
            })
            showToast('Saqlandi!', 'success')
        } catch (err) {
            showToast(err.message || 'Xatolik yuz berdi', 'error')
        } finally {
            setSaving(false)
        }
    }

    const tName  = teacherData?.full_name ?? teacherData?.name ?? "Noma'lum"
    const tRole  = teacherData?.role ?? "O'qituvchi"

    return (
        <div className="flex flex-col gap-5 pb-28">
            {toast && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-6 py-3 rounded-[10px] text-[13px] font-semibold text-white shadow-[0_6px_24px_rgba(0,0,0,0.25)] ${toast.type === 'success' ? 'bg-[#1F2D5C]' : 'bg-[#c0392b]'}`}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(`/dashboard/guruhlar/${id}`)}
                    className="border-none bg-transparent cursor-pointer p-1.5 rounded-lg text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors"
                >
                    <ArrowBackIcon sx={{ fontSize: 20 }} />
                </button>
                <h1 className="m-0 text-xl font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Dars tafsiloti</h1>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40 text-[#6b7280] dark:text-[#94a3b8] text-sm">
                    Yuklanmoqda...
                </div>
            ) : (
                <>
                    {/* SECTION 1 — Date carousel */}
                    <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-3">
                            <button
                                onClick={() => setMonthIdx(i => Math.max(0, i - 1))}
                                disabled={monthIdx === 0}
                                className="p-1.5 rounded-lg border border-[#e8e8e8] dark:border-[#2d3748] bg-transparent cursor-pointer text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeftIcon sx={{ fontSize: 18 }} />
                            </button>
                            <span className="text-[13px] font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">
                                {monthKeys[monthIdx] ? `${monthKeys[monthIdx]}-o'quv oyi` : '—'}
                            </span>
                            <button
                                onClick={() => setMonthIdx(i => Math.min(monthKeys.length - 1, i + 1))}
                                disabled={monthIdx >= monthKeys.length - 1}
                                className="p-1.5 rounded-lg border border-[#e8e8e8] dark:border-[#2d3748] bg-transparent cursor-pointer text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronRightIcon sx={{ fontSize: 18 }} />
                            </button>
                        </div>

                        <div className="overflow-x-auto pb-1 -mx-1 px-1">
                            <div className="flex gap-2 min-w-max">
                                {currentDays.length === 0 ? (
                                    <p className="m-0 text-sm text-[#6b7280] dark:text-[#94a3b8] py-2">Darslar mavjud emas</p>
                                ) : currentDays.map((d, i) => {
                                    const active = selectedDay?.day === d.day && selectedDay?.month === d.month
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedDay({ ...d, year: selectedDay?.year ?? new Date().getFullYear() })}
                                            className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border transition-all cursor-pointer shrink-0 ${
                                                active
                                                    ? 'bg-[#16a34a] border-[#16a34a] text-white'
                                                    : 'bg-[#f3f4f6] dark:bg-[#0f1724] border-[#e5e7eb] dark:border-[#2d3748] text-[#1a1a2e] dark:text-[#e2e8f0] hover:border-[#16a34a] dark:hover:border-[#16a34a]'
                                            }`}
                                        >
                                            <span className="text-[10px] font-medium leading-tight">{monthUz[d.month] ?? d.month}</span>
                                            <span className="font-bold text-[15px] leading-tight">{d.day}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* SECTIONS 2 & 3 — Staff tabs + Info card */}
                    <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                        <div className="flex border-b border-[#e8e8e8] dark:border-[#2d3748]">
                            {STAFF_TABS.map((label, i) => (
                                <button
                                    key={label}
                                    onClick={() => setStaffTab(i)}
                                    className={`px-6 py-3 text-[13px] font-medium border-none bg-transparent cursor-pointer transition-colors duration-200 whitespace-nowrap border-b-2 -mb-px ${
                                        staffTab === i
                                            ? 'text-[#16a34a] border-[#16a34a]'
                                            : 'text-[#6b7280] dark:text-[#94a3b8] border-transparent hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0]'
                                    }`}
                                >{label}</button>
                            ))}
                        </div>

                        <div className="p-4 sm:p-5">
                            {teacherLoading ? (
                                <div className="py-6 text-center text-sm text-[#6b7280] dark:text-[#94a3b8]">Yuklanmoqda...</div>
                            ) : (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-[#e5e7eb] dark:border-[#2d3748] rounded-xl">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0"
                                            style={{ backgroundColor: staffTab === 1 ? AVATAR_COLORS[0] : '#7c3aed' }}
                                        >
                                            {staffTab === 1 && teacherData ? getInitials(tName) : 'AS'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="m-0 text-[14px] font-semibold text-[#1a1a2e] dark:text-[#e2e8f0] truncate">
                                                {staffTab === 1 ? (teacherData ? tName : "Ma'lumot topilmadi") : 'Assistant'}
                                            </p>
                                            <p className="m-0 text-[12px] text-[#6b7280] dark:text-[#94a3b8]">
                                                {staffTab === 1 ? (teacherData ? tRole : '') : "Yordamchi o'qituvchi"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row sm:flex-col gap-6 sm:gap-3 shrink-0 pt-1 sm:pt-0">
                                        <div>
                                            <p className="m-0 text-[11px] text-[#6b7280] dark:text-[#94a3b8]">Dars kuni</p>
                                            <p className="m-0 text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0] whitespace-nowrap">
                                                {selectedDay ? fmtDateFull(selectedDay.day, selectedDay.month, selectedDay.year) : '—'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="m-0 text-[11px] text-[#6b7280] dark:text-[#94a3b8]">Holat</p>
                                            <p className="m-0 text-[13px] text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">Dars o'tilmagan</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SECTION 4 — Form + Attendance */}
                    <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-4 sm:p-5 flex flex-col gap-5">
                        <h2 className="m-0 text-[15px] font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Yo'qlama va mavzu kiritish</h2>

                        {/* Radio */}
                        <div className="flex gap-5 flex-wrap">
                            {RADIO_LABELS.map((label, i) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => setRadioOption(i)}
                                    className="flex items-center gap-2 border-none bg-transparent cursor-pointer p-0"
                                >
                                    <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${radioOption === i ? 'border-[#16a34a]' : 'border-[#d1d5db] dark:border-[#4b5563]'}`}>
                                        {radioOption === i && <div className="w-2 h-2 rounded-full bg-[#16a34a]" />}
                                    </div>
                                    <span className={`text-[13px] font-medium transition-colors ${radioOption === i ? 'text-[#16a34a]' : 'text-[#6b7280] dark:text-[#94a3b8]'}`}>
                                        {label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Topic */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">
                                Mavzu <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                                placeholder="Mavzuni kiriting..."
                                className="px-3.5 py-2.5 border border-[#e5e7eb] dark:border-[#2d3748] rounded-lg text-[13px] bg-white dark:bg-[#0f1827] text-[#1a1a2e] dark:text-[#e2e8f0] outline-none focus:border-[#16a34a] transition-colors"
                            />
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">
                                Tavsif (ixtiyoriy)
                            </label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Dars haqida qo'shimcha ma'lumot..."
                                rows={3}
                                className="px-3.5 py-2.5 border border-[#e5e7eb] dark:border-[#2d3748] rounded-lg text-[13px] bg-white dark:bg-[#0f1827] text-[#1a1a2e] dark:text-[#e2e8f0] outline-none focus:border-[#16a34a] transition-colors resize-none"
                            />
                        </div>

                        {/* Attendance table */}
                        <div>
                            <h3 className="m-0 mb-3 text-[14px] font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">Yo'qlama</h3>
                            <div className="rounded-xl border border-[#e5e7eb] dark:border-[#2d3748] overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-[13px] border-collapse min-w-[300px]">
                                        <thead>
                                            <tr className="bg-[#f8f9fa] dark:bg-[#162032] text-[#6b7280] dark:text-[#94a3b8]">
                                                <th className="text-left px-4 py-3 font-semibold w-10">#</th>
                                                <th className="text-left px-4 py-3 font-semibold">O'quvchi ismi</th>
                                                <th className="text-center px-4 py-3 font-semibold w-20">Keldi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#f0f0f0] dark:divide-[#2d3748]">
                                            {students.length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} className="text-center py-8 text-[#6b7280] dark:text-[#94a3b8]">
                                                        O'quvchilar mavjud emas
                                                    </td>
                                                </tr>
                                            ) : students.map((s, i) => {
                                                const sName = s.full_name ?? s.name ?? `O'quvchi ${i + 1}`
                                                const color = AVATAR_COLORS[i % AVATAR_COLORS.length]
                                                const on    = !!attendance[s.id]
                                                return (
                                                    <tr key={s.id ?? i} className="hover:bg-[#f8f9fa] dark:hover:bg-[#162032] transition-colors">
                                                        <td className="px-4 py-3 text-[#6b7280] dark:text-[#94a3b8]">{i + 1}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2.5">
                                                                <div
                                                                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                                                                    style={{ backgroundColor: color }}
                                                                >
                                                                    {getInitials(sName)}
                                                                </div>
                                                                <span className="font-medium text-[#1a1a2e] dark:text-[#e2e8f0]">{sName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex justify-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setAttendance(prev => ({ ...prev, [s.id]: !prev[s.id] }))}
                                                                    className={`relative inline-flex items-center w-10 h-[22px] rounded-full transition-colors duration-200 cursor-pointer border-none ${on ? 'bg-[#16a34a]' : 'bg-[#d1d5db] dark:bg-[#4b5563]'}`}
                                                                >
                                                                    <span className={`absolute w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${on ? 'translate-x-[20px]' : 'translate-x-[2px]'}`} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Fixed save button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`px-6 py-3 rounded-xl text-white text-[14px] font-semibold shadow-[0_4px_20px_rgba(124,58,237,0.35)] transition-colors ${saving ? 'bg-[#a78bfa] cursor-not-allowed' : 'bg-[#7c3aed] hover:bg-[#6d28d9] cursor-pointer'}`}
                >
                    {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
            </div>
        </div>
    )
}
