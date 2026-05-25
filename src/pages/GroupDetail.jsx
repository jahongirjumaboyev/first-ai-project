import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { apiGet } from '../api'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BarChartIcon from '@mui/icons-material/BarChart'
import MentorsCard from '../components/group-detail/MentorsCard'
import ParametersCard from '../components/group-detail/ParametersCard'
import ScheduleCard from '../components/group-detail/ScheduleCard'
import HomeworksTab from '../components/group-detail/HomeworksTab'

const dayShort = {
    MONDAY: 'Du', TUESDAY: 'Se', WEDNESDAY: 'Ch',
    THURSDAY: 'Pa', FRIDAY: 'Ju', SATURDAY: 'Sh', SUNDAY: 'Ya',
}
const monthUz = {
    January: 'Yan', February: 'Fev', March: 'Mar', April: 'Apr',
    May: 'May', June: 'Iyun', July: 'Iyul', August: 'Avg',
    September: 'Sen', October: 'Okt', November: 'Noy', December: 'Dek',
}

const TABS = ["Ma'lumotlar", 'Guruh darsliklari', 'Akademik davomati']

function fmtDate(dateStr) {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return `${d.getDate()} ${monthUz[d.toLocaleString('en', { month: 'long' })]}, ${d.getFullYear()}`
}

export default function GroupDetail() {
    const { id }     = useParams()
    const navigate   = useNavigate()
    const { state }  = useLocation()
    const basicGroup = state?.group ?? null

    const [stats, setStats]           = useState(null)
    const [schedules, setSchedules]   = useState(null)
    const [loading, setLoading]       = useState(true)
    const [tab, setTab]               = useState(0)
    const [mentorsOpen, setMentorsOpen] = useState(true)
    const [paramsOpen, setParamsOpen]   = useState(true)
    const tabsRef = useRef([])
    const [indicator, setIndicator] = useState({ left: 0, width: 0 })

    useEffect(() => {
        let cancelled = false
        Promise.all([
            apiGet(`/groups/${id}`),
            apiGet(`/groups/${id}/schedules`),
        ]).then(([statsRes, schedRes]) => {
            if (cancelled) return
            setStats(statsRes?.data ?? statsRes)
            const raw = Array.isArray(schedRes) ? schedRes[0] : (schedRes?.data ?? schedRes)
            setSchedules(raw ?? null)
        }).catch(() => {}).finally(() => { if (!cancelled) setLoading(false) })
        return () => { cancelled = true }
    }, [id])

    useLayoutEffect(() => {
        function update() {
            const el = tabsRef.current[tab]
            if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
        }
        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [tab, schedules])

    const name        = basicGroup?.name ?? `Guruh #${id}`
    const isActive    = basicGroup?.active !== false
    const weekDays    = Array.isArray(basicGroup?.week_day) ? basicGroup.week_day : []
    const startTime   = basicGroup?.start_time ?? '—'
    const endTime     = basicGroup?.end_time ?? ''
    const roomName    = basicGroup?.room?.name ?? basicGroup?.room ?? '—'

    const teachers      = Array.isArray(stats?.teachers) ? stats.teachers : []
    const course        = stats?.course ?? basicGroup?.course ?? null
    const courseName    = course?.name ?? '—'
    const duration      = course?.duration_month ?? 0
    const avgAge        = stats?.averageAge ?? '—'
    const studentCount  = stats?.student_count ?? (Array.isArray(basicGroup?.students) ? basicGroup.students.length : '—')
    const roomCapacity  = stats?.room_capacity ?? basicGroup?.max_student ?? '—'

    const startDate = basicGroup?.start_date ?? null
    const endDate   = (() => {
        if (!startDate || !duration) return null
        const d = new Date(startDate)
        d.setMonth(d.getMonth() + Number(duration))
        return d.toISOString()
    })()
    const dateRange  = startDate ? `${fmtDate(startDate)} - ${fmtDate(endDate)}` : '—'
    const daysLabel  = weekDays.map(d => dayShort[d] ?? d).join('/')
    const timeLabel  = startTime !== '—' ? `${startTime} dan - ${endTime || '?'} gacha` : '—'

    return (
        <div className="flex flex-col gap-0">

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

            <div className="relative mb-5">
                <div className="flex border-b border-[#e8e8e8] dark:border-[#2d3748]">
                    {TABS.map((t, i) => (
                        <button
                            key={t}
                            ref={el => tabsRef.current[i] = el}
                            onClick={() => setTab(i)}
                            className={`px-4 py-3 text-sm font-medium border-none bg-transparent cursor-pointer transition-colors duration-200 whitespace-nowrap ${tab === i ? 'text-[#7E56D8]' : 'text-[#6b7280] dark:text-[#94a3b8] hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0]'}`}
                        >{t}</button>
                    ))}
                </div>
                <div
                    aria-hidden
                    className="absolute -mb-1 left-0 h-1 bg-[#7E56D8] rounded-full transition-all duration-200"
                    style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
                />
            </div>

            {tab === 0 && (
                <div className="flex flex-col gap-5">
                    {loading ? (
                        <div className="flex items-center justify-center h-40 text-[#6b7280] dark:text-[#94a3b8] text-sm">Yuklanmoqda...</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                <MentorsCard
                                    teachers={teachers}
                                    open={mentorsOpen}
                                    onToggle={() => setMentorsOpen(o => !o)}
                                />
                                <ParametersCard
                                    courseName={courseName}
                                    avgAge={avgAge}
                                    roomCapacity={roomCapacity}
                                    studentCount={studentCount}
                                    duration={duration}
                                    open={paramsOpen}
                                    onToggle={() => setParamsOpen(o => !o)}
                                />
                            </div>
                            <ScheduleCard
                                teachers={teachers}
                                daysLabel={daysLabel}
                                timeLabel={timeLabel}
                                dateRange={dateRange}
                                roomName={roomName}
                                schedules={schedules}
                            />
                        </>
                    )}
                </div>
            )}

            {tab === 1 && (
                <HomeworksTab groupId={id} />
            )}

            {tab === 2 && (
                <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-10 text-center text-[#6b7280] dark:text-[#94a3b8] text-sm">
                    Akademik davomati mavjud emas
                </div>
            )}
        </div>
    )
}
