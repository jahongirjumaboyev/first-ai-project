import { useContext, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ThemeContext } from '../context/ThemeContext'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import RefreshIcon from '@mui/icons-material/Refresh'
import CloseIcon from '@mui/icons-material/Close'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

const tabs = [
    { id: 'kurslar',   label: 'Kurslar' },
    { id: 'xonalar',   label: 'Xonalar' },
    { id: 'filiallar', label: 'Filiallar' },
    { id: 'xodimlar',  label: 'Hodimlar' },
    { id: 'rollar',    label: 'Rollar' },
    { id: 'coin',      label: 'Coin' },
    { id: 'sabablar',  label: 'Sabablar' },
    { id: 'xabar',     label: 'Xabar yuborish' },
    { id: 'faq',       label: 'FAQ' },
    { id: 'telegram',  label: 'Telegram bot' },
]

const courseBranches = ['Filial 1', 'Filial 2', 'Arxiv']
const cardColors     = ['#f8f9ff', '#ffffff', '#fffde7', '#f0fdf4', '#fef2f2', '#f5f0ff']
const cardColorsDark = ['#1e2535', '#1a2336', '#2a2810', '#0d2418', '#2a1018', '#1e1535']

const mockCourses = [
    { id: 1, title: 'Human Resources Manager', desc: "A little about the company and the team that you'll be working with.", duration: '90 min', period: '3 oy', price: '1 000 000 mln' },
    { id: 2, title: 'Human Resources Manager', desc: "A little about the company and the team that you'll be working with.", duration: '90 min', period: '3 oy', price: '1 000 000 mln' },
    { id: 3, title: 'Human Resources Manager', desc: "A little about the company and the team that you'll be working with.", duration: '90 min', period: '3 oy', price: '1 000 000 mln' },
    { id: 4, title: 'Human Resources Manager', desc: "A little about the company and the team that you'll be working with.", duration: '90 min', period: '3 oy', price: '1 000 000 mln' },
    { id: 5, title: 'Human Resources Manager', desc: "A little about the company and the team that you'll be working with.", duration: '90 min', period: '3 oy', price: '1 000 000 mln' },
    { id: 6, title: 'Human Resources Manager', desc: "A little about the company and the team that you'll be working with.", duration: '90 min', period: '3 oy', price: '1 000 000 mln' },
]

const xonaBranches = ['Filial 1', 'Filial 2', 'Filial 3', 'Arxiv']
const mockRooms = [
    { name: 'Genious room',       capacity: 15 },
    { name: 'Impact room',        capacity: 12 },
    { name: '1A',                 capacity: 25 },
    { name: '205-xona',           capacity: 32 },
    { name: '16-xona',            capacity: 18 },
    { name: '5 xona',             capacity: 30 },
    { name: 'IELTS with Islombek',capacity: 20 },
    { name: 'Beginner',           capacity: 18 },
]

const colorPalette = ['#374151','#7E56D8','#e53935','#f57c00','#16a34a','#0891b2','#2563eb','#6366f1','#db2777']

const initKursForm = { name: '', filials: ['Filial 1', 'Filial 2'], duration: '', period: '', price: '', description: '', color: '#7E56D8' }
const initXonaForm = { name: '', capacity: '' }

/* shared Tailwind helpers */
const drawerInputCls = 'w-full border border-[#e5e7eb] dark:border-[#2d3748] rounded-[10px] px-3.5 py-2.5 text-sm bg-white dark:bg-[#111827] text-[#1a1a2e] dark:text-[#e2e8f0] outline-none focus:border-[#7E56D8] transition-colors duration-200'
const branchBtn = (active) => `px-4 py-1.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-150 border ${active ? 'border-[#7E56D8] bg-[#7E56D8]/10 text-[#7E56D8]' : 'border-[#e5e7eb] dark:border-[#2d3748] bg-transparent text-[#888] dark:text-[#94a3b8]'}`
const addBtn = 'flex items-center gap-1.5 bg-[#7E56D8] hover:bg-[#6a44c0] text-white border-none rounded-[10px] px-[18px] py-2.5 text-[13px] font-semibold cursor-pointer transition-colors duration-200'
const cancelBtn = 'px-6 py-2.5 rounded-[10px] text-sm font-medium border border-[#e5e7eb] dark:border-[#2d3748] bg-transparent text-[#1a1a2e] dark:text-[#e2e8f0] cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors duration-200'
const saveBtn = 'px-7 py-2.5 rounded-[10px] text-sm font-semibold border-none bg-[#7E56D8] hover:bg-[#6a44c0] text-white cursor-pointer transition-colors duration-200'

/* ══════════════════════════════════
   Kurs Qo'shish Drawer
══════════════════════════════════ */
function KursDrawer({ open, onClose }) {
    const [visible, setVisible] = useState(false)
    const [form, setForm]       = useState(initKursForm)

    useEffect(() => {
        if (open) requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
        else setVisible(false)
    }, [open])

    if (!open) return null

    const toggleFilial = (f) => setForm(p => ({
        ...p,
        filials: p.filials.includes(f) ? p.filials.filter(x => x !== f) : [...p.filials, f],
    }))

    return (
        <>
            <div onClick={onClose} className={`fixed inset-0 bg-black/45 z-100 transition-opacity duration-280 ${visible ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`fixed top-0 right-0 h-screen w-full sm:w-115 bg-white dark:bg-[#1e2a3a] z-101 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.18)] transition-transform duration-280 ease-in-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-[#e5e7eb] dark:border-[#2d3748] shrink-0 flex items-start justify-between">
                    <div>
                        <h2 className="m-0 mb-1 text-lg font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Kurs qo'shish</h2>
                        <p className="m-0 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">Bu yerda siz yangi Sovg'a qo'shingiz mumkin.</p>
                    </div>
                    <button onClick={onClose} className="border-none bg-transparent cursor-pointer text-[#6b7280] dark:text-[#94a3b8] hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0] flex p-1 transition-colors">
                        <CloseIcon />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">

                    <div>
                        <label className="block text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0] mb-1.5">Nomi</label>
                        <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="HR Manager..." className={drawerInputCls} />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2.5">
                            <label className="text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0]">Kurs mavjud bo'ledigon filiallar</label>
                            <button onClick={() => setForm(p => ({ ...p, filials: ['Filial 1', 'Filial 2'] }))} className="border-none bg-transparent cursor-pointer text-[13px] font-medium text-[#7E56D8] p-0">
                                Hammasini tanlash
                            </button>
                        </div>
                        {['Filial 1', 'Filial 2'].map(f => (
                            <label key={f} className="flex items-center gap-2.5 mb-2 cursor-pointer">
                                <input type="checkbox" checked={form.filials.includes(f)} onChange={() => toggleFilial(f)} className="w-[18px] h-[18px] accent-[#7E56D8] cursor-pointer" />
                                <span className="text-sm text-[#1a1a2e] dark:text-[#e2e8f0]">{f}</span>
                            </label>
                        ))}
                    </div>

                    <div>
                        <label className="block text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0] mb-1.5">Dars davomiyligi</label>
                        <div className="relative">
                            <select value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} className={`${drawerInputCls} appearance-none cursor-pointer`}>
                                <option value="">Tanlang</option>
                                <option value="45">45 min</option>
                                <option value="60">60 min</option>
                                <option value="90">90 min</option>
                                <option value="120">120 min</option>
                            </select>
                            <KeyboardArrowDownIcon sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 20, pointerEvents: 'none', color: '#94a3b8' }} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0] mb-1.5">Kurs davomiyligi (oylarda)</label>
                        <div className="relative">
                            <select value={form.period} onChange={e => setForm(p => ({ ...p, period: e.target.value }))} className={`${drawerInputCls} appearance-none cursor-pointer`}>
                                <option value="">Tanlang</option>
                                <option value="1">1 oy</option>
                                <option value="2">2 oy</option>
                                <option value="3">3 oy</option>
                                <option value="6">6 oy</option>
                                <option value="12">12 oy</option>
                            </select>
                            <KeyboardArrowDownIcon sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 20, pointerEvents: 'none', color: '#94a3b8' }} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0] mb-1.5">Narx</label>
                        <div className="relative">
                            <MonetizationOnIcon sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: '#94a3b8' }} />
                            <input type="text" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="Narxini kiriting" className={`${drawerInputCls} pl-10`} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0] mb-1.5">Description</label>
                        <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="A little about the company and the team that you'll be working with." rows={4} className={`${drawerInputCls} resize-y leading-relaxed`} />
                        <p className="mt-1.5 mb-0 text-xs text-[#6b7280] dark:text-[#94a3b8]">This is a hint text to help user.</p>
                    </div>

                    <div>
                        <label className="block text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0] mb-1">Rangi</label>
                        <p className="m-0 mb-3 text-xs text-[#6b7280] dark:text-[#94a3b8] leading-relaxed">The color you choose will be displayed to users and in the list of roles.</p>
                        <div className="flex gap-2.5 flex-wrap">
                            {colorPalette.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setForm(p => ({ ...p, color: c }))}
                                    className={`w-9 h-9 rounded-full border-none cursor-pointer transition-transform duration-150 ${form.color === c ? 'scale-115' : 'scale-100'}`}
                                    style={{ background: c, outline: form.color === c ? `3px solid ${c}` : '3px solid transparent', outlineOffset: '2px' }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[#e5e7eb] dark:border-[#2d3748] flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className={cancelBtn}>Bekor qilish</button>
                    <button className={saveBtn}>Saqlash</button>
                </div>
            </div>
        </>
    )
}

/* ══════════════════════════════════
   Xona Qo'shish Drawer
══════════════════════════════════ */
function XonaDrawer({ open, onClose }) {
    const [visible, setVisible] = useState(false)
    const [form, setForm]       = useState(initXonaForm)

    useEffect(() => {
        if (open) requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
        else setVisible(false)
    }, [open])

    if (!open) return null

    return (
        <>
            <div onClick={onClose} className={`fixed inset-0 bg-black/45 z-100 transition-opacity duration-280 ${visible ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`fixed top-0 right-0 h-screen w-full sm:w-90 bg-white dark:bg-[#1e2a3a] z-101 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.18)] transition-transform duration-280 ease-in-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}>

                <div className="px-6 pt-6 pb-4 border-b border-[#e5e7eb] dark:border-[#2d3748] shrink-0 flex items-center justify-between">
                    <h2 className="m-0 text-lg font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Xonani qo'shish</h2>
                    <button onClick={onClose} className="border-none bg-transparent cursor-pointer text-[#6b7280] dark:text-[#94a3b8] hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0] flex p-1 transition-colors">
                        <CloseIcon />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
                    <div>
                        <label className="block text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0] mb-1.5">
                            Nomi <span className="text-[#e53935]">*</span>
                        </label>
                        <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Xona nomi" className={drawerInputCls} />
                    </div>
                    <div>
                        <label className="block text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0] mb-1.5">
                            Sig'imi <span className="text-[#e53935]">*</span>
                        </label>
                        <input type="number" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} placeholder="Masalan: 20" className={drawerInputCls} />
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-[#e5e7eb] dark:border-[#2d3748] flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className={cancelBtn}>Bekor qilish</button>
                    <button className={saveBtn}>Saqlash</button>
                </div>
            </div>
        </>
    )
}

/* ══════════════════════════════════
   Kurslar Tab
══════════════════════════════════ */
function KurslarTab({ dark, onAddClick }) {
    const [branch, setBranch] = useState(courseBranches[0])

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <span className="text-base font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Kurslar</span>
                <button onClick={onAddClick} className={addBtn}><AddIcon sx={{ fontSize: 17 }} /> Kurslar qo'shish</button>
            </div>

            <div className="flex gap-2 mb-5">
                {courseBranches.map(b => (
                    <button key={b} onClick={() => setBranch(b)} className={branchBtn(b === branch)}>{b}</button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
                {mockCourses.map((course, i) => {
                    const bg = dark ? cardColorsDark[i % cardColorsDark.length] : cardColors[i % cardColors.length]
                    return (
                        <div
                            key={course.id}
                            className="rounded-[14px] p-4 border border-[#ececec] dark:border-[#2d3748] flex flex-col gap-2 hover:shadow-[0_4px_16px_rgba(126,86,216,0.13)] transition-shadow duration-200"
                            style={{ background: bg }}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <span className="text-[13px] font-bold text-[#1a1a2e] dark:text-[#e2e8f0] leading-snug">{course.title}</span>
                                <div className="flex gap-1 shrink-0">
                                    <button className="border-none bg-transparent p-0.5 cursor-pointer text-[#aaa] hover:text-[#e53935] flex transition-colors duration-150"><DeleteIcon sx={{ fontSize: 16 }} /></button>
                                    <button className="border-none bg-transparent p-0.5 cursor-pointer text-[#aaa] hover:text-[#7E56D8] flex transition-colors duration-150"><EditIcon sx={{ fontSize: 16 }} /></button>
                                </div>
                            </div>
                            <p className="m-0 text-xs text-[#888] dark:text-[#94a3b8] leading-relaxed line-clamp-2">{course.desc}</p>
                            <div className="flex gap-1.5 flex-wrap mt-1">
                                {[course.duration, course.period, course.price].map(tag => (
                                    <span key={tag} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white dark:bg-[#0f1827] text-[#888] dark:text-[#94a3b8] border border-[#e5e7eb] dark:border-[#2d3748]">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

/* ══════════════════════════════════
   Xonalar Tab
══════════════════════════════════ */
function XonalarTab({ onAddClick }) {
    const [branch, setBranch] = useState(xonaBranches[0])

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Xonalar</span>
                    <RefreshIcon sx={{ fontSize: 18, cursor: 'pointer', color: '#94a3b8' }} />
                </div>
                <button onClick={onAddClick} className={addBtn}><AddIcon sx={{ fontSize: 17 }} /> Xonani qo'shish</button>
            </div>

            <div className="flex gap-2 mb-5">
                {xonaBranches.map(b => (
                    <button key={b} onClick={() => setBranch(b)} className={branchBtn(b === branch)}>{b}</button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
                {mockRooms.map(room => (
                    <div
                        key={room.name}
                        className="bg-white dark:bg-[#1e2a3a] rounded-[14px] p-[18px] border border-[#e5e7eb] dark:border-[#2d3748] flex flex-col gap-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_20px_rgba(126,86,216,0.15)] transition-shadow duration-200"
                    >
                        <div className="w-[42px] h-[42px] rounded-xl bg-[#ede8fb] dark:bg-[#2a1f4a] flex items-center justify-center">
                            <MeetingRoomIcon sx={{ color: '#7E56D8', fontSize: 22 }} />
                        </div>
                        <div>
                            <p className="m-0 font-semibold text-sm text-[#1a1a2e] dark:text-[#e2e8f0]">{room.name}</p>
                            <p className="m-0 mt-0.5 text-xs text-[#888] dark:text-[#94a3b8]">Sig'imi: {room.capacity}</p>
                        </div>
                        <div className="flex gap-1.5">
                            <button className="flex-1 flex items-center justify-center py-1.5 rounded-lg border border-[#e5e7eb] dark:border-[#2d3748] bg-transparent text-[#e53935] cursor-pointer hover:bg-[#fce4ec] transition-colors duration-150">
                                <DeleteIcon sx={{ fontSize: 15 }} />
                            </button>
                            <button className="flex-1 flex items-center justify-center py-1.5 rounded-lg border border-[#e5e7eb] dark:border-[#2d3748] bg-transparent text-[#7E56D8] cursor-pointer hover:bg-[#ede8fb] dark:hover:bg-[#2a1f4a] transition-colors duration-150">
                                <EditIcon sx={{ fontSize: 15 }} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function PlaceholderTab({ label }) {
    return (
        <div className="text-center py-20 text-[#bbb] dark:text-[#4a5568] text-sm">
            {label} bo'limi tez kunda
        </div>
    )
}

/* ══════════════════════════════════
   Settings (Boshqarish page)
══════════════════════════════════ */
export default function Settings() {
    const dark = useContext(ThemeContext)
    const [searchParams, setSearchParams] = useSearchParams()
    const urlTab    = searchParams.get('tab') || 'kurslar'
    const activeTab = tabs.find(t => t.id === urlTab)?.id || 'kurslar'

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [xonaOpen, setXonaOpen]     = useState(false)

    const switchTab = (id) => { if (id !== activeTab) setSearchParams({ tab: id }) }

    const renderContent = () => {
        switch (activeTab) {
            case 'kurslar': return <KurslarTab dark={dark} onAddClick={() => setDrawerOpen(true)} />
            case 'xonalar': return <XonalarTab onAddClick={() => setXonaOpen(true)} />
            default: return <PlaceholderTab label={tabs.find(t => t.id === activeTab)?.label || ''} />
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Page header */}
            <div className="mb-5">
                <h1 className="m-0 mb-1.5 text-[22px] font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Boshqarish</h1>
                <p className="m-0 text-[13px] text-[#888] dark:text-[#94a3b8] max-w-[680px] leading-relaxed">
                    Ushbu sahifada siz sovg'alarni boshqarish imkoniyatiga ega bo'lasiz. Har bir sovg'a haqida batafsil ma'lumot va yangi sovg'a qo'shish imkoniyat bor.
                </p>
            </div>

            {/* Tab bar */}
            <div className="bg-white dark:bg-[#1e2a3a] rounded-t-xl border border-[#e5e7eb] dark:border-[#2d3748] border-b-0 flex overflow-x-auto shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]" style={{ scrollbarWidth: 'none' }}>
                {tabs.map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => switchTab(id)}
                        className={`px-[18px] py-3.5 border-none bg-transparent text-[13px] cursor-pointer whitespace-nowrap transition-colors duration-200 border-b-2 ${id === activeTab ? 'text-[#7E56D8] font-semibold border-[#7E56D8]' : 'text-[#888] dark:text-[#94a3b8] font-normal border-transparent hover:text-[#7E56D8]'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Content panel */}
            <div className="bg-white dark:bg-[#1e2a3a] rounded-b-xl border border-[#e5e7eb] dark:border-[#2d3748] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-6 flex-1 overflow-y-auto">
                <div key={activeTab} className="animate-fadeUp">
                    {renderContent()}
                </div>
            </div>

            <KursDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <XonaDrawer open={xonaOpen}   onClose={() => setXonaOpen(false)} />
        </div>
    )
}
