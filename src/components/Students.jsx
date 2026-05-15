import { useState, useRef } from 'react'
import FilterListIcon from '@mui/icons-material/FilterList'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import ArchiveIcon from '@mui/icons-material/Archive'
import CloseIcon from '@mui/icons-material/Close'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'


const mockStudents = [
    { id: 1,  name: 'Ali Valiyev',       groups: ['N26', 'n105'], phone: '+998976541223', email: 'ali@gmail.com',     birth: '12.12.2010', address: 'Sirdaryo',    created: '12.05.2026' },
    { id: 2,  name: 'Salim Qodirov',     groups: ['n105'],        phone: '+998977777777', email: 'salim@gmail.com',   birth: '14.01.2007', address: 'Buxoro',      created: '14.05.2026' },
    { id: 3,  name: 'Bobur Karimov',     groups: ['n105'],        phone: '+998999999999', email: 'bobur@gmail.com',   birth: '14.03.2002', address: 'Toshkent',    created: '14.05.2026' },
    { id: 4,  name: 'Qodir Salimov',     groups: ['n105'],        phone: '+998911111111', email: 'qodir@gmail.com',   birth: '29.04.2003', address: "O'zbekiston", created: '14.05.2026' },
    { id: 5,  name: 'Nodira Yusupova',   groups: ['N26'],         phone: '+998901234567', email: 'nodira@gmail.com',  birth: '05.07.2001', address: 'Toshkent',    created: '13.05.2026' },
    { id: 6,  name: 'Jasur Toshmatov',   groups: ['n105'],        phone: '+998931234567', email: 'jasur@gmail.com',   birth: '22.03.2003', address: 'Namangan',    created: '13.05.2026' },
    { id: 7,  name: 'Malika Karimova',   groups: ['N26', 'n105'], phone: '+998941234567', email: 'malika@gmail.com',  birth: '11.11.2000', address: 'Samarqand',   created: '12.05.2026' },
    { id: 8,  name: 'Sardor Nazarov',    groups: ['n105'],        phone: '+998951234567', email: 'sardor@gmail.com',  birth: '18.06.2002', address: "Farg'ona",    created: '11.05.2026' },
    { id: 9,  name: 'Zulfiya Holiqova',  groups: ['N26'],         phone: '+998971234567', email: 'zulfiya@gmail.com', birth: '30.09.1999', address: 'Andijon',     created: '10.05.2026' },
    { id: 10, name: 'Doniyor Mirzayev',  groups: ['n105'],        phone: '+998981234567', email: 'doniyor@gmail.com', birth: '14.02.2004', address: 'Qashqadaryo', created: '09.05.2026' },
    { id: 11, name: 'Feruza Saidova',    groups: ['N26'],         phone: '+998902345678', email: 'feruza@gmail.com',  birth: '08.08.2003', address: 'Toshkent',    created: '08.05.2026' },
    { id: 12, name: 'Ibrohim Rahimov',   groups: ['n105'],        phone: '+998912345678', email: 'ibrohim@gmail.com', birth: '25.01.2000', address: 'Buxoro',      created: '07.05.2026' },
    { id: 13, name: 'Dilnoza Ortiqova',  groups: ['N26', 'n105'], phone: '+998922345678', email: 'dilnoza@gmail.com', birth: '19.05.2001', address: 'Namangan',    created: '06.05.2026' },
    { id: 14, name: 'Ulugbek Xolmatov', groups: ['n105'],        phone: '+998932345678', email: 'ulugbek@gmail.com', birth: '03.03.2002', address: 'Sirdaryo',    created: '05.05.2026' },
    { id: 15, name: 'Shahlo Tursunova',  groups: ['N26'],         phone: '+998942345678', email: 'shahlo@gmail.com',  birth: '27.07.2000', address: 'Samarqand',   created: '04.05.2026' },
    { id: 16, name: 'Azizbek Qodirov',  groups: ['n105'],        phone: '+998952345678', email: 'aziz@gmail.com',    birth: '12.10.2003', address: "Farg'ona",    created: '03.05.2026' },
    { id: 17, name: 'Mohinur Hasanova',  groups: ['N26'],         phone: '+998962345678', email: 'mohinur@gmail.com', birth: '06.06.2001', address: 'Toshkent',    created: '02.05.2026' },
    { id: 18, name: 'Sanjar Usmonov',    groups: ['n105'],        phone: '+998972345678', email: 'sanjar@gmail.com',  birth: '21.12.2002', address: 'Andijon',     created: '01.05.2026' },
    { id: 19, name: 'Barno Yuldasheva',  groups: ['N26', 'n105'], phone: '+998982345678', email: 'barno@gmail.com',   birth: '15.04.1999', address: 'Qashqadaryo', created: '30.04.2026' },
    { id: 20, name: 'Otabek Ergashev',   groups: ['n105'],        phone: '+998903456789', email: 'otabek@gmail.com',  birth: '09.09.2004', address: 'Buxoro',      created: '29.04.2026' },
    { id: 21, name: 'Kamola Askarova',   groups: ['N26'],         phone: '+998913456789', email: 'kamola@gmail.com',  birth: '17.02.2003', address: 'Namangan',    created: '28.04.2026' },
    { id: 22, name: 'Sherzod Tojiboyev', groups: ['n105'],        phone: '+998923456789', email: 'sherzod@gmail.com', birth: '04.04.2001', address: 'Toshkent',    created: '27.04.2026' },
    { id: 23, name: 'Gulnora Xasanova',  groups: ['N26'],         phone: '+998933456789', email: 'gulnora@gmail.com', birth: '23.08.2000', address: 'Sirdaryo',    created: '26.04.2026' },
    { id: 24, name: 'Ravshan Yunusov',   groups: ['n105'],        phone: '+998943456789', email: 'ravshan@gmail.com', birth: '31.10.2002', address: 'Samarqand',   created: '25.04.2026' },
    { id: 25, name: 'Nargiza Boqiyeva',  groups: ['N26', 'n105'], phone: '+998953456789', email: 'nargiza@gmail.com', birth: '13.06.2001', address: "Farg'ona",    created: '24.04.2026' },
    { id: 26, name: 'Firdavs Normatov',  groups: ['n105'],        phone: '+998963456789', email: 'firdavs@gmail.com', birth: '26.11.2003', address: 'Andijon',     created: '23.04.2026' },
    { id: 27, name: 'Latofat Sultonova', groups: ['N26'],         phone: '+998973456789', email: 'latofat@gmail.com', birth: '02.01.2002', address: 'Qashqadaryo', created: '22.04.2026' },
    { id: 28, name: 'Mirzo Hamidov',     groups: ['n105'],        phone: '+998983456789', email: 'mirzo@gmail.com',   birth: '16.03.2004', address: 'Buxoro',      created: '21.04.2026' },
    { id: 29, name: 'Sarvinoz Nazarova', groups: ['N26'],         phone: '+998904567890', email: 'sarvinoz@gmail.com',birth: '07.05.2000', address: 'Namangan',    created: '20.04.2026' },
    { id: 30, name: 'Husan Razzaqov',    groups: ['n105'],        phone: '+998914567890', email: 'husan@gmail.com',   birth: '20.07.2003', address: 'Toshkent',    created: '19.04.2026' },
    { id: 31, name: 'Munira Xoliqova',   groups: ['N26', 'n105'], phone: '+998924567890', email: 'munira@gmail.com',  birth: '10.09.2001', address: 'Sirdaryo',    created: '18.04.2026' },
    { id: 32, name: 'Bekzod Raximov',    groups: ['n105'],        phone: '+998934567890', email: 'bekzod@gmail.com',  birth: '28.02.2002', address: 'Samarqand',   created: '17.04.2026' },
    { id: 33, name: 'Ozoda Qosimova',    groups: ['N26'],         phone: '+998944567890', email: 'ozoda@gmail.com',   birth: '11.12.1999', address: "Farg'ona",    created: '16.04.2026' },
    { id: 34, name: 'Temur Boymurodov',  groups: ['n105'],        phone: '+998954567890', email: 'temur@gmail.com',   birth: '24.04.2004', address: 'Andijon',     created: '15.04.2026' },
    { id: 35, name: 'Hulkar Madaminova', groups: ['N26'],         phone: '+998964567890', email: 'hulkar@gmail.com',  birth: '05.06.2003', address: 'Qashqadaryo', created: '14.04.2026' },
    { id: 36, name: 'Sirojiddin Umarov', groups: ['n105'],        phone: '+998974567890', email: 'siroj@gmail.com',   birth: '18.08.2002', address: 'Buxoro',      created: '13.04.2026' },
    { id: 37, name: 'Dilorom Tursunova', groups: ['N26', 'n105'], phone: '+998984567890', email: 'dilorom@gmail.com', birth: '01.10.2000', address: 'Namangan',    created: '12.04.2026' },
    { id: 38, name: 'Anvar Xudoyberdiyev', groups: ['n105'],      phone: '+998905678901', email: 'anvar@gmail.com',   birth: '14.01.2003', address: 'Toshkent',    created: '11.04.2026' },
    { id: 39, name: 'Nozima Ergasheva',  groups: ['N26'],         phone: '+998915678901', email: 'nozima@gmail.com',  birth: '29.03.2001', address: 'Sirdaryo',    created: '10.04.2026' },
    { id: 40, name: 'Farhodjon Sobirov', groups: ['n105'],        phone: '+998925678901', email: 'farhod@gmail.com',  birth: '22.06.2004', address: 'Samarqand',   created: '09.04.2026' },
]

const PAGE_SIZE = 4

const availableGroups = ['N26', 'n105', 'A15', 'B20', 'C10', 'D35']

const initForm = {
    phone: '+998', name: '', email: '', birth: '01.01.2000',
    groups: [], address: '', gender: '',
    showPassword: false, password: '', file: null,
}

export default function Students() {
    const [students, setStudents]     = useState(mockStudents)
    const [selected, setSelected]     = useState([])
    const [search, setSearch]         = useState('')
    const [page, setPage]             = useState(1)
    const [drawerOpen, setDrawerOpen]       = useState(false)
    const [editingId, setEditingId]         = useState(null)
    const [form, setForm]                   = useState(initForm)
    const [groupModalOpen, setGroupModalOpen] = useState(false)
    const [groupSearch, setGroupSearch]     = useState('')
    const [tempGroups, setTempGroups]       = useState([])
    const fileRef = useRef(null)

    const filtered   = students.filter(s =>
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

    const upd = (key, val) => setForm(prev => ({ ...prev, [key]: val }))
    const removeGroup = (i) => upd('groups', form.groups.filter((_, idx) => idx !== i))

    const openGroupModal  = () => { setTempGroups([...form.groups]); setGroupSearch(''); setGroupModalOpen(true) }
    const closeGroupModal = () => setGroupModalOpen(false)
    const toggleTempGroup = (g) => setTempGroups(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
    const applyGroups     = () => { upd('groups', tempGroups); closeGroupModal() }

    const closeDrawer = () => { setDrawerOpen(false); setEditingId(null); setForm(initForm) }

    const openEdit = (s) => {
        setForm({ ...initForm, name: s.name, email: s.email, birth: s.birth, address: s.address, groups: [...s.groups], gender: s.gender || '' })
        setEditingId(s.id)
        setDrawerOpen(true)
    }

    const deleteStudent = (id) => {
        setStudents(prev => prev.filter(s => s.id !== id))
        setSelected(prev => prev.filter(x => x !== id))
    }

    const saveStudent = () => {
        if (editingId !== null) {
            setStudents(prev => prev.map(s =>
                s.id === editingId
                    ? { ...s, name: form.name, email: form.email, birth: form.birth, address: form.address, groups: form.groups }
                    : s
            ))
        } else {
            const newId = Date.now()
            setStudents(prev => [{ id: newId, name: form.name, email: form.email, birth: form.birth, address: form.address, groups: form.groups, phone: form.phone, created: new Date().toLocaleDateString('uz-UZ') }, ...prev])
        }
        closeDrawer()
    }

    /* Pagination button list */
    const buildPages = () => {
        if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1)
        return null
    }
    const pages = buildPages()

    const inputCls = 'w-full border border-[#e8e8e8] dark:border-[#2d3748] rounded-[10px] px-3.5 py-2.5 text-sm bg-white dark:bg-[#0f1827] text-[#1a1a2e] dark:text-[#e2e8f0] outline-none focus:border-[#7E56D8] transition-colors duration-200'
    const labelEl  = (text) => <p className="m-0 mb-1.5 text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0]">{text}</p>
    const iconBtn  = 'border-none bg-transparent cursor-pointer p-[3px] flex items-center rounded transition-opacity duration-150 hover:opacity-70'

    return (
        <div>
            {/* Page header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start mb-5">
                <div>
                    <h1 className="m-0 text-2xl font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Talabalar</h1>
                    <p className="mt-1.5 mb-0 text-[#6b7280] dark:text-[#94a3b8] text-[13px] leading-relaxed max-w-full sm:max-w-145">
                        Ushbu sahifada siz Talabalar ro'yxatini va ularning ma'lumotlarini topasiz.
                        Har bir Talaba ismi, fanlari va aloqa ma'lumotlari keltirilgan.
                    </p>
                </div>
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="flex items-center gap-1.5 bg-[#7E56D8] hover:bg-[#6a44c0] text-white border-none rounded-[10px] px-4.5 py-2.5 text-[13px] font-semibold cursor-pointer transition-colors duration-200 shrink-0 w-fit"
                >
                    <AddIcon sx={{ fontSize: 18 }} /> Talaba qo'shish
                </button>
            </div>

            {/* Main card */}
            <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)]">

                {/* Filter bar */}
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

                {/* Selection bar */}
                {someSelected && (
                    <div className="flex gap-2.5 px-5 py-2.5 border-b border-[#e8e8e8] dark:border-[#2d3748] bg-[#f5f0ff] dark:bg-[#1a2d42]">
                        <button className="flex items-center gap-1.5 bg-transparent border border-[#f44336] text-[#f44336] rounded-lg px-3.5 py-1.5 text-[13px] cursor-pointer">
                            <DeleteIcon sx={{ fontSize: 16 }} /> Delete
                        </button>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max border-collapse text-[13px]">
                        <thead>
                            <tr className="bg-[#f9f8ff] dark:bg-[#162032]">
                                <th className="px-4 py-3 w-11">
                                    <input type="checkbox" checked={allSelected} onChange={toggleAll} className="cursor-pointer w-4 h-4 accent-[#7E56D8]" />
                                </th>
                                <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium">
                                    <div className="flex items-center gap-1">Nomi <UnfoldMoreIcon sx={{ fontSize: 16 }} /></div>
                                </th>
                                <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium">Guruh</th>
                                <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium">Telefon raqamlari</th>
                                <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium">Email</th>
                                <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium">Tug'ilgan sanasi</th>
                                <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium">Manzil</th>
                                <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium">Yaratilgan sana</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr><td colSpan={9} className="px-4 py-10 text-center text-[#6b7280] dark:text-[#94a3b8]">Hech narsa topilmadi</td></tr>
                            ) : paginated.map((s) => {
                                const isSel = selected.includes(s.id)
                                return (
                                    <tr
                                        key={s.id}
                                        className={`border-b border-[#e8e8e8] dark:border-[#2d3748] transition-colors duration-150 ${isSel ? 'bg-[#f5f0ff] dark:bg-[#1a2d42]' : 'hover:bg-[#faf8ff] dark:hover:bg-[#172033]'}`}
                                    >
                                        <td className="px-4 py-3">
                                            <input type="checkbox" checked={isSel} onChange={() => toggleOne(s.id)} className="cursor-pointer w-4 h-4 accent-[#7E56D8]" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8.5 h-8.5 rounded-full bg-[#d1d5db] dark:bg-[#4a5568] flex items-center justify-center text-[#6b7280] dark:text-[#94a3b8] text-[11px] font-bold shrink-0">
                                                    {s.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-[#1a1a2e] dark:text-[#e2e8f0] whitespace-nowrap">{s.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1 flex-wrap">
                                                {s.groups.map((g, i) => (
                                                    <span key={i} className="bg-[#f0f0f0] dark:bg-[#2d3748] text-[#555] dark:text-[#94a3b8] rounded-md px-2 py-0.5 text-[11px] font-medium whitespace-nowrap">{g}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-[#1a1a2e] dark:text-[#e2e8f0] whitespace-nowrap">{s.phone}</td>
                                        <td className="px-4 py-3 text-[#6b7280] dark:text-[#94a3b8]">{s.email}</td>
                                        <td className="px-4 py-3 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">{s.birth}</td>
                                        <td className="px-4 py-3 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">{s.address}</td>
                                        <td className="px-4 py-3 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">{s.created}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-0.5">
                                                <button className={`${iconBtn} text-[#6b7280] dark:text-[#94a3b8]`}><VisibilityIcon sx={{ fontSize: 18 }} /></button>
                                                <button onClick={() => deleteStudent(s.id)} className={`${iconBtn} text-[#ef4444]`}><DeleteIcon sx={{ fontSize: 18 }} /></button>
                                                <button onClick={() => openEdit(s)} className={`${iconBtn} text-[#6b7280] dark:text-[#94a3b8]`}><EditIcon sx={{ fontSize: 18 }} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center px-5 py-3.5 border-t border-[#e8e8e8] dark:border-[#2d3748]">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className={`flex items-center gap-1 bg-transparent border border-[#e8e8e8] dark:border-[#2d3748] rounded-lg px-3.5 py-1.5 text-[13px] ${page === 1 ? 'opacity-50 cursor-not-allowed text-[#6b7280]' : 'cursor-pointer text-[#1a1a2e] dark:text-[#e2e8f0] hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748]'} transition-colors duration-200`}
                    >
                        <NavigateBeforeIcon sx={{ fontSize: 18 }} /> Previous
                    </button>
                    <div className="flex gap-1 items-center">
                        {(pages || [1, 2, 3]).map(p => (
                            <button key={p} onClick={() => setPage(p)} className={`w-8.5 h-8.5 rounded-lg border-none text-[13px] cursor-pointer font-medium transition-colors duration-200 ${page === p ? 'bg-[#7E56D8] text-white font-semibold' : 'bg-transparent text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748]'}`}>{p}</button>
                        ))}
                        {!pages && (
                            <>
                                <span className="text-[#6b7280] px-0.5">...</span>
                                {[totalPages - 2, totalPages - 1, totalPages].map(p => (
                                    <button key={p} onClick={() => setPage(p)} className={`w-8.5 h-8.5 rounded-lg border-none text-[13px] cursor-pointer transition-colors duration-200 ${page === p ? 'bg-[#7E56D8] text-white font-semibold' : 'bg-transparent text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748]'}`}>{p}</button>
                                ))}
                            </>
                        )}
                    </div>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className={`flex items-center gap-1 bg-transparent border border-[#e8e8e8] dark:border-[#2d3748] rounded-lg px-3.5 py-1.5 text-[13px] ${page === totalPages ? 'opacity-50 cursor-not-allowed text-[#6b7280]' : 'cursor-pointer text-[#1a1a2e] dark:text-[#e2e8f0] hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748]'} transition-colors duration-200`}
                    >
                        Next <NavigateNextIcon sx={{ fontSize: 18 }} />
                    </button>
                </div>
            </div>

            {/* Group selection modal */}
            {groupModalOpen && (
                <>
                    <div onClick={closeGroupModal} className="fixed inset-0 bg-black/40 z-299" />
                    <div className="fixed inset-0 flex items-center justify-center z-300 p-4">
                        <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.22)] w-full max-w-sm flex flex-col">
                            {/* Modal header */}
                            <div className="px-6 pt-5 pb-4 border-b border-[#e8e8e8] dark:border-[#2d3748]">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="m-0 text-base font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Guruhga biriktirish</h3>
                                        <p className="mt-0.5 mb-0 text-[12px] text-[#6b7280] dark:text-[#94a3b8]">Bir yoki bir nechta guruhni tanlang</p>
                                    </div>
                                    <button onClick={closeGroupModal} className="border-none bg-transparent cursor-pointer text-[#6b7280] dark:text-[#94a3b8] flex p-1 hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0] transition-colors">
                                        <CloseIcon sx={{ fontSize: 20 }} />
                                    </button>
                                </div>
                                {/* Search */}
                                <div className="flex items-center gap-2 mt-3 bg-[#f5f5f5] dark:bg-[#0f1827] border border-[#e8e8e8] dark:border-[#2d3748] rounded-lg px-3 py-1.75">
                                    <SearchIcon sx={{ color: '#94a3b8', fontSize: 17 }} />
                                    <input
                                        value={groupSearch}
                                        onChange={e => setGroupSearch(e.target.value)}
                                        placeholder="Guruh qidirish..."
                                        className="border-none outline-none bg-transparent text-[13px] text-[#1a1a2e] dark:text-[#e2e8f0] w-full"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            {/* Group list */}
                            <div className="px-6 py-3 flex flex-col gap-0.5 max-h-56 overflow-y-auto">
                                {availableGroups
                                    .filter(g => g.toLowerCase().includes(groupSearch.toLowerCase()))
                                    .map(g => {
                                        const checked = tempGroups.includes(g)
                                        return (
                                            <label key={g} className="flex items-center gap-3 px-2 py-2.5 rounded-lg cursor-pointer hover:bg-[#f5f0ff] dark:hover:bg-[#2a1f4a] transition-colors duration-150">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => toggleTempGroup(g)}
                                                    className="w-4 h-4 accent-[#7E56D8] cursor-pointer shrink-0"
                                                />
                                                <span className="text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0]">{g}</span>
                                            </label>
                                        )
                                    })
                                }
                                {availableGroups.filter(g => g.toLowerCase().includes(groupSearch.toLowerCase())).length === 0 && (
                                    <p className="text-center text-[13px] text-[#6b7280] dark:text-[#94a3b8] py-4">Hech narsa topilmadi</p>
                                )}
                            </div>
                            {/* Modal footer */}
                            <div className="px-6 py-4 border-t border-[#e8e8e8] dark:border-[#2d3748] flex justify-end gap-2.5">
                                <button
                                    onClick={closeGroupModal}
                                    className="px-5 py-2 rounded-[10px] text-sm font-medium border border-[#e8e8e8] dark:border-[#2d3748] bg-transparent text-[#1a1a2e] dark:text-[#e2e8f0] cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors duration-200"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    onClick={applyGroups}
                                    className="px-5 py-2 rounded-[10px] text-sm font-semibold border-none bg-[#7E56D8] hover:bg-[#6a44c0] text-white cursor-pointer transition-colors duration-200"
                                >
                                    Qo'shish
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Overlay */}
            <div
                onClick={closeDrawer}
                className={`fixed inset-0 bg-black/45 z-200 transition-opacity duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            />

            {/* Drawer */}
            <div className={`fixed top-0 right-0 bottom-0 w-full sm:w-88 bg-white dark:bg-[#1e2a3a] z-201 flex flex-col shadow-[-6px_0_32px_rgba(0,0,0,0.18)] transition-transform duration-350 ease-in-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="px-6 pt-5.5 pb-4 border-b border-[#e8e8e8] dark:border-[#2d3748] shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="m-0 text-lg font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">{editingId ? "Talabani tahrirlash" : "Talaba qo'shish"}</h2>
                            <p className="mt-1 mb-0 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">{editingId ? "Talaba ma'lumotlarini yangilang." : "Bu yerda siz yangi talaba qo'shishingiz mumkin."}</p>
                        </div>
                        <button onClick={closeDrawer} className="border-none bg-transparent cursor-pointer text-[#6b7280] dark:text-[#94a3b8] flex p-1 mt-0.5 hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0] transition-colors">
                            <CloseIcon sx={{ fontSize: 20 }} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4.5">

                    <div>
                        {labelEl('Talaba FIO')}
                        <input value={form.name} onChange={e => upd('name', e.target.value)} placeholder="Ma'lumotni kiriting" className={inputCls} />
                    </div>

                    <div>
                        {labelEl('Email')}
                        <div className="relative">
                            <EmailOutlinedIcon sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#94a3b8' }} />
                            <input value={form.email} onChange={e => upd('email', e.target.value)} placeholder="Elektron pochtani kiriting" className={`${inputCls} pl-10`} />
                        </div>
                    </div>

                    <div>
                        {labelEl("Tug'ilgan sanasi")}
                        <div className="relative">
                            <CalendarTodayIcon sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#94a3b8' }} />
                            <input value={form.birth} onChange={e => upd('birth', e.target.value)} placeholder="dd.mm.yyyy" className={`${inputCls} pl-10`} />
                        </div>
                    </div>

                    <div>
                        {labelEl('Manzil')}
                        <div className="relative">
                            <LocationOnOutlinedIcon sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#94a3b8' }} />
                            <input value={form.address} onChange={e => upd('address', e.target.value)} placeholder="Shahar yoki viloyat" className={`${inputCls} pl-10`} />
                        </div>
                    </div>

                    <div>
                        {labelEl('Guruh')}
                        {form.groups.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {form.groups.map((g, i) => (
                                    <span key={i} className="flex items-center gap-1 bg-[#ede8fb] dark:bg-[#2a1f4a] text-[#7E56D8] rounded-lg px-2.5 py-1 text-[13px] font-medium">
                                        {g}
                                        <button onClick={() => removeGroup(i)} className="border-none bg-transparent cursor-pointer text-[#7E56D8] flex p-0 leading-none hover:text-[#e53935] transition-colors duration-150">
                                            <CloseIcon sx={{ fontSize: 14 }} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={openGroupModal}
                            className="w-full flex items-center justify-center gap-1.5 border border-dashed border-[#7E56D8] text-[#7E56D8] rounded-[10px] py-2.5 text-[13px] font-medium cursor-pointer hover:bg-[#f5f0ff] dark:hover:bg-[#2a1f4a] transition-colors duration-200 bg-transparent"
                        >
                            <AddIcon sx={{ fontSize: 16 }} /> Guruh qo'shish
                        </button>
                    </div>

                    <div>
                        {labelEl('Jinsi')}
                        <div className="flex gap-6">
                            {['Erkak', 'Ayol'].map(g => (
                                <label key={g} className="flex items-center gap-2 cursor-pointer text-sm text-[#1a1a2e] dark:text-[#e2e8f0]">
                                    <input
                                        type="radio" name="student_gender" value={g}
                                        checked={form.gender === g}
                                        onChange={() => upd('gender', g)}
                                        className="accent-[#7E56D8] w-4 h-4 cursor-pointer"
                                    />
                                    {g}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        {labelEl('Surati')}
                        <div
                            onClick={() => fileRef.current.click()}
                            className="border-2 border-dashed border-[#e8e8e8] dark:border-[#2d3748] hover:border-[#7E56D8] rounded-xl px-4 py-7 text-center cursor-pointer transition-colors duration-200"
                        >
                            <CloudUploadOutlinedIcon sx={{ fontSize: 36, color: '#7E56D8' }} />
                            <p className="mt-2 mb-1 text-[13px] text-[#1a1a2e] dark:text-[#e2e8f0]">
                                <span className="text-[#7E56D8] font-semibold">Click to upload</span>{' '}or drag and drop
                            </p>
                            <p className="m-0 text-xs text-[#6b7280] dark:text-[#94a3b8]">
                                {form.file ? form.file.name : 'JPG or PNG (max. 800x800px)'}
                            </p>
                            <input ref={fileRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={e => upd('file', e.target.files[0] || null)} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[#e8e8e8] dark:border-[#2d3748] flex justify-end gap-2.5 shrink-0">
                    <button
                        onClick={closeDrawer}
                        className="px-5.5 py-2.5 rounded-[10px] text-sm font-medium border border-[#e8e8e8] dark:border-[#2d3748] bg-transparent text-[#1a1a2e] dark:text-[#e2e8f0] cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors duration-200"
                    >
                        Bekor qilish
                    </button>
                    <button onClick={saveStudent} className="px-5.5 py-2.5 rounded-[10px] text-sm font-semibold border-none bg-[#7E56D8] hover:bg-[#6a44c0] text-white cursor-pointer transition-colors duration-200">
                        Saqlash
                    </button>
                </div>
            </div>
        </div>
    )
}
