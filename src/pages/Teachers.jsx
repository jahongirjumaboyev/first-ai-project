import { useState, useEffect } from 'react'
import { apiGet } from '../api'
import FilterListIcon from '@mui/icons-material/FilterList'
import SearchIcon from '@mui/icons-material/Search'
import ShareIcon from '@mui/icons-material/Share'
import AddIcon from '@mui/icons-material/Add'
import ArchiveIcon from '@mui/icons-material/Archive'
import TeachersTable from '../components/teachers/TeachersTable'
import TeacherDrawer from '../components/teachers/TeacherDrawer'
import Pagination from '../components/ui/Pagination'

const PAGE_SIZE = 10

function toTeacher(t) {
    return {
        id:      t.id,
        name:    t.full_name ?? t.name ?? '—',
        phone:   t.phone ?? '—',
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
    const [drawerOpen, setDrawerOpen] = useState(false)

    const loadTeachers = () =>
        apiGet('/teachers')
            .then(d => setTeachers((Array.isArray(d) ? d : d?.data ?? []).map(toTeacher)))
            .catch(() => {})

    useEffect(() => { loadTeachers() }, [])

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
                        <button className="flex items-center gap-1.5 bg-transparent border border-[#e8e8e8] dark:border-[#2d3748] text-[#6b7280] dark:text-[#94a3b8] rounded-lg px-3.5 py-1.75 text-[13px] cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors duration-200 w-fit">
                            Arxiv <ArchiveIcon sx={{ fontSize: 18 }} />
                        </button>
                    </div>
                </div>

                <TeachersTable
                    paginated={paginated}
                    selected={selected}
                    allSelected={allSelected}
                    someSelected={someSelected}
                    onToggleAll={toggleAll}
                    onToggleOne={toggleOne}
                />

                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>

            <TeacherDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSaved={loadTeachers}
            />
        </div>
    )
}
