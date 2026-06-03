import { useState, useEffect } from 'react'
import { apiGet, apiDel } from '../api'
import FilterListIcon from '@mui/icons-material/FilterList'
import SearchIcon from '@mui/icons-material/Search'
import ShareIcon from '@mui/icons-material/Share'
import AddIcon from '@mui/icons-material/Add'
import ArchiveIcon from '@mui/icons-material/Archive'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import TeachersTable from '../components/teachers/TeachersTable'
import TeacherDrawer from '../components/teachers/TeacherDrawer'
import Pagination from '../components/ui/Pagination'
import Toast from '../components/ui/Toast'

const PAGE_SIZE = 10

function toTeacher(t) {
    return {
        id:      t.id,
        name:    t.full_name ?? t.name ?? '—',
        phone:   t.phone ?? '—',
        email:   t.email ?? '',
        address: t.address ?? '',
        labels:  [],
        extra:   0,
        birth:   t.birth_date ?? '—',
        created: t.createdAt ? new Date(t.createdAt).toLocaleDateString('uz-UZ') : '—',
    }
}

export default function Teachers() {
    const [teachers, setTeachers]     = useState([])
    const [selected, setSelected]     = useState([])
    const [search, setSearch]         = useState('')
    const [page, setPage]             = useState(1)
    const [activeTab, setActiveTab]   = useState('royxat')
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editTeacher, setEditTeacher]   = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleting, setDeleting]         = useState(false)
    const [toast, setToast]               = useState(null)

    const loadTeachers = () => {
        const path = activeTab === 'arxiv' ? '/teachers/archive' : '/teachers'
        return apiGet(path)
            .then(d => setTeachers((Array.isArray(d) ? d : d?.data ?? []).map(toTeacher)))
            .catch(() => {})
    }

    useEffect(() => { loadTeachers() }, [activeTab])

    const switchTab = (id) => {
        if (id === activeTab) return
        setActiveTab(id)
        setSelected([])
        setPage(1)
        setSearch('')
    }

    const showToast = (message, type) => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        setDeleting(true)
        try {
            await apiDel(`/teachers/${deleteTarget.id}`)
            showToast("✅ O'qituvchi o'chirildi", 'success')
            setDeleteTarget(null)
            await loadTeachers()
        } catch (err) {
            showToast(`⚠️ ${err.message}`, 'error')
        } finally {
            setDeleting(false)
        }
    }

    const filtered    = teachers.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) || t.phone.includes(search)
    )
    const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const allSelected = paginated.length > 0 && paginated.every(t => selected.includes(t.id))
    const someSelected = selected.length > 0

    const toggleAll = () => {
        const ids = paginated.map(t => t.id)
        allSelected
            ? setSelected(prev => prev.filter(id => !ids.includes(id)))
            : setSelected(prev => [...new Set([...prev, ...ids])])
    }
    const toggleOne    = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    const handleSearch = (val) => { setSearch(val); setPage(1) }

    return (
        <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start mb-5">
                <div>
                    <h1 className="m-0 text-2xl font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">O'qituvchilar</h1>
                    <p className="mt-1.5 mb-0 text-[#6b7280] dark:text-[#94a3b8] text-[13px] leading-relaxed max-w-full sm:max-w-145">
                        Ushbu sahifada siz o'qituvchilar ro'yxatini va ularning ma'lumotlarini topasiz.
                        Har bir o'qituvchining ismi, fanlari va aloqa ma'lumotlari keltirilgan.
                    </p>
                </div>
                <div className="flex gap-2.5 shrink-0">
                    <button className="flex items-center gap-1.5 bg-transparent border border-[#e8e8e8] dark:border-[#2d3748] text-[#1a1a2e] dark:text-[#e2e8f0] rounded-[10px] px-4.5 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors duration-200">
                        <ShareIcon sx={{ fontSize: 16 }} /> Export
                    </button>
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="flex items-center gap-1.5 bg-[#7E56D8] hover:bg-[#6a44c0] text-white border-none rounded-[10px] px-4.5 py-2.5 text-[13px] font-semibold cursor-pointer transition-colors duration-200"
                    >
                        <AddIcon sx={{ fontSize: 18 }} /> O'qituvchi qo'shish
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)]">

                <div className="flex border-b border-[#e8e8e8] dark:border-[#2d3748] px-4">
                    {[
                        { id: 'royxat', label: "O'qituvchilar", icon: null },
                        { id: 'arxiv',  label: 'Arxiv',        icon: <ArchiveIcon sx={{ fontSize: 15 }} /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => switchTab(tab.id)}
                            className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-none bg-transparent cursor-pointer transition-colors duration-200 border-b-2 -mb-px ${activeTab === tab.id ? 'text-[#7E56D8] border-[#7E56D8]' : 'text-[#6b7280] dark:text-[#94a3b8] border-transparent hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0]'}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center px-5 py-3.5 border-b border-[#e8e8e8] dark:border-[#2d3748]">
                    <button className="flex items-center gap-1.5 bg-transparent border border-[#e8e8e8] dark:border-[#2d3748] text-[#6b7280] dark:text-[#94a3b8] rounded-lg px-3.5 py-1.75 text-[13px] cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors duration-200 w-fit">
                        <FilterListIcon sx={{ fontSize: 18 }} /> Filters
                    </button>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2 bg-[#f5f5f5] dark:bg-[#0f1827] border border-[#e8e8e8] dark:border-[#2d3748] rounded-lg px-3 py-1.75">
                            <SearchIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                            <input
                                value={search}
                                onChange={e => handleSearch(e.target.value)}
                                placeholder="Ism yoki telefon..."
                                className="border-none outline-none bg-transparent text-[13px] text-[#1a1a2e] dark:text-[#e2e8f0] w-full sm:w-45"
                            />
                        </div>
                    </div>
                </div>

                <TeachersTable
                    paginated={paginated}
                    selected={selected}
                    allSelected={allSelected}
                    someSelected={someSelected}
                    onToggleAll={toggleAll}
                    onToggleOne={toggleOne}
                    onDeleteClick={t => setDeleteTarget(t)}
                    onEditClick={t => { setEditTeacher(t); setDrawerOpen(true) }}
                />

                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>

            <TeacherDrawer
                open={drawerOpen}
                onClose={() => { setDrawerOpen(false); setEditTeacher(null) }}
                onSaved={loadTeachers}
                teacher={editTeacher}
            />

            {toast && <Toast message={toast.message} type={toast.type} />}

            {deleteTarget && (
                <div className="fixed inset-0 bg-black/50 z-[300] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-6 sm:p-7 w-full max-w-[380px] animate-fadeUp">
                        <div className="w-14 h-14 rounded-full bg-[#fce4ec] dark:bg-[#3b1020] flex items-center justify-center mx-auto mb-4">
                            <WarningAmberIcon sx={{ fontSize: 28, color: '#e53935' }} />
                        </div>
                        <h3 className="m-0 text-center text-[16px] font-bold text-[#1a1a2e] dark:text-[#e2e8f0] mb-2">
                            O'qituvchini o'chirish
                        </h3>
                        <p className="m-0 text-center text-[13px] text-[#6b7280] dark:text-[#94a3b8] leading-relaxed mb-6">
                            O'qituvchini o'chirishni tasdiqlaysizmi?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={deleting}
                                className="flex-1 py-2.5 border border-[#e5e7eb] dark:border-[#2d3748] rounded-[10px] text-[13px] font-medium bg-transparent text-[#1a1a2e] dark:text-[#e2e8f0] cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors disabled:opacity-50"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className={`flex-1 py-2.5 border-none rounded-[10px] text-[13px] font-semibold text-white transition-colors ${deleting ? 'bg-[#f87171] cursor-not-allowed' : 'bg-[#e53935] hover:bg-[#c62828] cursor-pointer'}`}
                            >
                                {deleting ? "O'chirilmoqda..." : "O'chirish"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
