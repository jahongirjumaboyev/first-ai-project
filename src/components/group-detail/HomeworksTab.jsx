import { useState, useRef, useEffect, useCallback } from 'react'
import { apiGet, apiPostForm } from '../../api'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CloseIcon from '@mui/icons-material/Close'
import AttachFileIcon from '@mui/icons-material/AttachFile'

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

function normalize(res) {
    if (!res) return []
    if (Array.isArray(res)) return res
    for (const key of ['data', 'homeworks', 'items', 'result', 'list', 'content', 'rows']) {
        if (Array.isArray(res[key])) return res[key]
    }
    return []
}

const SUB_TABS = ['Uyga vazifa', 'Videolar', 'Imtihonlar', 'Jurnal']
const INIT_FORM = { title: '', lesson_id: '' }

export default function HomeworksTab({ groupId }) {
    const [subTab, setSubTab]         = useState(0)
    const [homeworks, setHomeworks]   = useState([])
    const [hwLoading, setHwLoading]   = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [visible, setVisible]       = useState(false)
    const [form, setForm]             = useState(INIT_FORM)
    const [file, setFile]             = useState(null)
    const [saving, setSaving]         = useState(false)
    const [toast, setToast]           = useState(null)
    const [lessons, setLessons]       = useState([])
    const fileInputRef                = useRef(null)

    const showToast = useCallback((message, type) => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3500)
    }, [])

    const loadHomeworks = useCallback(() => {
        setHwLoading(true)
        return apiGet(`/homework/${groupId}`)
            .then(res => setHomeworks(normalize(res)))
            .catch(err => showToast(err.message || "Ma'lumot yuklanmadi", 'error'))
            .finally(() => setHwLoading(false))
    }, [groupId, showToast])

    useEffect(() => {
        loadHomeworks()
    }, [loadHomeworks])

    const switchSubTab = (i) => {
        setSubTab(i)
        if (i === 0) loadHomeworks()
    }

    const openDrawer = () => {
        setDrawerOpen(true)
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
        if (lessons.length === 0) {
            apiGet(`/lessons/my/group/${groupId}`)
                .then(res => setLessons(Array.isArray(res) ? res : (res?.data ?? [])))
                .catch(() => {})
        }
    }

    const closeDrawer = () => {
        setVisible(false)
        setTimeout(() => {
            setDrawerOpen(false)
            setForm(INIT_FORM)
            setFile(null)
        }, 280)
    }

    const setField = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.title.trim()) { showToast('Sarlavha kiriting', 'error'); return }
        if (!form.lesson_id)    { showToast('Dars nomini kiriting', 'error'); return }
        setSaving(true)
        try {
            const fd = new FormData()
            fd.append('title', form.title.trim())
            fd.append('lesson_id', Number(form.lesson_id))
            fd.append('group_id', Number(groupId))
            if (file) fd.append('file', file)

            const created = await apiPostForm('/homework', fd)

            /* Optimistic insert using the returned object if it has an id */
            const newRow = (created?.id)
                ? created
                : (created?.data?.id ? created.data : {
                    title: form.title.trim(),
                    lesson_id: form.lesson_id,
                    createdAt: new Date().toISOString(),
                })
            setHomeworks(prev => [newRow, ...prev])

            showToast("Uyga vazifa qo'shildi", 'success')
            closeDrawer()
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

            <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#e8e8e8] dark:border-[#2d3748]">
                    <div className="flex items-center justify-start gap-4">
                        <h3 className="m-0 text-[15px] font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Guruh darsliklari</h3>
                        <div className="flex gap-1 bg-[#f3f4f6] dark:bg-[#2d3748] p-1 rounded-xl">
                            {SUB_TABS.map((label, i) => (
                                <button
                                    key={label}
                                    onClick={() => switchSubTab(i)}
                                    className={`px-4 py-1.5 rounded-lg text-[13px] font-medium border-none cursor-pointer transition-all duration-200 ${subTab === i ? 'bg-white dark:bg-[#1e2a3a] text-[#1a1a2e] dark:text-[#e2e8f0] shadow-sm border border-[#e8e8e8] dark:border-[#374151]' : 'bg-transparent text-[#6b7280] dark:text-[#94a3b8] hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0]'}`}
                                >{label}</button>
                            ))}
                        </div>
                        <button
                            onClick={openDrawer}
                            className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white border-none rounded-lg px-4 py-2 text-[13px] font-semibold cursor-pointer transition-colors ml-auto"
                        >
                            + Qo'shish
                        </button>
                    </div>
                </div>

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
                                <tr key={hw.id ?? i} className="hover:bg-[#f8f9fa] dark:hover:bg-[#162032] transition-colors">
                                    <td className="px-5 py-3.5 text-[#6b7280] dark:text-[#94a3b8]">{i + 1}</td>
                                    <td className="px-5 py-3.5 font-medium text-[#1a1a2e] dark:text-[#e2e8f0] max-w-[200px] truncate">
                                        {hw.title ?? hw.name ?? hw.subject ?? '—'}
                                    </td>
                                    <td className="px-4 py-3.5 text-center text-[#6b7280] dark:text-[#94a3b8]">
                                        {hw.student_count ?? hw.studentsCount ?? hw.students ?? '—'}
                                    </td>
                                    <td className="px-4 py-3.5 text-center text-orange-400">
                                        {hw.pending_count ?? hw.pendingCount ?? hw.pending ?? '—'}
                                    </td>
                                    <td className="px-4 py-3.5 text-center text-green-500">
                                        {hw.done_count ?? hw.doneCount ?? hw.done ?? '—'}
                                    </td>
                                    <td className="px-4 py-3.5 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                                        {fmtDate(hw.given_at ?? hw.createdAt ?? hw.created_at)}
                                    </td>
                                    <td className="px-4 py-3.5 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                                        {fmtDate(hw.deadline ?? hw.due_date ?? hw.dueDate)}
                                    </td>
                                    <td className="px-4 py-3.5 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                                        {fmtDate(hw.lesson_date ?? hw.lessonDate)}
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

            {drawerOpen && (
                <>
                    <div
                        className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-280 ${visible ? 'opacity-100' : 'opacity-0'}`}
                        onClick={closeDrawer}
                    />
                    <div className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white dark:bg-[#1e2a3a] z-[101] flex flex-col shadow-[-4px_0_32px_rgba(0,0,0,0.15)] transition-transform duration-280 ease-in-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}>

                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8] dark:border-[#2d3748] shrink-0">
                            <h2 className="m-0 text-[16px] font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Yangi uyga vazifa</h2>
                            <button onClick={closeDrawer} className="border-none bg-transparent cursor-pointer text-[#6b7280] dark:text-[#94a3b8] hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0] p-1 rounded-lg transition-colors">
                                <CloseIcon sx={{ fontSize: 20 }} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-5 flex-1 overflow-y-auto">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">
                                    Sarlavha <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={form.title}
                                    onChange={setField('title')}
                                    placeholder="Uyga vazifa sarlavhasini kiriting"
                                    className="px-3.5 py-2.5 border border-[#e5e7eb] dark:border-[#2d3748] rounded-lg text-[13px] bg-white dark:bg-[#0f1827] text-[#1a1a2e] dark:text-[#e2e8f0] outline-none focus:border-[#7E56D8] transition-colors"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">
                                    Dars nomi <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={form.lesson_id}
                                    onChange={setField('lesson_id')}
                                    className="px-3.5 py-2.5 border border-[#e5e7eb] dark:border-[#2d3748] rounded-lg text-[13px] bg-white dark:bg-[#0f1827] text-[#1a1a2e] dark:text-[#e2e8f0] outline-none focus:border-[#7E56D8] transition-colors cursor-pointer"
                                >
                                    <option value="">Dars tanlang</option>
                                    {lessons.map(l => (
                                        <option key={l.id} value={l.id}>
                                            {l.topic ?? l.name ?? l.title ?? `Dars #${l.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">
                                    Fayl (ixtiyoriy)
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={e => setFile(e.target.files?.[0] ?? null)}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 px-3.5 py-2.5 border border-dashed border-[#c4b5fd] dark:border-[#4c1d95] rounded-lg text-[13px] text-[#7E56D8] bg-[#f5f0ff] dark:bg-[#1a1040] cursor-pointer hover:bg-[#ede8fb] dark:hover:bg-[#1e1a50] transition-colors"
                                >
                                    <AttachFileIcon sx={{ fontSize: 16 }} />
                                    {file ? file.name : 'Fayl tanlash'}
                                </button>
                                {file && (
                                    <button
                                        type="button"
                                        onClick={() => setFile(null)}
                                        className="text-[12px] text-red-400 hover:text-red-600 text-left border-none bg-transparent cursor-pointer p-0"
                                    >
                                        Faylni olib tashlash
                                    </button>
                                )}
                            </div>

                            <div className="flex-1" />

                            <div className="flex gap-3 pt-2 border-t border-[#e8e8e8] dark:border-[#2d3748]">
                                <button
                                    type="button"
                                    onClick={closeDrawer}
                                    className="flex-1 py-2.5 border border-[#e5e7eb] dark:border-[#2d3748] bg-transparent text-[#6b7280] dark:text-[#94a3b8] rounded-lg text-[13px] font-medium cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`flex-1 py-2.5 border-none rounded-lg text-[13px] font-semibold text-white transition-colors ${saving ? 'bg-[#86efac] cursor-not-allowed' : 'bg-[#22c55e] hover:bg-[#16a34a] cursor-pointer'}`}
                                >
                                    {saving ? 'Saqlanmoqda...' : "Qo'shish"}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </>
    )
}
