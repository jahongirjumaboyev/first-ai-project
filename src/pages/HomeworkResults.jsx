import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { apiGet, apiPostForm } from '../api'
import { fmtDate } from '../utils/date'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloseIcon from '@mui/icons-material/Close'

const AVATAR_COLORS = ['#7c3aed', '#16a34a', '#2563eb', '#d97706', '#dc2626', '#0891b2', '#0d9488', '#9333ea']

function getInitials(name = '') {
    return name.trim().split(/\s+/).map(w => w[0] ?? '').join('').slice(0, 2).toUpperCase() || '?'
}

// Real status values (from Swagger) → tab labels, in display order.
const STATUS_TABS = [
    { key: 'PENDING',  label: 'Kutayotganlar' },
    { key: 'REJECTED', label: 'Qaytarilganlar' },
    { key: 'ACCEPTED', label: 'Qabul qilinganlar' },
    { key: 'CHECKED',  label: 'Bajarilmagan' },
]

function subName(s) {
    return s?.student?.full_name ?? s?.student?.name ?? s?.full_name ?? s?.name ?? "Noma'lum"
}
function subFileUrl(s) {
    return s?.file ?? s?.fileUrl ?? s?.file_url ?? s?.url ?? null
}
function subTime(s) {
    return s?.created_at ?? s?.createdAt ?? s?.submitted_at ?? null
}

export default function HomeworkResults() {
    const { id, homeworkId } = useParams()
    const navigate           = useNavigate()
    const { state }          = useLocation()
    const groupId            = state?.groupId ?? id

    const [submissions, setSubmissions] = useState([])
    const [loading, setLoading]         = useState(true)
    const [statusTab, setStatusTab]     = useState(0)        // 0 = pending, 1 = graded
    const [selectedSubmission, setSelectedSubmission] = useState(null) // null → list view
    const [ball, setBall]               = useState(60)        // slider 0..100
    const [feedbackText, setFeedbackText] = useState('')      // "Izohingiz" textarea
    const [feedbackFile, setFeedbackFile] = useState(null)    // optional dropzone file
    const [submitting, setSubmitting]   = useState(false)
    const [toast, setToast]             = useState(null)
    const fileInputRef                  = useRef(null)

    const topic = state?.homework?.topic ?? 'Uyga vazifa'

    const showToast = useCallback((message, type) => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3500)
    }, [])

    // Single fetch on mount; no status query param → returns all results.
    const loadResults = useCallback(() => {
        setLoading(true)
        return apiGet(`/group/${groupId}/homework/${homeworkId}/results`)
            .then(res => {
                console.log('results response:', res)
                const data = res?.data ?? res ?? []
                setSubmissions(data)
            })
            .catch(err => showToast(err.message || "Ma'lumot yuklanmadi", 'error'))
            .finally(() => setLoading(false))
    }, [groupId, homeworkId, showToast])

    useEffect(() => { loadResults() }, [loadResults])

    // Bucket every result by its real status once; switching tabs just swaps buckets.
    const buckets = useMemo(() => {
        const data = Array.isArray(submissions) ? submissions : []
        const acc = { PENDING: [], REJECTED: [], ACCEPTED: [], CHECKED: [] }
        data.forEach(r => {
            const st = String(r.status ?? '').toUpperCase()
            if (acc[st]) acc[st].push(r)
        })
        return acc
    }, [submissions])

    const rows = buckets[STATUS_TABS[statusTab].key] ?? []

    const openGrading = (s) => {
        setSelectedSubmission(s)
        setBall(s?.ball ?? 60)
        setFeedbackText(s?.comment ?? '')
        setFeedbackFile(null)
    }

    const cancelGrading = () => {
        setSelectedSubmission(null)
        setBall(60)
        setFeedbackText('')
        setFeedbackFile(null)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        const dropped = e.dataTransfer.files?.[0]
        if (dropped) setFeedbackFile(dropped)
    }

    async function gradeSubmit() {
        console.log('selected submission:', selectedSubmission)
        if (!selectedSubmission) return
        setSubmitting(true)
        try {
            const fd = new FormData()
            fd.append('ball', String(ball))
            fd.append('comment', feedbackText ?? '')
            if (selectedSubmission.id != null) fd.append('homeworkResultId', selectedSubmission.id)
            fd.append('homeworkId', homeworkId)
            const studId = selectedSubmission.student?.id ?? selectedSubmission.studentId
            if (studId != null) fd.append('studentId', studId)
            if (feedbackFile) fd.append('file', feedbackFile)

            const res = await apiPostForm('/homework', fd)
            console.log('grade submit response:', res)

            showToast('Baholandi', 'success')
            setBall(60)
            setFeedbackText('')
            setFeedbackFile(null)
            setSelectedSubmission(null)   // return to results list
            loadResults()                 // re-fetch so the student moves tabs
        } catch (err) {
            showToast(err.message || 'Xatolik yuz berdi', 'error')
            console.log('grade submit error:', err)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col gap-5">
            {toast && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-6 py-3 rounded-[10px] text-[13px] font-semibold text-white shadow-[0_6px_24px_rgba(0,0,0,0.25)] ${toast.type === 'success' ? 'bg-[#1F2D5C]' : 'bg-[#c0392b]'}`}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => selectedSubmission ? cancelGrading() : navigate(`/dashboard/guruhlar/${groupId}`)}
                    className="border-none bg-transparent cursor-pointer p-1.5 rounded-lg text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors flex items-center shrink-0"
                >
                    <ArrowBackIcon sx={{ fontSize: 20 }} />
                </button>
                <h1 className="m-0 text-xl font-bold text-[#1a1a2e] dark:text-[#e2e8f0] truncate">
                    {selectedSubmission ? 'Vazifani baholash' : topic}
                </h1>
            </div>

            {selectedSubmission ? (
                /* ── Grading panel ── */
                <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5 sm:p-6 flex flex-col gap-5 max-w-3xl w-full">
                    {/* Student summary */}
                    <div className="flex items-center gap-3 p-4 border border-[#e5e7eb] dark:border-[#2d3748] rounded-xl">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0"
                            style={{ backgroundColor: AVATAR_COLORS[0] }}
                        >
                            {getInitials(subName(selectedSubmission))}
                        </div>
                        <div className="min-w-0">
                            <p className="m-0 text-[14px] font-semibold text-[#1a1a2e] dark:text-[#e2e8f0] truncate">
                                {subName(selectedSubmission)}
                            </p>
                            {subFileUrl(selectedSubmission) ? (
                                <a
                                    href={subFileUrl(selectedSubmission)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="m-0 text-[12px] text-[#3b82f6] hover:underline inline-flex items-center gap-1"
                                >
                                    <InsertDriveFileOutlinedIcon sx={{ fontSize: 14 }} /> Yuklangan fayl
                                </a>
                            ) : (
                                <p className="m-0 text-[12px] text-[#6b7280] dark:text-[#94a3b8]">Fayl yuklanmagan</p>
                            )}
                        </div>
                    </div>

                    {/* Ball slider */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[13px] font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">Ball</label>
                            <span className="text-[22px] font-bold text-[#7c3aed] tabular-nums">{ball}</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={ball}
                            onChange={e => setBall(Number(e.target.value))}
                            className="w-full accent-[#7c3aed] cursor-pointer"
                        />
                        <div className="flex justify-between text-[11px] text-[#9ca3af]">
                            <span>0</span>
                            <span>100</span>
                        </div>
                    </div>

                    {/* Izohingiz */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">Izohingiz</label>
                        <textarea
                            value={feedbackText}
                            onChange={e => setFeedbackText(e.target.value)}
                            placeholder="Talabaga izoh qoldiring..."
                            rows={3}
                            className="px-3.5 py-2.5 border border-[#e5e7eb] dark:border-[#2d3748] rounded-lg text-[13px] bg-white dark:bg-[#0f1827] text-[#1a1a2e] dark:text-[#e2e8f0] outline-none focus:border-[#7c3aed] transition-colors resize-none"
                        />
                    </div>

                    {/* Optional file dropzone */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">Fayl (ixtiyoriy)</label>
                        <input ref={fileInputRef} type="file" className="hidden" onChange={e => setFeedbackFile(e.target.files?.[0] ?? null)} />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleDrop}
                            role="button"
                            tabIndex={0}
                            className="border-2 border-dashed border-[#d1d5db] dark:border-[#4b5563] rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#fafafa] dark:bg-[#0f1827] hover:border-[#7c3aed] transition-colors"
                        >
                            <CloudUploadIcon sx={{ fontSize: 30, color: '#9ca3af' }} />
                            <span className="text-[13px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Fayl tanlang yoki shu yerga tashlang</span>
                        </div>
                        {feedbackFile && (
                            <div className="flex items-center justify-between px-3 py-2 bg-[#f3f4f6] dark:bg-[#162032] rounded-lg text-[12px] mt-1">
                                <span className="text-[#1a1a2e] dark:text-[#e2e8f0] truncate max-w-[80%]">{feedbackFile.name}</span>
                                <button
                                    type="button"
                                    onClick={() => setFeedbackFile(null)}
                                    className="border-none bg-transparent cursor-pointer text-[#9ca3af] hover:text-[#ef4444] p-0.5 ml-2 shrink-0 transition-colors"
                                >
                                    <CloseIcon sx={{ fontSize: 14 }} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2 border-t border-[#e8e8e8] dark:border-[#2d3748]">
                        <button
                            type="button"
                            onClick={cancelGrading}
                            className="px-5 py-2.5 border border-[#e5e7eb] dark:border-[#2d3748] bg-transparent text-[#6b7280] dark:text-[#94a3b8] rounded-lg text-[13px] font-medium cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="button"
                            onClick={gradeSubmit}
                            disabled={submitting}
                            className={`px-5 py-2.5 border-none rounded-lg text-[13px] font-semibold text-white transition-colors ${submitting ? 'bg-[#a78bfa] cursor-not-allowed' : 'bg-[#7c3aed] hover:bg-[#6d28d9] cursor-pointer'}`}
                        >
                            {submitting ? 'Yuborilmoqda...' : 'Yuborish'}
                        </button>
                    </div>
                </div>
            ) : (
                /* ── Results list ── */
                <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                    {/* Status tabs */}
                    <div className="flex border-b border-[#e8e8e8] dark:border-[#2d3748] overflow-x-auto">
                        {STATUS_TABS.map((t, i) => {
                            const active = statusTab === i
                            const count  = buckets[t.key].length
                            return (
                                <button
                                    key={t.key}
                                    onClick={() => setStatusTab(i)}
                                    className={`flex items-center gap-1.5 px-5 py-3 text-[13px] font-medium border-none bg-transparent cursor-pointer transition-colors duration-200 whitespace-nowrap border-b-2 -mb-px ${
                                        active
                                            ? 'text-[#7c3aed] border-[#7c3aed]'
                                            : 'text-[#6b7280] dark:text-[#94a3b8] border-transparent hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0]'
                                    }`}
                                >
                                    {t.label}
                                    <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-semibold ${
                                        active
                                            ? 'bg-[#ede8fb] dark:bg-[#2a1f4a] text-[#7c3aed]'
                                            : 'bg-[#f3f4f6] dark:bg-[#2d3748] text-[#6b7280] dark:text-[#94a3b8]'
                                    }`}>
                                        {count}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-[13px] border-collapse min-w-[640px]">
                            <thead>
                                <tr className="bg-[#f8f9fa] dark:bg-[#162032] text-[#6b7280] dark:text-[#94a3b8]">
                                    <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">#</th>
                                    <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">
                                        <span className="flex items-center gap-1"><PersonOutlineIcon sx={{ fontSize: 15 }} /> Talaba</span>
                                    </th>
                                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Fayl</th>
                                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Topshirilgan vaqt</th>
                                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Ball</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0f0f0] dark:divide-[#2d3748]">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-[#6b7280] dark:text-[#94a3b8]">Yuklanmoqda...</td>
                                    </tr>
                                ) : rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-[#6b7280] dark:text-[#94a3b8]">
                                            Ma'lumot topilmadi
                                        </td>
                                    </tr>
                                ) : rows.map((s, i) => {
                                    const fileUrl = subFileUrl(s)
                                    return (
                                        <tr key={s.id ?? i} className="hover:bg-[#f8f9fa] dark:hover:bg-[#162032] transition-colors">
                                            <td className="px-5 py-3.5 text-[#6b7280] dark:text-[#94a3b8]">{i + 1}</td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                                                        style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                                                    >
                                                        {getInitials(subName(s))}
                                                    </div>
                                                    <span className="font-medium text-[#1a1a2e] dark:text-[#e2e8f0]">{subName(s)}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {fileUrl ? (
                                                    <a href={fileUrl} target="_blank" rel="noreferrer" className="text-[#3b82f6] hover:underline inline-flex items-center gap-1">
                                                        <InsertDriveFileOutlinedIcon sx={{ fontSize: 15 }} /> Fayl
                                                    </a>
                                                ) : (
                                                    <span className="text-[#6b7280] dark:text-[#94a3b8]">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                                                {fmtDate(subTime(s))}
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                {s?.ball != null
                                                    ? <span className="font-semibold text-[#16a34a]">{s.ball}</span>
                                                    : <span className="text-[#6b7280] dark:text-[#94a3b8]">—</span>}
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <button
                                                    onClick={() => openGrading(s)}
                                                    className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white border-none rounded-lg px-4 py-1.5 text-[12px] font-semibold cursor-pointer transition-colors"
                                                >
                                                    Baholash
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
