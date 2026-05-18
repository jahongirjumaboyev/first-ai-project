import { useState, useRef, useEffect } from 'react'
import { apiGet, apiPost } from '../api'
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


const PAGE_SIZE = 4

function toStudent(s) {
    return {
        id:      s.id,
        name:    s.full_name ?? s.name ?? '—',
        email:   s.email ?? '—',
        phone:   s.phone ?? '—',
        birth:   s.birth_date ?? '—',
        address: s.address ?? '—',
        groups:  Array.isArray(s.groups) ? s.groups.map(g => g?.name ?? g) : [],
        created: s.createdAt ? new Date(s.createdAt).toLocaleDateString('uz-UZ') : '—',
    }
}

const initForm = {
    phone: '+998', name: '', email: '', birth: '2000-01-01',
    groups: [], address: '', gender: '',
    showPassword: false, password: '', file: null,
}


export default function Students() {
    const [students, setStudents]     = useState([])
    const [apiGroups, setApiGroups]   = useState([])
    const [selected, setSelected]     = useState([])
    const [search, setSearch]         = useState('')
    const [page, setPage]             = useState(1)
    const [drawerOpen, setDrawerOpen]       = useState(false)
    const [editingId, setEditingId]         = useState(null)
    const [form, setForm]                   = useState(initForm)
    const [groupModalOpen, setGroupModalOpen] = useState(false)
    const [groupSearch, setGroupSearch]     = useState('')
    const [tempGroups, setTempGroups]       = useState([])
    const [saving, setSaving]               = useState(false)
    const [toast, setToast]                 = useState(null)
    const fileRef = useRef(null)

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

    function showToast(message, type) {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

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
    const toggleTempGroup = (id) => setTempGroups(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    const applyGroups     = () => { upd('groups', tempGroups); closeGroupModal() }
    const getGroupName    = (id) => apiGroups.find(g => g.id === id)?.name ?? id

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

    const saveStudent = async () => {
        if (!form.name || !form.phone || !form.email || !form.password) {
            showToast("⚠️ Ism, telefon, email va parol majburiy!", 'error')
            return
        }
        setSaving(true)
        try {
            await apiPost('/students', {
                full_name:  form.name,
                email:      form.email,
                password:   form.password,
                phone:      form.phone,
                address:    form.address,
                birth_date: form.birth,
                groups:     form.groups,
            })
            await loadStudents()
            showToast("✅ Talaba muvaffaqiyatli qo'shildi!", 'success')
            setTimeout(() => closeDrawer(), 1200)
        } catch (err) {
            showToast(`⚠️ ${err.message}`, 'error')
        } finally {
            setSaving(false)
        }
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
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-9999 flex items-center gap-2.5 px-4 sm:px-7 py-3 sm:py-3.5 rounded-[10px] text-[13px] sm:text-[15px] font-semibold text-white w-[calc(100vw-32px)] sm:w-auto text-center justify-center shadow-[0_6px_24px_rgba(0,0,0,0.25)] ${toast.type === 'success' ? 'bg-[#1F2D5C]' : 'bg-[#c0392b]'}`}>
                    {toast.message}
                </div>
            )}
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
                                {apiGroups
                                    .filter(g => (g.name ?? '').toLowerCase().includes(groupSearch.toLowerCase()))
                                    .map(g => (
                                        <label key={g.id} className="flex items-center gap-3 px-2 py-2.5 rounded-lg cursor-pointer hover:bg-[#f5f0ff] dark:hover:bg-[#2a1f4a] transition-colors duration-150">
                                            <input
                                                type="checkbox"
                                                checked={tempGroups.includes(g.id)}
                                                onChange={() => toggleTempGroup(g.id)}
                                                className="w-4 h-4 accent-[#7E56D8] cursor-pointer shrink-0"
                                            />
                                            <span className="text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0]">{g.name}</span>
                                        </label>
                                    ))
                                }
                                {apiGroups.filter(g => (g.name ?? '').toLowerCase().includes(groupSearch.toLowerCase())).length === 0 && (
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
                        {labelEl('Telefon raqam')}
                        <input
                            value={form.phone}
                            onChange={e => upd('phone', e.target.value)}
                            type="tel"
                            placeholder="+998901234567"
                            className={inputCls}
                        />
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
                            <input type="date" value={form.birth} onChange={e => upd('birth', e.target.value)} className={`${inputCls} pl-10`} />
                        </div>
                    </div>

                    <div>
                        {labelEl('Parol')}
                        <div className="relative">
                            <input
                                value={form.password}
                                onChange={e => upd('password', e.target.value)}
                                type={form.showPassword ? 'text' : 'password'}
                                placeholder="Parolni kiriting"
                                className={inputCls}
                            />
                            <span
                                onClick={() => upd('showPassword', !form.showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#888] text-lg select-none"
                            >
                                {form.showPassword ? '🙈' : '👁️'}
                            </span>
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
                                {form.groups.map((id, i) => (
                                    <span key={id} className="flex items-center gap-1 bg-[#ede8fb] dark:bg-[#2a1f4a] text-[#7E56D8] rounded-lg px-2.5 py-1 text-[13px] font-medium">
                                        {getGroupName(id)}
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
                    <button
                        onClick={saveStudent}
                        disabled={saving}
                        className={`px-5.5 py-2.5 rounded-[10px] text-sm font-semibold border-none text-white transition-colors duration-200 ${saving ? 'bg-[#a78bda] cursor-not-allowed' : 'bg-[#7E56D8] hover:bg-[#6a44c0] cursor-pointer'}`}
                    >
                        {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                </div>
            </div>
        </div>
    )
}
