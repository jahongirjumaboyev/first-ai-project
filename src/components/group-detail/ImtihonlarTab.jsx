import { useState, useEffect, useRef, useCallback } from 'react'
import { apiGet, apiPostForm } from '../../api'
import RichEditor from './RichEditor'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'
import CloseIcon from '@mui/icons-material/Close'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const monthUz = {
    January: 'Yan', February: 'Fev', March: 'Mar', April: 'Apr',
    May: 'May', June: 'Iyun', July: 'Iyul', August: 'Avg',
    September: 'Sen', October: 'Okt', November: 'Noy', December: 'Dek',
}

function fmtDateTime(str) {
    if (!str) return '—'
    const d = new Date(str)
    const month = monthUz[d.toLocaleString('en', { month: 'long' })] ?? ''
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `${d.getDate()} ${month}, ${d.getFullYear()} ${hh}:${mm}`
}

const MOCK_EXAMS = [
    { id: 7, title: 'Examination', passed: 12, failed: 0, status: 'Faol',
      lessonTime: '2026-05-22T09:30', givenTime: '2026-05-22T09:28', publishedTime: null },
    { id: 6, title: 'Examination', passed: 12, failed: 0, status: 'Tugagan',
      lessonTime: '2026-04-24T09:30', givenTime: '2026-04-24T09:25', publishedTime: '2026-04-27T10:30' },
    { id: 5, title: 'Examination', passed: 14, failed: 0, status: 'Tugagan',
      lessonTime: '2026-03-26T09:30', givenTime: '2026-03-26T09:23', publishedTime: '2026-03-30T14:34' },
    { id: 4, title: 'Examination', passed: 16, failed: 0, status: 'Tugagan',
      lessonTime: '2026-02-26T09:30', givenTime: '2026-02-26T09:28', publishedTime: '2026-03-02T13:32' },
]

const INIT_FORM = { mavzu: '', endDate: '', endTime: '' }

/* ─────────────────────── List view ─────────────────────── */
function ImtihonList({ onCreateNew }) {
    return (
        <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e8e8] dark:border-[#2d3748]">
                <h3 className="m-0 text-[15px] font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Imtihonlar</h3>
                <button
                    onClick={onCreateNew}
                    className="flex items-center gap-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white border-none rounded-lg px-4 py-2 text-[13px] font-semibold cursor-pointer transition-colors"
                >
                    + Yangi imtihon
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-[13px] border-collapse min-w-[760px]">
                    <thead>
                        <tr className="bg-[#f8f9fa] dark:bg-[#162032] text-[#6b7280] dark:text-[#94a3b8]">
                            <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">#</th>
                            <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">Mavzu</th>
                            <th className="text-center px-4 py-3 font-semibold whitespace-nowrap">
                                <PersonOutlineIcon sx={{ fontSize: 15 }} />
                            </th>
                            <th className="text-center px-4 py-3 font-semibold whitespace-nowrap">
                                <CloseIcon sx={{ fontSize: 14, color: '#f97316' }} />
                            </th>
                            <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Status</th>
                            <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Dars vaqti</th>
                            <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Berilgan vaqt</th>
                            <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">E'lon qilingan vaqti</th>
                            <th className="px-3 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f0f0] dark:divide-[#2d3748]">
                        {MOCK_EXAMS.map((exam, i) => (
                            <tr key={exam.id} className="hover:bg-[#f8f9fa] dark:hover:bg-[#162032] transition-colors">
                                <td className="px-5 py-3.5 text-[#6b7280] dark:text-[#94a3b8]">{i + 1}</td>
                                <td className="px-5 py-3.5">
                                    <button className="border-none bg-transparent cursor-pointer text-[#3b82f6] hover:underline text-[13px] font-medium p-0">
                                        {exam.title}
                                    </button>
                                </td>
                                <td className="px-4 py-3.5 text-center text-[#1a1a2e] dark:text-[#e2e8f0]">
                                    {exam.passed}
                                </td>
                                <td className="px-4 py-3.5 text-center text-[#f97316]">
                                    {exam.failed}
                                </td>
                                <td className="px-4 py-3.5">
                                    {exam.status === 'Faol' ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-[#16a34a] text-[#16a34a] bg-transparent">
                                            Faol
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-[#9ca3af] text-[#9ca3af] bg-transparent">
                                            Tugagan
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3.5 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                                    {fmtDateTime(exam.lessonTime)}
                                </td>
                                <td className="px-4 py-3.5 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                                    {fmtDateTime(exam.givenTime)}
                                </td>
                                <td className="px-4 py-3.5 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                                    {exam.publishedTime ? fmtDateTime(exam.publishedTime) : '—'}
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
    )
}

/* ─────────────────────── Create view ─────────────────────── */
function ImtihonCreate({ onBack, groupId }) {
    const [form, setForm]           = useState(INIT_FORM)
    const [editorHtml, setEditorHtml] = useState('')
    const [files, setFiles]         = useState([])
    const [lessons, setLessons]     = useState(null) // null = not yet fetched
    const [submitting, setSubmitting] = useState(false)
    const [toast, setToast]         = useState(null)
    const [dragging, setDragging]   = useState(false)
    const fileInputRef              = useRef(null)

    const showToast = useCallback((message, type) => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3500)
    }, [])

    useEffect(() => {
        if (!groupId) return
        apiGet(`/lessons/my/group/${groupId}`)
            .then(res => setLessons(Array.isArray(res) ? res : (res?.data ?? [])))
            .catch(() => setLessons([]))
    }, [groupId])

    const setField = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }))

    const addFiles = newFiles => {
        setFiles(prev => {
            const existing = new Set(prev.map(f => f.name + f.size))
            return [...prev, ...Array.from(newFiles).filter(f => !existing.has(f.name + f.size))]
        })
    }

    const handleDrop = e => {
        e.preventDefault()
        setDragging(false)
        addFiles(e.dataTransfer.files)
    }

    const handleSubmit = async () => {
        if (!form.mavzu)   { showToast("Mavzuni tanlang", 'error'); return }
        if (!form.endDate) { showToast("Tugash sanasini kiriting", 'error'); return }
        if (!form.endTime) { showToast("Tugash vaqtini kiriting", 'error'); return }
        setSubmitting(true)
        try {
            const fd = new FormData()
            fd.append('lesson_id', form.mavzu)
            fd.append('description', editorHtml)
            fd.append('end_date', form.endDate)
            fd.append('end_time', form.endTime)
            files.forEach(f => fd.append('files', f))
            await apiPostForm(`/groups/${groupId}/exams`, fd)
            showToast("Imtihon e'lon qilindi!", 'success')
            setTimeout(onBack, 1200)
        } catch (err) {
            showToast(err.message || "Xatolik yuz berdi", 'error')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col gap-5">
            {toast && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-[10px] text-[13px] font-semibold text-white shadow-[0_6px_24px_rgba(0,0,0,0.25)] ${toast.type === 'success' ? 'bg-[#1F2D5C]' : 'bg-[#c0392b]'}`}>
                    {toast.message}
                </div>
            )}

            {/* Title row */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className="border-none bg-transparent cursor-pointer p-1.5 rounded-lg text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors"
                >
                    <ArrowBackIcon sx={{ fontSize: 20 }} />
                </button>
                <h2 className="m-0 text-[17px] font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Imtihon yaratish</h2>
            </div>

            <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5 sm:p-6 flex flex-col gap-5">
                {/* Info banner */}
                <div className="flex items-start gap-3 bg-[#eff6ff] dark:bg-[#1e3058] border border-[#bfdbfe] dark:border-[#2d4a80] rounded-lg px-4 py-3">
                    <InfoOutlinedIcon sx={{ fontSize: 18, color: '#3b82f6', flexShrink: 0, marginTop: '1px' }} />
                    <p className="m-0 text-[13px] text-[#1e40af] dark:text-[#93c5fd] leading-relaxed">
                        Oxirgi 7 kundagi uyga vazifa berilmagan mavzularni tanlay olasiz!
                    </p>
                </div>

                {/* Mavzu dropdown */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">
                        Mavzu <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={form.mavzu}
                        onChange={setField('mavzu')}
                        className="px-3.5 py-2.5 border border-[#e5e7eb] dark:border-[#2d3748] rounded-lg text-[13px] bg-white dark:bg-[#0f1827] text-[#1a1a2e] dark:text-[#e2e8f0] outline-none focus:border-[#16a34a] transition-colors cursor-pointer"
                    >
                        <option value="">Mavzulardan birini tanlang</option>
                        {(lessons ?? []).map(l => (
                            <option key={l.id} value={l.id}>
                                {l.topic ?? l.name ?? l.title ?? `Dars #${l.id}`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Rich text editor */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">
                        Izoh <span className="text-red-500">*</span>
                    </label>
                    <RichEditor onChange={setEditorHtml} placeholder="Izoh kiriting..." />
                </div>

                {/* File upload */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">
                        Fayllar (ixtiyoriy)
                    </label>
                    <div
                        onDragOver={e => { e.preventDefault(); setDragging(true) }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                            dragging
                                ? 'border-[#16a34a] bg-[#f0fdf4] dark:bg-[#052e16]'
                                : 'border-[#d1d5db] dark:border-[#4b5563] bg-[#fafafa] dark:bg-[#0f1827] hover:border-[#16a34a] dark:hover:border-[#16a34a]'
                        }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={e => { addFiles(e.target.files); e.target.value = '' }}
                        />
                        <CloudUploadIcon sx={{ fontSize: 32, color: '#9ca3af' }} />
                        <span className="text-[13px] font-medium text-[#6b7280] dark:text-[#94a3b8]">↓ Yuklash</span>
                        <span className="text-[12px] text-[#9ca3af]">yoki faylni bu yerga tashlang</span>
                    </div>

                    {files.length > 0 && (
                        <div className="flex flex-col gap-1.5 mt-1">
                            {files.map((f, i) => (
                                <div key={i} className="flex items-center justify-between px-3 py-2 bg-[#f3f4f6] dark:bg-[#162032] rounded-lg text-[12px]">
                                    <span className="text-[#1a1a2e] dark:text-[#e2e8f0] truncate max-w-[80%]">{f.name}</span>
                                    <button
                                        type="button"
                                        onClick={e => { e.stopPropagation(); setFiles(prev => prev.filter((_, j) => j !== i)) }}
                                        className="border-none bg-transparent cursor-pointer text-[#9ca3af] hover:text-[#ef4444] p-0.5 ml-2 shrink-0 transition-colors"
                                    >
                                        <CloseIcon sx={{ fontSize: 14 }} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* End date + time (side by side) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">
                            Tugash sanasi <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={form.endDate}
                                onChange={setField('endDate')}
                                className="w-full pl-3.5 pr-9 py-2.5 border border-[#e5e7eb] dark:border-[#2d3748] rounded-lg text-[13px] bg-white dark:bg-[#0f1827] text-[#1a1a2e] dark:text-[#e2e8f0] outline-none focus:border-[#16a34a] transition-colors cursor-pointer"
                            />
                            <CalendarTodayIcon sx={{ fontSize: 16, color: '#9ca3af', position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">
                            Tugash vaqti <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="time"
                                value={form.endTime}
                                onChange={setField('endTime')}
                                className="w-full pl-3.5 pr-9 py-2.5 border border-[#e5e7eb] dark:border-[#2d3748] rounded-lg text-[13px] bg-white dark:bg-[#0f1827] text-[#1a1a2e] dark:text-[#e2e8f0] outline-none focus:border-[#16a34a] transition-colors cursor-pointer"
                            />
                            <AccessTimeIcon sx={{ fontSize: 16, color: '#9ca3af', position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2 border-t border-[#e8e8e8] dark:border-[#2d3748]">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-5 py-2.5 border border-[#e5e7eb] dark:border-[#2d3748] bg-transparent text-[#6b7280] dark:text-[#94a3b8] rounded-lg text-[13px] font-medium cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors"
                    >
                        Bekor qilish
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className={`px-5 py-2.5 border-none rounded-lg text-[13px] font-semibold text-white transition-colors ${
                            submitting ? 'bg-[#86efac] cursor-not-allowed' : 'bg-[#16a34a] hover:bg-[#15803d] cursor-pointer'
                        }`}
                    >
                        {submitting ? "Saqlanmoqda..." : "E'lon qilish"}
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ─────────────────────── Root export ─────────────────────── */
export default function ImtihonlarTab({ groupId }) {
    const [view, setView] = useState('list')

    if (view === 'create') {
        return <ImtihonCreate onBack={() => setView('list')} groupId={groupId} />
    }
    return <ImtihonList onCreateNew={() => setView('create')} />
}
