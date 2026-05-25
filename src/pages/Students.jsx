import { useState, useEffect } from 'react'
import { apiGet } from '../api'
import FilterListIcon from '@mui/icons-material/FilterList'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import ArchiveIcon from '@mui/icons-material/Archive'
import StudentsTable from '../components/students/StudentsTable'
import StudentDrawer from '../components/students/StudentDrawer'
import Pagination from '../components/ui/Pagination'

const PAGE_SIZE = 4

function toStudent(s) {
    return {
        id:      s.id,
        name:    s.full_name ?? s.name ?? '—',
        email:   s.email ?? '—',
        phone:   s.phone ?? '—',
        birth:   s.birth_date ? new Date(s.birth_date).toLocaleDateString('uz-UZ') : '—',
        address: s.address ?? '—',
        groups:  Array.isArray(s.groups) ? s.groups.map(g => g?.name ?? g) : [],
        created: s.createdAt ? new Date(s.createdAt).toLocaleDateString('uz-UZ') : '—',
    }
}

export default function Students() {
    const [students, setStudents]     = useState([])
    const [apiGroups, setApiGroups]   = useState([])
    const [selected, setSelected]     = useState([])
    const [search, setSearch]         = useState('')
    const [page, setPage]             = useState(1)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editingStudent, setEditingStudent] = useState(null)

    const loadStudents = () =>
        apiGet('/students?page=1&limit=100')
            .then(d => setStudents((Array.isArray(d) ? d : d?.data ?? []).map(toStudent)))
            .catch(() => {})

    useEffect(() => {
        loadStudents()
        apiGet('/groups/all')
            .then(d => setApiGroups(Array.isArray(d) ? d : d?.data ?? []))
            .catch(() => {})
    }, [])

    const filtered    = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.phone.includes(search) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    )
    const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const allSelected = paginated.length > 0 && paginated.every(s => selected.includes(s.id))
    const someSelected = selected.length > 0

    const toggleAll = () => {
        const ids = paginated.map(s => s.id)
        allSelected
            ? setSelected(prev => prev.filter(id => !ids.includes(id)))
            : setSelected(prev => [...new Set([...prev, ...ids])])
    }
    const toggleOne    = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    const handleSearch = (val) => { setSearch(val); setPage(1) }

    const deleteStudent = (id) => {
        setStudents(prev => prev.filter(s => s.id !== id))
        setSelected(prev => prev.filter(x => x !== id))
    }

    const openEdit = (s) => {
        setEditingStudent(s)
        setDrawerOpen(true)
    }

    return (
        <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start mb-5">
                <div>
                    <h1 className="m-0 text-2xl font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Talabalar</h1>
                    <p className="mt-1.5 mb-0 text-[#6b7280] dark:text-[#94a3b8] text-[13px] leading-relaxed max-w-full sm:max-w-145">
                        Ushbu sahifada siz Talabalar ro'yxatini va ularning ma'lumotlarini topasiz.
                        Har bir Talaba ismi, fanlari va aloqa ma'lumotlari keltirilgan.
                    </p>
                </div>
                <button
                    onClick={() => { setEditingStudent(null); setDrawerOpen(true) }}
                    className="flex items-center gap-1.5 bg-[#7E56D8] hover:bg-[#6a44c0] text-white border-none rounded-[10px] px-4.5 py-2.5 text-[13px] font-semibold cursor-pointer transition-colors duration-200 shrink-0 w-fit"
                >
                    <AddIcon sx={{ fontSize: 18 }} /> Talaba qo'shish
                </button>
            </div>

            <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)]">

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center px-5 py-3.5 border-b border-[#e8e8e8] dark:border-[#2d3748]">
                    <div className="flex items-center gap-2 bg-[#f5f5f5] dark:bg-[#0f1827] border border-[#e8e8e8] dark:border-[#2d3748] rounded-lg px-3 py-1.75">
                        <SearchIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                        <input
                            value={search}
                            onChange={e => handleSearch(e.target.value)}
                            placeholder="Search"
                            className="border-none outline-none bg-transparent text-[13px] text-[#1a1a2e] dark:text-[#e2e8f0] w-full sm:w-45"
                        />
                    </div>
                    <div className="flex gap-2 items-center">
                        <button className="flex items-center gap-1.5 bg-transparent border border-[#e8e8e8] dark:border-[#2d3748] text-[#6b7280] dark:text-[#94a3b8] rounded-lg px-3.5 py-1.75 text-[13px] cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors duration-200">
                            <FilterListIcon sx={{ fontSize: 18 }} /> Filters
                        </button>
                        <button className="flex items-center gap-1.5 bg-transparent border border-[#e8e8e8] dark:border-[#2d3748] text-[#6b7280] dark:text-[#94a3b8] rounded-lg px-3.5 py-1.75 text-[13px] cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors duration-200">
                            Arxiv <ArchiveIcon sx={{ fontSize: 18 }} />
                        </button>
                    </div>
                </div>

                {someSelected && (
                    <div className="flex gap-2.5 px-5 py-2.5 border-b border-[#e8e8e8] dark:border-[#2d3748] bg-[#f5f0ff] dark:bg-[#1a2d42]">
                        <button className="flex items-center gap-1.5 bg-transparent border border-[#f44336] text-[#f44336] rounded-lg px-3.5 py-1.5 text-[13px] cursor-pointer">
                            <DeleteIcon sx={{ fontSize: 16 }} /> Delete
                        </button>
                    </div>
                )}

                <StudentsTable
                    paginated={paginated}
                    selected={selected}
                    allSelected={allSelected}
                    onToggleAll={toggleAll}
                    onToggleOne={toggleOne}
                    onDelete={deleteStudent}
                    onEdit={openEdit}
                />

                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>

            <StudentDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSaved={loadStudents}
                editingStudent={editingStudent}
                apiGroups={apiGroups}
            />
        </div>
    )
}
