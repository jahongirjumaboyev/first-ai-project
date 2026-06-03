import { useState, useRef, useEffect, useCallback } from 'react'
import { apiGet, apiPostForm } from '../../api'
import ImtihonlarTab from './ImtihonlarTab'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'

const monthUz = {
    January: 'Yan', February: 'Fev', March: 'Mar', April: 'Apr',
    May: 'May', June: 'Iyun', July: 'Iyul', August: 'Avg',
    September: 'Sen', October: 'Okt', November: 'Noy', December: 'Dek',
}

function fmtDate(dateStr) {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return `${d.getDate()} ${monthUz[d.toLocaleString('en', { month: 'long' })]}, ${d.getFullYear()}`
}

function fmtSize(bytes) {
    if (bytes == null || isNaN(bytes)) return '—'
    const n = Number(bytes)
    if (n < 1024) return `${n} B`
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
    return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

const SUB_TABS = ['Uyga vazifa', 'Videolar', 'Imtihonlar', 'Jurnal']

function ToolBtn({ children, title }) {
    return (
        <button
            type="button"
            title={title}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0fdf4] dark:hover:bg-[#0f2a1e] text-[#374151] dark:text-[#94a3b8] hover:text-[#10b981] transition-colors"
        >
            {children}
        </button>
    )
}

function Sep() {
    return <div className="w-px h-5 bg-[#e5e7eb] dark:bg-[#2d3748] mx-1 flex-shrink-0" />
}

export default function HomeworksTab({ groupId }) {
    const [subTab, setSubTab]         = useState(0)
    const [homeworks, setHomeworks]   = useState([])
    const [hwLoading, setHwLoading]   = useState(false)
    const [creating, setCreating]     = useState(false)
    const [selectedLessonId, setSelectedLessonId] = useState('')
    const [title, setTitle]           = useState('')
    const [file, setFile]             = useState(null)
    const [saving, setSaving]         = useState(false)
    const [toast, setToast]           = useState(null)
    const [lessons, setLessons]       = useState([])
    const fileInputRef                = useRef(null)
    const tabRefs                     = useRef([])
    const [activeLeft, setActiveLeft] = useState(0)
    const [activeWidth, setActiveWidth] = useState(0)

    /* Videolar tab */
    const [videos, setVideos]               = useState([])
    const [videosLoading, setVideosLoading] = useState(false)
    const videosFetched                     = useRef(false)
    const [videoModalOpen, setVideoModalOpen] = useState(false)
    const [videoFile, setVideoFile]         = useState(null)
    const [videoLessonId, setVideoLessonId] = useState('')
    const [videoName, setVideoName]         = useState('')
    const [videoUploading, setVideoUploading] = useState(false)
    const videoInputRef                     = useRef(null)

    const showToast = useCallback((message, type) => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3500)
    }, [])

    const loadHomeworks = useCallback(() => {
        setHwLoading(true)
        return apiGet(`/homework/${groupId}`)
            .then(res => setHomeworks(res?.data ?? res ?? []))
            .catch(err => showToast(err.message || "Ma'lumot yuklanmadi", 'error'))
            .finally(() => setHwLoading(false))
    }, [groupId, showToast])

    useEffect(() => {
        loadHomeworks()
    }, [loadHomeworks])

    useEffect(() => {
        const btn = tabRefs.current[subTab]
        if (btn) {
            setActiveLeft(btn.offsetLeft)
            setActiveWidth(btn.offsetWidth)
        }
    }, [subTab])

    const loadVideos = useCallback(() => {
        setVideosLoading(true)
        return apiGet(`/files/${groupId}`)
            .then(res => setVideos(res?.data ?? res ?? []))
            .catch(err => showToast(err.message || "Ma'lumot yuklanmadi", 'error'))
            .finally(() => setVideosLoading(false))
    }, [groupId, showToast])

    const switchSubTab = (i) => {
        setSubTab(i)
        if (i === 1 && !videosFetched.current) {
            videosFetched.current = true
            loadVideos()
        }
    }

    const openCreate = () => {
        setCreating(true)
        apiGet(`/lessons/my/group/${groupId}`)
            .then(res => setLessons(Array.isArray(res) ? res : (res?.data ?? [])))
            .catch(() => {})
    }

    const openVideoModal = () => {
        setVideoModalOpen(true)
        apiGet(`/lessons/my/group/${groupId}`)
            .then(res => setLessons(Array.isArray(res) ? res : (res?.data ?? [])))
            .catch(() => {})
    }

    const closeVideoModal = () => {
        setVideoModalOpen(false)
        setVideoFile(null)
        setVideoLessonId('')
        setVideoName('')
    }

    const onVideoChosen = (f) => {
        if (!f) return
        setVideoFile(f)
        setVideoName(f.name)
    }
    const handleVideoInput = (e) => onVideoChosen(e.target.files?.[0])
    const handleVideoDrop = (e) => {
        e.preventDefault()
        onVideoChosen(e.dataTransfer.files?.[0])
    }
    const removeVideoFile = () => {
        setVideoFile(null)
        setVideoLessonId('')
        setVideoName('')
    }

    const handleVideoUpload = async () => {
        if (!videoFile)      { showToast('Videofaylni tanlang', 'error'); return }
        if (!videoLessonId)  { showToast('Darsni tanlang', 'error'); return }
        setVideoUploading(true)
        try {
            const fd = new FormData()
            fd.append('file', videoFile)
            await apiPostForm(`/files/group/${groupId}/upload?lessonId=${videoLessonId}`, fd)
            showToast('Video yuklandi', 'success')
            closeVideoModal()
            loadVideos()
        } catch (err) {
            showToast(err.message || 'Xatolik yuz berdi', 'error')
        } finally {
            setVideoUploading(false)
        }
    }

    const cancelCreate = () => {
        setCreating(false)
        setSelectedLessonId('')
        setTitle('')
        setFile(null)
    }

    const handleFile = (e) => setFile(e.target.files?.[0] ?? null)
    const handleDrop = (e) => {
        e.preventDefault()
        const dropped = e.dataTransfer.files?.[0]
        if (dropped) setFile(dropped)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedLessonId) { showToast('Mavzuni tanlang', 'error'); return }
        if (!title.trim())  { showToast('Izoh kiriting', 'error'); return }
        setSaving(true)
        try {
            const fd = new FormData()
            fd.append('group_id', groupId)
            fd.append('lesson_id', selectedLessonId)
            fd.append('title', title.trim())
            if (file) fd.append('file', file)

            await apiPostForm('/homework', fd)

            showToast("Uyga vazifa qo'shildi", 'success')
            cancelCreate()
            loadHomeworks()
        } catch (err) {
            showToast(err.message || 'Xatolik yuz berdi', 'error')
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            {toast && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-6 py-3 rounded-[10px] text-[13px] font-semibold text-white shadow-[0_6px_24px_rgba(0,0,0,0.25)] animate-slideDown ${toast.type === 'success' ? 'bg-[#1F2D5C]' : 'bg-[#c0392b]'}`}>
                    {toast.message}
                </div>
            )}

            {creating ? (
                /* ── Full-tab create form ── */
                <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            type="button"
                            onClick={cancelCreate}
                            className="border-none bg-transparent cursor-pointer text-[#111827] dark:text-[#e2e8f0] flex items-center p-1 rounded-lg hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors"
                        >
                            <ArrowBackIcon sx={{ fontSize: 20 }} />
                        </button>
                        <h2 className="m-0 text-xl sm:text-2xl font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Yangi uyga vazifa yaratish</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="max-w-4xl w-full">

                        {/* Mavzu */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-[#1a1a2e] dark:text-[#e2e8f0] mb-2">
                                <span className="text-red-500">*</span> Mavzu
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedLessonId}
                                    onChange={e => setSelectedLessonId(e.target.value)}
                                    className="w-full bg-[#f8fafc] dark:bg-[#0f1827] border border-[#eef3f7] dark:border-[#2d3748] rounded-md p-3 pr-10 text-sm text-[#1a1a2e] dark:text-[#e2e8f0] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 focus:border-[#10b981]"
                                >
                                    <option value="">Mavzulardan birini tanlang</option>
                                    {lessons.map(l => (
                                        <option key={l.id} value={l.id}>
                                            {l.title ?? l.topic ?? l.name}
                                        </option>
                                    ))}
                                </select>
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280]">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* Izoh */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-[#1a1a2e] dark:text-[#e2e8f0] mb-2">
                                <span className="text-red-500">*</span> Izoh
                            </label>
                            <div className="border border-[#e5e7eb] dark:border-[#2d3748] rounded-lg bg-white dark:bg-[#0f1827] shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#10b981]/30 focus-within:border-[#10b981]">

                                <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-[#f0f0f0] dark:border-[#2d3748] bg-[#fafafa] dark:bg-[#162032]">
                                    <ToolBtn title="Bold"><span className="font-bold text-[15px] leading-none">B</span></ToolBtn>
                                    <ToolBtn title="Italic"><span className="italic font-semibold text-[15px] leading-none">I</span></ToolBtn>
                                    <ToolBtn title="Underline"><span className="underline text-[15px] leading-none">U</span></ToolBtn>
                                    <ToolBtn title="Strikethrough"><span className="line-through text-[15px] leading-none">S</span></ToolBtn>
                                    <Sep />
                                    <ToolBtn title="Code">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="16 18 22 12 16 6" />
                                            <polyline points="8 6 2 12 8 18" />
                                        </svg>
                                    </ToolBtn>
                                    <Sep />
                                    <ToolBtn title="Bullet list">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="9" y1="6" x2="20" y2="6" />
                                            <line x1="9" y1="12" x2="20" y2="12" />
                                            <line x1="9" y1="18" x2="20" y2="18" />
                                            <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
                                            <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
                                            <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
                                        </svg>
                                    </ToolBtn>
                                    <ToolBtn title="Numbered list">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="10" y1="6" x2="21" y2="6" />
                                            <line x1="10" y1="12" x2="21" y2="12" />
                                            <line x1="10" y1="18" x2="21" y2="18" />
                                            <path d="M4 6h1v4" />
                                            <path d="M4 10h2" />
                                            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
                                        </svg>
                                    </ToolBtn>
                                    <Sep />
                                    <ToolBtn title="Align left">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="21" y1="6" x2="3" y2="6" />
                                            <line x1="15" y1="12" x2="3" y2="12" />
                                            <line x1="17" y1="18" x2="3" y2="18" />
                                        </svg>
                                    </ToolBtn>
                                    <ToolBtn title="Align right">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="21" y1="6" x2="3" y2="6" />
                                            <line x1="21" y1="12" x2="9" y2="12" />
                                            <line x1="21" y1="18" x2="7" y2="18" />
                                        </svg>
                                    </ToolBtn>
                                </div>

                                <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    className="p-4 min-h-[160px] text-sm text-[#374151] dark:text-[#e2e8f0] focus:outline-none"
                                    onInput={e => setTitle(e.currentTarget.textContent || '')}
                                >
                                    {!title && (
                                        <span className="text-[#9aa4b2] pointer-events-none select-none">
                                            Vazifa haqida batafsil ma'lumot kiriting...
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* File upload */}
                        <div className="mb-8">
                            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFile} />
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={e => e.preventDefault()}
                                onDrop={handleDrop}
                                role="button"
                                tabIndex={0}
                                className="border-2 border-dashed border-[#a7f3d0] dark:border-[#0f5132] rounded-xl py-10 sm:py-14 px-4 text-center bg-white dark:bg-[#0f1827] cursor-pointer hover:border-[#10b981] hover:bg-[#f0fdf4] dark:hover:bg-[#0f2a1e] transition-colors"
                            >
                                <div className="flex justify-center mb-4">
                                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <polyline points="16 16 12 12 8 16" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <line x1="12" y1="12" x2="12" y2="21" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="m-0 text-[#10b981] font-medium text-sm sm:text-base">Faylni tanlash yoki shu yerga tashlang</p>
                            </div>
                            {file && (
                                <div className="mt-3 text-sm text-[#374151] dark:text-[#e2e8f0] text-left truncate">{file.name}</div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row sm:justify-end items-stretch sm:items-center gap-3 sm:gap-4">
                            <button
                                type="button"
                                onClick={cancelCreate}
                                className="px-8 py-3 rounded-full bg-white dark:bg-transparent border border-[#e5e7eb] dark:border-[#2d3748] text-[#6b7280] dark:text-[#94a3b8] text-base font-medium hover:bg-[#f9fafb] dark:hover:bg-[#2d3748] transition-colors cursor-pointer"
                            >
                                Bekor qilish
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className={`px-8 py-3 rounded-full text-white text-base font-semibold shadow-md transition-colors ${saving ? 'bg-[#86efac] cursor-not-allowed' : 'bg-[#10b981] hover:bg-[#059669] cursor-pointer'}`}
                            >
                                {saving ? 'Saqlanmoqda...' : "E'lon qilish"}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    {/* Header card: title + button + tabs */}
                    <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                        <h3 className="m-0 px-5 pt-4 text-[15px] font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Guruh darsliklari</h3>

                        <div className="flex items-center justify-between px-5 pt-3 pb-4 gap-3">
                            <div className="bg-[#f3f4f6] dark:bg-[#2d3748] rounded-xl p-1 inline-flex relative shrink-0">
                                <div
                                    className="absolute bg-white dark:bg-[#1e2a3a] rounded-lg shadow-sm"
                                    style={{
                                        left: activeLeft,
                                        width: activeWidth,
                                        top: '4px',
                                        bottom: '4px',
                                        transition: 'left 0.25s ease, width 0.25s ease',
                                    }}
                                />
                                {SUB_TABS.map((label, i) => (
                                    <button
                                        key={label}
                                        ref={el => { tabRefs.current[i] = el }}
                                        onClick={() => switchSubTab(i)}
                                        className={`px-5 py-2 text-[13px] font-medium rounded-lg border-none cursor-pointer bg-transparent relative z-10 transition-colors duration-200 whitespace-nowrap
                                            ${subTab === i
                                                ? 'text-[#7c3aed] font-semibold'
                                                : 'text-[#6b7280] hover:text-[#1a1a2e]'
                                            }`}
                                    >{label}</button>
                                ))}
                            </div>

                            {subTab !== 2 && (
                                <button
                                    onClick={() => subTab === 1 ? openVideoModal() : openCreate()}
                                    className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white border-none rounded-lg px-5 py-2 text-[13px] font-semibold cursor-pointer transition-colors shrink-0"
                                >
                                    + Qo'shish
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Per-tab content */}
                    {subTab === 1 && (
                        <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-[13px] border-collapse">
                                    <thead>
                                        <tr className="bg-[#f8f9fa] dark:bg-[#162032] text-[#6b7280] dark:text-[#94a3b8]">
                                            <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">#</th>
                                            <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">Video nomi</th>
                                            <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Dars nomi</th>
                                            <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Status</th>
                                            <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Dars sanasi</th>
                                            <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Hajmi</th>
                                            <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Qo'shilgan vaqti</th>
                                            <th className="px-3 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#f0f0f0] dark:divide-[#2d3748]">
                                        {videosLoading ? (
                                            <tr>
                                                <td colSpan={8} className="text-center py-12 text-[#6b7280] dark:text-[#94a3b8]">
                                                    Yuklanmoqda...
                                                </td>
                                            </tr>
                                        ) : videos.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="text-center py-12 text-[#6b7280] dark:text-[#94a3b8]">
                                                    Videolar mavjud emas
                                                </td>
                                            </tr>
                                        ) : videos.map((v, i) => (
                                            <tr key={`${v.id ?? 'v'}-${i}`} className="hover:bg-[#f8f9fa] dark:hover:bg-[#162032] transition-colors">
                                                <td className="px-5 py-3.5 text-[#6b7280] dark:text-[#94a3b8]">{i + 1}</td>
                                                <td className="px-5 py-3.5">
                                                    <span className="flex items-center gap-2 text-[#3b82f6] font-medium max-w-[220px]">
                                                        <PlayCircleOutlineIcon sx={{ fontSize: 18 }} />
                                                        <span className="truncate">{v.name ?? v.title ?? v.filename ?? v.file_name ?? '—'}</span>
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                                                    {v.lesson?.title ?? v.lesson?.topic ?? v.lesson_name ?? '—'}
                                                </td>
                                                <td className="px-4 py-3.5 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                                                    {v.status ?? '—'}
                                                </td>
                                                <td className="px-4 py-3.5 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                                                    {fmtDate(v.lesson_date ?? v.lesson?.created_at)}
                                                </td>
                                                <td className="px-4 py-3.5 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                                                    {fmtSize(v.size ?? v.file_size)}
                                                </td>
                                                <td className="px-4 py-3.5 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                                                    {fmtDate(v.created_at ?? v.createdAt)}
                                                </td>
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
                    {subTab === 2 && (
                        <ImtihonlarTab groupId={groupId} />
                    )}
                    {subTab === 3 && (
                        <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-10 text-center text-[#6b7280] dark:text-[#94a3b8] text-sm">
                            Jurnal mavjud emas
                        </div>
                    )}

                    {subTab === 0 && (
                    <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
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
                                    {hwLoading ? (
                                        <tr>
                                            <td colSpan={9} className="text-center py-12 text-[#6b7280] dark:text-[#94a3b8]">
                                                Yuklanmoqda...
                                            </td>
                                        </tr>
                                    ) : homeworks.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="text-center py-12 text-[#6b7280] dark:text-[#94a3b8]">
                                                Uyga vazifalar mavjud emas
                                            </td>
                                        </tr>
                                    ) : homeworks.map((hw, i) => (
                                        <tr key={`${hw.id}-${i}`} className="hover:bg-[#f8f9fa] dark:hover:bg-[#162032] transition-colors">
                                            <td className="px-5 py-3.5 text-[#6b7280] dark:text-[#94a3b8]">{i + 1}</td>
                                            <td className="px-5 py-3.5 font-medium text-[#1a1a2e] dark:text-[#e2e8f0] max-w-[200px] truncate">
                                                {hw.topic ?? '—'}
                                            </td>
                                            <td className="px-4 py-3.5 text-center text-[#6b7280] dark:text-[#94a3b8]">
                                                {hw.existStudentsIngroup ?? '—'}
                                            </td>
                                            <td className="px-4 py-3.5 text-center text-orange-400">
                                                {hw.homeworkPending ?? '—'}
                                            </td>
                                            <td className="px-4 py-3.5 text-center text-green-500">
                                                {hw.homeworkAccept ?? '—'}
                                            </td>
                                            <td className="px-4 py-3.5 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                                                {fmtDate(hw.homework?.[0]?.created_at)}
                                            </td>
                                            <td className="px-4 py-3.5 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                                                —
                                            </td>
                                            <td className="px-4 py-3.5 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                                                {fmtDate(hw.created_at)}
                                            </td>
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

                    {/* ── Video upload modal ── */}
                    {videoModalOpen && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40" onClick={closeVideoModal}>
                            <div
                                onClick={e => e.stopPropagation()}
                                className="w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-4 sm:p-6"
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="m-0 text-lg font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Qo'shish</h2>
                                    <button
                                        type="button"
                                        onClick={closeVideoModal}
                                        className="border-none bg-transparent cursor-pointer text-[#6b7280] dark:text-[#94a3b8] hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0] p-1 rounded-lg transition-colors"
                                    >
                                        <CloseIcon sx={{ fontSize: 20 }} />
                                    </button>
                                </div>

                                {/* Dropzone */}
                                <input
                                    ref={videoInputRef}
                                    type="file"
                                    className="hidden"
                                    accept=".mp4,.webm,.mpeg,.avi,.mkv,.m4v,.ogm,.mov"
                                    onChange={handleVideoInput}
                                />
                                <div
                                    onClick={() => videoInputRef.current?.click()}
                                    onDragOver={e => e.preventDefault()}
                                    onDrop={handleVideoDrop}
                                    role="button"
                                    tabIndex={0}
                                    className="border-2 border-dashed border-[#a7f3d0] dark:border-[#0f5132] rounded-xl py-8 sm:py-12 px-4 text-center bg-white dark:bg-[#0f1827] cursor-pointer hover:border-[#10b981] hover:bg-[#f0fdf4] dark:hover:bg-[#0f2a1e] transition-colors"
                                >
                                    <div className="flex justify-center mb-4">
                                        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <polyline points="16 16 12 12 8 16" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <line x1="12" y1="12" x2="12" y2="21" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <p className="m-0 mb-2 text-sm sm:text-base font-bold text-[#1a1a2e] dark:text-[#e2e8f0] max-w-md mx-auto">
                                        Videofaylni yuklash uchun ushbu hudud ustiga bosing yoki faylni shu yerga olib keling
                                    </p>
                                    <p className="m-0 text-[12px] sm:text-[13px] font-medium text-[#10b981] max-w-lg mx-auto">
                                        Videofayl: .mp4, .webm, .mpeg, .avi, .mkv, .m4v, .ogm, .mov formatlaridan birida bo'lishi kerak
                                    </p>
                                </div>

                                {/* Selected file row */}
                                {videoFile && (
                                    <div className="mt-5 overflow-x-auto">
                                        <table className="w-full text-[13px] border-collapse min-w-[520px]">
                                            <thead>
                                                <tr className="bg-[#f8f9fa] dark:bg-[#162032] text-[#6b7280] dark:text-[#94a3b8]">
                                                    <th className="text-left px-3 py-2.5 font-semibold">Fayl nomi</th>
                                                    <th className="text-left px-3 py-2.5 font-semibold"><span className="text-red-500">*</span> Dars</th>
                                                    <th className="text-left px-3 py-2.5 font-semibold"><span className="text-red-500">*</span> Video nomi</th>
                                                    <th className="px-3 py-2.5 w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-t border-[#f0f0f0] dark:border-[#2d3748]">
                                                    <td className="px-3 py-3 text-[#1a1a2e] dark:text-[#e2e8f0] max-w-[160px]">
                                                        <span className="block truncate">{videoFile.name}</span>
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <select
                                                            value={videoLessonId}
                                                            onChange={e => setVideoLessonId(e.target.value)}
                                                            className="w-full min-w-[140px] bg-[#f8fafc] dark:bg-[#0f1827] border border-[#eef3f7] dark:border-[#2d3748] rounded-md px-2.5 py-2 text-[13px] text-[#1a1a2e] dark:text-[#e2e8f0] cursor-pointer focus:outline-none focus:border-[#10b981]"
                                                        >
                                                            <option value="">Tanlang</option>
                                                            {lessons.map(l => (
                                                                <option key={l.id} value={l.id}>
                                                                    {l.title ?? l.topic}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <input
                                                            value={videoName}
                                                            onChange={e => setVideoName(e.target.value)}
                                                            placeholder="Video nomi"
                                                            className="w-full min-w-[140px] bg-white dark:bg-[#0f1827] border border-[#eef3f7] dark:border-[#2d3748] rounded-md px-2.5 py-2 text-[13px] text-[#1a1a2e] dark:text-[#e2e8f0] focus:outline-none focus:border-[#10b981]"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-3 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={removeVideoFile}
                                                            className="border-none bg-transparent cursor-pointer text-[#ef4444] hover:text-[#dc2626] p-1 rounded transition-colors"
                                                        >
                                                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex flex-col sm:flex-row sm:justify-end items-stretch sm:items-center gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={closeVideoModal}
                                        className="px-6 py-2.5 rounded-lg bg-white dark:bg-transparent border border-[#e5e7eb] dark:border-[#2d3748] text-[#6b7280] dark:text-[#94a3b8] text-[13px] font-medium hover:bg-[#f9fafb] dark:hover:bg-[#2d3748] transition-colors cursor-pointer"
                                    >
                                        Bekor qilish
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleVideoUpload}
                                        disabled={videoUploading}
                                        className={`px-6 py-2.5 rounded-lg text-white text-[13px] font-semibold transition-colors ${videoUploading ? 'bg-[#86efac] cursor-not-allowed' : 'bg-[#22c55e] hover:bg-[#16a34a] cursor-pointer'}`}
                                    >
                                        {videoUploading ? 'Yuklanmoqda...' : 'Fayllarni yuklash'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    )
}
