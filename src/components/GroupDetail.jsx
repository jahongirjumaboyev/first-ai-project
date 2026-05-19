import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { apiGet } from '../api'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BarChartIcon from '@mui/icons-material/BarChart'
import CloseIcon from '@mui/icons-material/Close'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'

const dayShort = {
    MONDAY: 'Du', TUESDAY: 'Se', WEDNESDAY: 'Ch',
    THURSDAY: 'Pa', FRIDAY: 'Ju', SATURDAY: 'Sh', SUNDAY: 'Ya',
}
const monthUz = {
    January: 'Yan', February: 'Fev', March: 'Mar', April: 'Apr',
    May: 'May', June: 'Iyun', July: 'Iyul', August: 'Avg',
    September: 'Sen', October: 'Okt', November: 'Noy', December: 'Dek',
}
const monthNum = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
}
const TABS = ["Ma'lumotlar", 'Guruh darsliklari', 'Akademik davomati']
const SHOW_INIT = 2

export default function GroupDetail() {
    const { id }     = useParams()
    const navigate   = useNavigate()
    const { state }  = useLocation()
    const basicGroup = state?.group ?? null

    const [stats, setStats]               = useState(null)
    const [schedules, setSchedules]       = useState(null)
    const [loading, setLoading]           = useState(true)
    const [tab, setTab]                   = useState(0)
    const [mentorsOpen, setMentorsOpen]   = useState(true)
    const [paramsOpen, setParamsOpen]     = useState(true)
    const [monthIdx, setMonthIdx]         = useState(1)
    const [showAll, setShowAll]             = useState(false)
    const [showAllMonths, setShowAllMonths] = useState(false)
    const [subTab, setSubTab]               = useState(0)
    const [homeworks, setHomeworks]         = useState([])

    useEffect(() => {
        let cancelled = false
        Promise.all([
            apiGet(`/groups/${id}`),
            apiGet(`/groups/${id}/schedules`),
            apiGet(`/groups/${id}/homeworks`).catch(() => []),
        ]).then(([statsRes, schedRes, hwRes]) => {
            if (cancelled) return
            setStats(statsRes?.data ?? statsRes)
            const raw = Array.isArray(schedRes) ? schedRes[0] : (schedRes?.data ?? schedRes)
            setHomeworks(Array.isArray(hwRes) ? hwRes : (hwRes?.data ?? []))
            setSchedules(raw ?? null)
        }).catch(() => {}).finally(() => { if (!cancelled) setLoading(false) })
        return () => { cancelled = true }
    }, [id])

    const name      = basicGroup?.name ?? `Guruh #${id}`
    const isActive  = basicGroup?.active !== false
    const weekDays  = Array.isArray(basicGroup?.week_day) ? basicGroup.week_day : []
    const startTime = basicGroup?.start_time ?? '—'
    const endTime   = basicGroup?.end_time   ?? ''
    const roomName  = basicGroup?.room?.name ?? basicGroup?.room ?? '—'

    const teachers     = Array.isArray(stats?.teachers) ? stats.teachers : []
    const course       = stats?.course ?? basicGroup?.course ?? null
    const courseName   = course?.name ?? '—'
    const duration     = course?.duration_month ?? 0
    const avgAge       = stats?.averageAge ?? '—'
    const studentCount = stats?.student_count ?? (Array.isArray(basicGroup?.students) ? basicGroup.students.length : '—')
    const roomCapacity = stats?.room_capacity ?? basicGroup?.max_student ?? '—'

    /* Month keys from schedules e.g. ["1","2","3"] */
    const monthKeys  = schedules ? Object.keys(schedules).sort((a, b) => Number(a) - Number(b)) : []
    const totalMonths = monthKeys.length || duration || 1
    const currentKey  = String(monthIdx)

    /* Determine past vs future for calendar */
    const today = new Date()
    const isPast = (d) => {
        const year = today.getFullYear()
        const mIdx = monthNum[d.month] ?? 0
        const date = new Date(year, mIdx, d.day)
        return date < today
    }

    /* Date range label */
    const fmtDate = (dateStr) => {
        if (!dateStr) return '—'
        const d = new Date(dateStr)
        return `${d.getDate()} ${monthUz[d.toLocaleString('en', { month: 'long' })]}, ${d.getFullYear()}`
    }
    const startDate  = basicGroup?.start_date ?? null
    const endDate    = (() => {
        if (!startDate || !duration) return null
        const d = new Date(startDate)
        d.setMonth(d.getMonth() + Number(duration))
        return d.toISOString()
    })()
    const dateRange = startDate ? `${fmtDate(startDate)} - ${fmtDate(endDate)}` : '—'
    const daysLabel = weekDays.map(d => dayShort[d] ?? d).join('/')
    const timeLabel = startTime !== '—' ? `${startTime} dan - ${endTime || '?'} gacha` : '—'

    const visibleTeachers = showAll ? teachers : teachers.slice(0, SHOW_INIT)
    const hiddenCount     = teachers.length - SHOW_INIT

    return (
        <div className="flex flex-col gap-0">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        onClick={() => navigate('/dashboard/guruhlar')}
                        className="border-none bg-transparent cursor-pointer p-1.5 rounded-lg text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors flex items-center shrink-0"
                    >
                        <ArrowBackIcon sx={{ fontSize: 20 }} />
                    </button>
                    <h1 className="m-0 text-xl sm:text-2xl font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">{name}</h1>
                    <span className={`px-3 py-0.5 rounded-full text-[12px] font-semibold ${isActive ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#f3f4f6] dark:bg-[#374151] text-[#6b7280]'}`}>
                        {isActive ? 'Aktiv' : 'Nofaol'}
                    </span>
                </div>
                <button className="flex items-center gap-2 border border-[#e8e8e8] dark:border-[#2d3748] bg-transparent text-[#1a1a2e] dark:text-[#e2e8f0] rounded-[10px] px-4 py-2 text-[13px] font-medium cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors w-fit shrink-0">
                    <BarChartIcon sx={{ fontSize: 18 }} /> Statistika
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#e8e8e8] dark:border-[#2d3748] mb-5">
                {TABS.map((t, i) => (
                    <button key={t} onClick={() => setTab(i)}
                        className={`px-4 py-3 text-sm font-medium border-none bg-transparent cursor-pointer transition-colors duration-200 border-b-2 -mb-px whitespace-nowrap ${tab === i ? 'text-[#7E56D8] border-[#7E56D8]' : 'text-[#6b7280] dark:text-[#94a3b8] border-transparent hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0]'}`}
                    >{t}</button>
                ))}
            </div>

            {tab === 0 && (
                <div className="flex flex-col gap-5">
                    {loading ? (
                        <div className="flex items-center justify-center h-40 text-[#6b7280] dark:text-[#94a3b8] text-sm">Yuklanmoqda...</div>
                    ) : (
                        <>
                            {/* Top cards */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                                {/* Guruh mentorlari */}
                                <div className="rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
                                    <div className="flex items-center justify-between px-5 py-3.5 bg-[#4a90d9] cursor-pointer select-none" onClick={() => setMentorsOpen(o => !o)}>
                                        <span className="text-white font-semibold text-[15px]">Guruh mentorlari</span>
                                        <span className={`text-white/80 transition-transform duration-200 ${mentorsOpen ? 'rotate-0' : 'rotate-45'}`}>
                                            <CloseIcon sx={{ fontSize: 18 }} />
                                        </span>
                                    </div>
                                    {mentorsOpen && (
                                        <div className="bg-white dark:bg-[#1e2a3a] px-5 py-5 flex flex-wrap gap-6 min-h-27.5 items-start">
                                            {teachers.length === 0 ? (
                                                <p className="text-[#6b7280] dark:text-[#94a3b8] text-sm m-0 w-full text-center py-4">O'qituvchi yo'q</p>
                                            ) : teachers.map((t, i) => {
                                                const tName  = t.full_name ?? t.name ?? `Teacher ${i + 1}`
                                                const tPhoto = t.photo ?? null
                                                return (
                                                    <div key={t.id ?? i} className="flex flex-col items-center gap-2">
                                                        {tPhoto ? (
                                                            <img
                                                                src={`https://najot-edu.softwareengineer.uz/files/${tPhoto}`}
                                                                alt={tName}
                                                                className="w-14 h-14 rounded-full object-cover border-2 border-[#e8e8e8] dark:border-[#2d3748]"
                                                                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                                                            />
                                                        ) : null}
                                                        <div
                                                            className="w-14 h-14 rounded-full bg-linear-to-br from-[#7E56D8] to-[#5c3fb5] flex items-center justify-center text-white text-lg font-bold"
                                                            style={{ display: tPhoto ? 'none' : 'flex' }}
                                                        >
                                                            {tName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="m-0 text-[11px] font-semibold text-[#16a34a]">Teacher</p>
                                                            <p className="m-0 text-[13px] font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">{tName.split(' ')[0]}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Parametrlar */}
                                <div className="rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
                                    <div className="flex items-center justify-between px-5 py-3.5 bg-[#4a90d9] cursor-pointer select-none" onClick={() => setParamsOpen(o => !o)}>
                                        <span className="text-white font-semibold text-[15px]">Parametrlar</span>
                                        <span className={`text-white/80 transition-transform duration-200 ${paramsOpen ? 'rotate-0' : 'rotate-45'}`}>
                                            <CloseIcon sx={{ fontSize: 18 }} />
                                        </span>
                                    </div>
                                    {paramsOpen && (
                                        <div className="bg-white dark:bg-[#1e2a3a] divide-y divide-[#e8e8e8] dark:divide-[#2d3748]">
                                            {[
                                                ['Kurs',                      courseName],
                                                ["O'rta yosh",                avgAge],
                                                ["O'quvchilar sig'imi",        roomCapacity],
                                                ["Mavjud o'quvchilar",         studentCount],
                                                ["O'quv oyidagi darslar soni", '—'],
                                                ['Kurs davomiyligi (oy)',       duration || '—'],
                                                ['Jami darslar soni',          '—'],
                                            ].map(([label, value]) => (
                                                <div key={label} className="flex justify-between items-center px-5 py-2.5">
                                                    <span className="text-[13px] text-[#6b7280] dark:text-[#94a3b8]">{label}</span>
                                                    <span className="text-[13px] font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Dars jadvali */}
                            <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] overflow-hidden">
                                <div className="px-5 py-4 border-b border-[#e8e8e8] dark:border-[#2d3748]">
                                    <h3 className="m-0 text-[15px] font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Dars jadvali</h3>
                                </div>

                                {/* Teacher rows */}
                                <div className="divide-y divide-[#e8e8e8] dark:divide-[#2d3748]">
                                    {teachers.length === 0 ? (
                                        <p className="px-5 py-6 text-center text-sm text-[#6b7280] dark:text-[#94a3b8] m-0">Jadval mavjud emas</p>
                                    ) : visibleTeachers.map((t, i) => {
                                        const tName = t.full_name ?? t.name ?? `Teacher ${i + 1}`
                                        return (
                                            <div key={t.id ?? i} className="flex flex-wrap sm:flex-nowrap items-center gap-3 px-5 py-3.5 text-[13px]">
                                                <span className="text-[#4a90d9] font-semibold min-w-36 cursor-pointer hover:underline">{tName}</span>
                                                <span className="text-[#6b7280] dark:text-[#94a3b8] min-w-28">{daysLabel || '—'}</span>
                                                <span className="text-[#1a1a2e] dark:text-[#e2e8f0] min-w-40">{timeLabel}</span>
                                                <span className="text-[#6b7280] dark:text-[#94a3b8] min-w-48">{dateRange}</span>
                                                <span className="text-[#6b7280] dark:text-[#94a3b8]">{roomName}</span>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Show more */}
                                {hiddenCount > 0 && (
                                    <div className="px-5 py-3 border-t border-[#e8e8e8] dark:border-[#2d3748] flex justify-center">
                                        <button
                                            onClick={() => setShowAll(s => !s)}
                                            className="border border-[#e8e8e8] dark:border-[#2d3748] bg-transparent text-[#1a1a2e] dark:text-[#e2e8f0] rounded-lg px-5 py-2 text-[13px] cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors"
                                        >
                                            {showAll ? "Yig'ish" : `Yana ko'rsatish (${hiddenCount})`}
                                        </button>
                                    </div>
                                )}

                                {/* Month navigation */}
                                <div className="px-5 py-4 border-t border-[#e8e8e8] dark:border-[#2d3748]">
                                    <div className="flex items-center gap-3 mb-4">
                                        <button
                                            onClick={() => setMonthIdx(m => Math.max(1, m - 1))}
                                            disabled={monthIdx <= 1}
                                            className="w-7 h-7 flex items-center justify-center rounded-full border border-[#e8e8e8] dark:border-[#2d3748] bg-transparent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors text-[#1a1a2e] dark:text-[#e2e8f0]"
                                        >
                                            <ChevronLeftIcon sx={{ fontSize: 16 }} />
                                        </button>
                                        <span className="text-[13px] font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">
                                            {monthIdx}-o'quv oyi
                                        </span>
                                        <button
                                            onClick={() => setMonthIdx(m => Math.min(totalMonths, m + 1))}
                                            disabled={monthIdx >= totalMonths}
                                            className="w-7 h-7 flex items-center justify-center rounded-full border border-[#e8e8e8] dark:border-[#2d3748] bg-transparent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors text-[#1a1a2e] dark:text-[#e2e8f0]"
                                        >
                                            <ChevronRightIcon sx={{ fontSize: 16 }} />
                                        </button>
                                    </div>

                                    {/* Calendar days */}
                                    {(showAllMonths ? monthKeys : [currentKey]).some(k => (schedules?.[k]?.days ?? []).length > 0) ? (
                                        <>
                                            {(showAllMonths ? monthKeys : [currentKey]).map(k => {
                                                const mDays = schedules?.[k]?.days ?? []
                                                if (!mDays.length) return null
                                                return (
                                                    <div key={k} className={showAllMonths ? 'mb-5' : ''}>
                                                        {showAllMonths && (
                                                            <p className="m-0 mb-2 text-[13px] font-semibold text-[#6b7280] dark:text-[#94a3b8]">{k}-o'quv oyi</p>
                                                        )}
                                                        <div className="flex flex-wrap gap-2">
                                                            {mDays.map((d, i) => {
                                                                const past = d.isCompleted || isPast(d)
                                                                return (
                                                                    <div key={i} className={`flex flex-col items-center justify-center w-11 h-13 rounded-xl border text-[12px] font-medium transition-colors ${past ? 'bg-[#dde1e8] dark:bg-[#374151] border-[#c8cdd6] dark:border-[#4a5568] text-[#6b7280] dark:text-[#9ca3af]' : 'bg-white dark:bg-[#1e2a3a] border-[#e8e8e8] dark:border-[#2d3748] text-[#1a1a2e] dark:text-[#e2e8f0] shadow-sm'}`}>
                                                                        <span className="text-[11px] text-[#6b7280] dark:text-[#94a3b8]">{monthUz[d.month] ?? d.month}</span>
                                                                        <span className="font-bold text-[14px]">{d.day}</span>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            <div className="mt-4 flex justify-center">
                                                <button
                                                    onClick={() => setShowAllMonths(s => !s)}
                                                    className="border border-[#e8e8e8] dark:border-[#2d3748] bg-transparent text-[#1a1a2e] dark:text-[#e2e8f0] rounded-lg px-6 py-2 text-[13px] cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors"
                                                >
                                                    {showAllMonths ? "Yig'ish" : "Barchasini ko'rish"}
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-center text-sm text-[#6b7280] dark:text-[#94a3b8] m-0 py-4">Bu oy uchun dars yo'q</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {tab === 1 && (
                <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                    {/* Sub-tab bar */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-[#e8e8e8] dark:border-[#2d3748]">
                        <div className="flex gap-1 bg-[#f3f4f6] dark:bg-[#2d3748] p-1 rounded-xl">
                            {['Uyga vazifa', 'Videolar', 'Imtihonlar', 'Jurnal'].map((label, i) => (
                                <button
                                    key={label}
                                    onClick={() => setSubTab(i)}
                                    className={`px-4 py-1.5 rounded-lg text-[13px] font-medium border-none cursor-pointer transition-all duration-200 ${subTab === i ? 'bg-white dark:bg-[#1e2a3a] text-[#1a1a2e] dark:text-[#e2e8f0] shadow-sm border border-[#e8e8e8] dark:border-[#374151]' : 'bg-transparent text-[#6b7280] dark:text-[#94a3b8] hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0]'}`}
                                >{label}</button>
                            ))}
                        </div>
                        <button className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white border-none rounded-lg px-4 py-2 text-[13px] font-semibold cursor-pointer transition-colors">
                            + Qo'shish
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-[13px] border-collapse">
                            <thead>
                                <tr className="bg-[#f8f9fa] dark:bg-[#162032] text-[#6b7280] dark:text-[#94a3b8]">
                                    <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">#</th>
                                    <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">Mavzu</th>
                                    <th className="text-center px-4 py-3 font-semibold whitespace-nowrap">
                                        <span className="flex items-center justify-center gap-1"><PersonOutlineIcon sx={{ fontSize: 15 }} /></span>
                                    </th>
                                    <th className="text-center px-4 py-3 font-semibold whitespace-nowrap">
                                        <span className="flex items-center justify-center gap-1 text-orange-400"><AccessTimeIcon sx={{ fontSize: 15 }} /></span>
                                    </th>
                                    <th className="text-center px-4 py-3 font-semibold whitespace-nowrap">
                                        <span className="flex items-center justify-center gap-1 text-green-500"><CheckCircleOutlineIcon sx={{ fontSize: 15 }} /></span>
                                    </th>
                                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Berilgan vaqt</th>
                                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Tugash vaqti</th>
                                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Dars sanasi</th>
                                    <th className="px-3 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0f0f0] dark:divide-[#2d3748]">
                                {homeworks.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-12 text-[#6b7280] dark:text-[#94a3b8]">
                                            Uyga vazifalar mavjud emas
                                        </td>
                                    </tr>
                                ) : homeworks.map((hw, i) => (
                                    <tr key={hw.id ?? i} className="hover:bg-[#f8f9fa] dark:hover:bg-[#162032] transition-colors">
                                        <td className="px-5 py-3.5 text-[#6b7280] dark:text-[#94a3b8]">{i + 1}</td>
                                        <td className="px-5 py-3.5 font-medium text-[#1a1a2e] dark:text-[#e2e8f0] max-w-50 truncate">{hw.title ?? hw.name ?? '—'}</td>
                                        <td className="px-4 py-3.5 text-center text-[#6b7280] dark:text-[#94a3b8]">{hw.student_count ?? hw.students ?? '—'}</td>
                                        <td className="px-4 py-3.5 text-center text-orange-400">{hw.pending_count ?? hw.pending ?? '—'}</td>
                                        <td className="px-4 py-3.5 text-center text-green-500">{hw.done_count ?? hw.done ?? '—'}</td>
                                        <td className="px-4 py-3.5 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">{hw.given_at ? fmtDate(hw.given_at) : '—'}</td>
                                        <td className="px-4 py-3.5 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">{hw.deadline ? fmtDate(hw.deadline) : '—'}</td>
                                        <td className="px-4 py-3.5 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">{hw.lesson_date ? fmtDate(hw.lesson_date) : '—'}</td>
                                        <td className="px-3 py-3.5">
                                            <button className="border-none bg-transparent cursor-pointer text-[#6b7280] dark:text-[#94a3b8] hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0] p-1 rounded transition-colors">
                                                <MoreVertIcon sx={{ fontSize: 18 }} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 2 && (
                <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-10 text-center text-[#6b7280] dark:text-[#94a3b8] text-sm">
                    Akademik davomati mavjud emas
                </div>
            )}
        </div>
    )
}
