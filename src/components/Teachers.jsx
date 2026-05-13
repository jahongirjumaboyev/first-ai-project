import { useState, useContext, useRef } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import FilterListIcon from '@mui/icons-material/FilterList'
import SearchIcon from '@mui/icons-material/Search'
import ShareIcon from '@mui/icons-material/Share'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import EditIcon from '@mui/icons-material/Edit'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import ArchiveIcon from '@mui/icons-material/Archive'
import CloseIcon from '@mui/icons-material/Close'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'

const mockTeachers = [
    { id: 1,  name: 'Qwerty qwert',    labels: ['Label', 'Label', 'Label'], extra: 4, phone: '+998(33)4082808', birth: '24 Jan 2022', created: '24 Jan 2022' },
    { id: 2,  name: 'Aliyev Jasur',    labels: ['Label'],                   extra: 0, phone: '+998(90)1234567', birth: '15 Mar 1990', created: '10 Jan 2023' },
    { id: 3,  name: 'Karimova Nilufar',labels: ['Label', 'Label'],          extra: 0, phone: '+998(91)2345678', birth: '22 Jun 1988', created: '05 Feb 2023' },
    { id: 4,  name: 'Toshmatov Sarvar',labels: ['Label'],                   extra: 0, phone: '+998(93)3456789', birth: '08 Nov 1995', created: '20 Mar 2023' },
    { id: 5,  name: 'Yusupova Malika', labels: ['Label'],                   extra: 0, phone: '+998(94)4567890', birth: '30 Jan 1992', created: '01 Apr 2023' },
    { id: 6,  name: 'Nazarov Ibrohim', labels: ['Label', 'Label'],          extra: 0, phone: '+998(99)5678901', birth: '12 Sep 1987', created: '15 Apr 2023' },
    { id: 7,  name: 'Holiqova Zulfiya',labels: ['Label'],                   extra: 0, phone: '+998(97)6789012', birth: '25 Dec 1993', created: '28 Apr 2023' },
    { id: 8,  name: 'Rahimov Bobur',   labels: ['Label', 'Label', 'Label'], extra: 1, phone: '+998(95)7890123', birth: '03 Jul 1991', created: '10 May 2023' },
    { id: 9,  name: 'Mirzayev Doniyor',labels: ['Label', 'Label'],          extra: 0, phone: '+998(98)8901234', birth: '18 Feb 1989', created: '22 May 2023' },
    { id: 10, name: 'Saidova Feruza',  labels: ['Label', 'Label', 'Label'], extra: 0, phone: '+998(33)9012345', birth: '07 Aug 1994', created: '05 Jun 2023' },
]

const iconBtn = (color = 'inherit') => ({
    border: 'none', background: 'none', cursor: 'pointer',
    color, padding: '3px', display: 'flex', alignItems: 'center', borderRadius: '4px',
    transition: 'opacity 0.15s',
})

const PAGE_SIZE = 10

const initForm = {
    phone: '+998',
    email: '',
    name: '',
    birth: '01.03.1990',
    groups: ['dFDFASC', 'JDCCXH'],
    groupInput: '',
    gender: '',
    showPassword: false,
    password: '',
    file: null,
}

export default function Teachers() {
    const dark = useContext(ThemeContext)
    const [selected, setSelected]   = useState([1, 2, 5])
    const [search, setSearch]       = useState('')
    const [page, setPage]           = useState(1)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [form, setForm]           = useState(initForm)
    const fileRef = useRef(null)

    const surface  = dark ? '#1e2a3a' : '#fff'
    const text1    = dark ? '#e2e8f0' : '#1a1a2e'
    const text2    = dark ? '#94a3b8' : '#6b7280'
    const border   = dark ? '#2d3748' : '#e8e8e8'
    const theadBg  = dark ? '#162032' : '#f9f8ff'
    const hoverRow = dark ? '#172033' : '#faf8ff'
    const selRow   = dark ? '#1a2d42' : '#f5f0ff'
    const inputBg  = dark ? '#0f1827' : '#fff'
    const drawerBg = dark ? '#1e2a3a' : '#fff'

    const filtered   = mockTeachers.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) || t.phone.includes(search)
    )
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const allSelected  = paginated.length > 0 && paginated.every(t => selected.includes(t.id))
    const someSelected = selected.length > 0

    const toggleAll = () => {
        const ids = paginated.map(t => t.id)
        allSelected
            ? setSelected(prev => prev.filter(id => !ids.includes(id)))
            : setSelected(prev => [...new Set([...prev, ...ids])])
    }
    const toggleOne = (id) => setSelected(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
    const handleSearch = (val) => { setSearch(val); setPage(1) }

    const upd = (key, val) => setForm(prev => ({ ...prev, [key]: val }))
    const addGroup = () => {
        const v = form.groupInput.trim()
        if (v) { upd('groups', [...form.groups, v]); upd('groupInput', '') }
    }
    const removeGroup = (i) => upd('groups', form.groups.filter((_, idx) => idx !== i))
    const closeDrawer = () => { setDrawerOpen(false); setForm(initForm) }

    const pages = totalPages <= 6
        ? Array.from({ length: totalPages }, (_, i) => i + 1)
        : null

    /* ─── Input style helper ─── */
    const inp = (extra = {}) => ({
        width: '100%', boxSizing: 'border-box',
        border: `1px solid ${border}`, borderRadius: '10px',
        padding: '10px 14px', fontSize: '14px',
        background: inputBg, color: text1,
        outline: 'none', ...extra,
    })

    const label = (text) => (
        <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 500, color: text1 }}>{text}</p>
    )

    return (
        <div>
            {/* ── Page header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: text1 }}>O'qituvchilar</h1>
                    <p style={{ margin: '6px 0 0', color: text2, fontSize: '13px', lineHeight: '1.6', maxWidth: '580px' }}>
                        Ushbu sahifada siz o'qituvchilar ro'yxatini va ularning ma'lumotlarini topasiz.
                        Har bir o'qituvchining ismi, fanlari va aloqa ma'lumotlari keltirilgan.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: 'transparent', border: `1px solid ${border}`,
                        color: text1, borderRadius: '10px', padding: '9px 18px',
                        fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                    }}>
                        <ShareIcon sx={{ fontSize: 16 }} /> Export
                    </button>
                    <button
                        onClick={() => setDrawerOpen(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            background: '#7E56D8', color: '#fff', border: 'none',
                            borderRadius: '10px', padding: '9px 18px',
                            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                        }}
                    >
                        <AddIcon sx={{ fontSize: 18 }} /> O'qituvchi qo'shish
                    </button>
                </div>
            </div>

            {/* ── Main card ── */}
            <div style={{
                background: surface, borderRadius: '16px', overflow: 'hidden',
                boxShadow: dark ? '0 2px 16px rgba(0,0,0,0.3)' : '0 2px 16px rgba(0,0,0,0.06)',
            }}>
                {/* Filter bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: `1px solid ${border}` }}>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: 'transparent', border: `1px solid ${border}`,
                        color: text2, borderRadius: '8px', padding: '7px 14px',
                        fontSize: '13px', cursor: 'pointer',
                    }}>
                        <FilterListIcon sx={{ fontSize: 18 }} /> Filters
                    </button>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: dark ? '#0f1827' : '#f5f5f5',
                            border: `1px solid ${border}`, borderRadius: '8px', padding: '7px 12px',
                        }}>
                            <SearchIcon sx={{ color: text2, fontSize: 18 }} />
                            <input
                                value={search}
                                onChange={e => handleSearch(e.target.value)}
                                placeholder="Ism yoki telefon..."
                                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', color: text1, width: '180px' }}
                            />
                        </div>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            background: 'transparent', border: `1px solid ${border}`,
                            color: text2, borderRadius: '8px', padding: '7px 14px', fontSize: '13px', cursor: 'pointer',
                        }}>
                            Arxiv <ArchiveIcon sx={{ fontSize: 18 }} />
                        </button>
                    </div>
                </div>

                {/* Selection action bar */}
                {someSelected && (
                    <div style={{ display: 'flex', gap: '10px', padding: '10px 20px', borderBottom: `1px solid ${border}`, background: dark ? '#1a2d42' : '#f5f0ff' }}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: `1px solid ${border}`, color: text2, borderRadius: '8px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer' }}>
                            <ShareIcon sx={{ fontSize: 16 }} /> Export
                        </button>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid #f44336', color: '#f44336', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer' }}>
                            <DeleteIcon sx={{ fontSize: 16 }} /> Delete
                        </button>
                    </div>
                )}

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ background: theadBg }}>
                                <th style={{ padding: '12px 16px', width: '44px' }}>
                                    <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#7E56D8' }} />
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', color: text2, fontWeight: 500 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Nomi <UnfoldMoreIcon sx={{ fontSize: 16 }} /></div>
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', color: text2, fontWeight: 500 }}>Guruh</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', color: text2, fontWeight: 500 }}>Telefon raqamlari</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', color: text2, fontWeight: 500 }}>Tug'ilgan sanasi</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', color: text2, fontWeight: 500 }}>Yaratilgan sana</th>
                                <th style={{ padding: '12px 16px' }} />
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: text2 }}>Hech narsa topilmadi</td></tr>
                            ) : paginated.map((t) => {
                                const isSel = selected.includes(t.id)
                                return (
                                    <tr key={t.id}
                                        style={{ borderBottom: `1px solid ${border}`, background: isSel ? selRow : 'transparent', transition: 'background 0.15s' }}
                                        onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = hoverRow }}
                                        onMouseLeave={e => { e.currentTarget.style.background = isSel ? selRow : 'transparent' }}
                                    >
                                        <td style={{ padding: '12px 16px' }}>
                                            <input type="checkbox" checked={isSel} onChange={() => toggleOne(t.id)} style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#7E56D8' }} />
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #7E56D8, #5c3fb5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                                                    {t.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: text1 }}>{t.name}</div>
                                                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                                                        {t.labels.map((lbl, i) => (
                                                            <span key={i} style={{ background: dark ? '#2d3748' : '#f0f0f0', color: text2, borderRadius: '4px', padding: '1px 7px', fontSize: '11px', fontWeight: 500 }}>{lbl}</span>
                                                        ))}
                                                        {t.extra > 0 && <span style={{ background: dark ? '#2a1f4a' : '#ede8fb', color: '#7E56D8', borderRadius: '4px', padding: '1px 7px', fontSize: '11px', fontWeight: 600 }}>+{t.extra}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px', color: text2 }}>—</td>
                                        <td style={{ padding: '12px 16px', color: text1 }}>{t.phone}</td>
                                        <td style={{ padding: '12px 16px', color: text2 }}>{t.birth}</td>
                                        <td style={{ padding: '12px 16px', color: text2 }}>{t.created}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                <button style={iconBtn(text2)} title="Ko'rish"><VisibilityIcon sx={{ fontSize: 18 }} /></button>
                                                <button style={iconBtn(text2)} title="Yuklab olish"><FileDownloadIcon sx={{ fontSize: 18 }} /></button>
                                                <button style={iconBtn('#ef4444')} title="O'chirish"><DeleteIcon sx={{ fontSize: 18 }} /></button>
                                                <button style={iconBtn(text2)} title="Tahrirlash"><EditIcon sx={{ fontSize: 18 }} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: `1px solid ${border}` }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: `1px solid ${border}`, color: page === 1 ? text2 : text1, borderRadius: '8px', padding: '6px 14px', fontSize: '13px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>
                        <NavigateBeforeIcon sx={{ fontSize: 18 }} /> Previous
                    </button>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        {(pages || [1, 2, 3]).map(p => (
                            <button key={p} onClick={() => setPage(p)} style={{ width: '34px', height: '34px', borderRadius: '8px', border: 'none', background: page === p ? '#7E56D8' : 'transparent', color: page === p ? '#fff' : text2, fontSize: '13px', cursor: 'pointer', fontWeight: page === p ? 600 : 400 }}>{p}</button>
                        ))}
                        {!pages && <>
                            <span style={{ color: text2, padding: '0 2px' }}>...</span>
                            {[totalPages - 2, totalPages - 1, totalPages].map(p => (
                                <button key={p} onClick={() => setPage(p)} style={{ width: '34px', height: '34px', borderRadius: '8px', border: 'none', background: page === p ? '#7E56D8' : 'transparent', color: page === p ? '#fff' : text2, fontSize: '13px', cursor: 'pointer', fontWeight: page === p ? 600 : 400 }}>{p}</button>
                            ))}
                        </>}
                    </div>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: `1px solid ${border}`, color: page === totalPages ? text2 : text1, borderRadius: '8px', padding: '6px 14px', fontSize: '13px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>
                        Next <NavigateNextIcon sx={{ fontSize: 18 }} />
                    </button>
                </div>
            </div>

            {/* ══════════════ DRAWER OVERLAY ══════════════ */}
            <div
                onClick={closeDrawer}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.45)',
                    zIndex: 200,
                    opacity: drawerOpen ? 1 : 0,
                    pointerEvents: drawerOpen ? 'all' : 'none',
                    transition: 'opacity 0.3s',
                }}
            />

            {/* ══════════════ DRAWER PANEL ══════════════ */}
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: '420px',
                background: drawerBg,
                zIndex: 201,
                transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
                display: 'flex', flexDirection: 'column',
                boxShadow: '-6px 0 32px rgba(0,0,0,0.18)',
            }}>
                {/* Drawer header */}
                <div style={{ padding: '22px 24px 16px', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: text1 }}>O'qituvchi qo'shish</h2>
                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: text2 }}>Bu yerda siz yangi o'qituvchi qo'shishingiz mumkin.</p>
                        </div>
                        <button onClick={closeDrawer} style={{ ...iconBtn(text2), marginTop: '2px' }}>
                            <CloseIcon sx={{ fontSize: 20 }} />
                        </button>
                    </div>
                </div>

                {/* Drawer body — scrollable */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

                    {/* Telefon raqam */}
                    <div>
                        {label('Telefon raqam')}
                        <input
                            value={form.phone}
                            onChange={e => upd('phone', e.target.value)}
                            style={inp()}
                            placeholder="+998"
                        />
                    </div>

                    {/* Mail */}
                    <div>
                        {label('Mail')}
                        <div style={{ position: 'relative' }}>
                            <EmailOutlinedIcon sx={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: text2, fontSize: 18 }} />
                            <input
                                value={form.email}
                                onChange={e => upd('email', e.target.value)}
                                placeholder="Elektron pochtani kiriting"
                                style={inp({ paddingLeft: '38px' })}
                            />
                        </div>
                    </div>

                    {/* O'qituvchi FIO */}
                    <div>
                        {label("O'qituvchi FIO")}
                        <input
                            value={form.name}
                            onChange={e => upd('name', e.target.value)}
                            placeholder="Ma'lumotni kiriting"
                            style={inp()}
                        />
                    </div>

                    {/* Tug'ilgan sanasi */}
                    <div>
                        {label("Tug'ilgan sanasi")}
                        <div style={{ position: 'relative' }}>
                            <CalendarTodayIcon sx={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: text2, fontSize: 16 }} />
                            <input
                                value={form.birth}
                                onChange={e => upd('birth', e.target.value)}
                                placeholder="dd.mm.yyyy"
                                style={inp({ paddingLeft: '38px' })}
                            />
                        </div>
                    </div>

                    {/* Guruh */}
                    <div>
                        {label('Guruh')}
                        <div style={{
                            ...inp(), padding: '7px 12px',
                            display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', cursor: 'text',
                        }}
                            onClick={() => document.getElementById('groupInput').focus()}
                        >
                            <SearchIcon sx={{ color: text2, fontSize: 18, flexShrink: 0 }} />
                            {form.groups.map((g, i) => (
                                <span key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    background: dark ? '#2d3748' : '#f0f0f0',
                                    color: text1, borderRadius: '6px', padding: '3px 8px', fontSize: '12px',
                                }}>
                                    {g}
                                    <button onClick={() => removeGroup(i)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: text2, display: 'flex', padding: 0, lineHeight: 1 }}>
                                        <CloseIcon sx={{ fontSize: 14 }} />
                                    </button>
                                </span>
                            ))}
                            <input
                                id="groupInput"
                                value={form.groupInput}
                                onChange={e => upd('groupInput', e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addGroup() } }}
                                placeholder={form.groups.length === 0 ? 'Guruh kiriting...' : ''}
                                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', color: text1, minWidth: '80px', flex: 1 }}
                            />
                        </div>
                    </div>

                    {/* Jinsi */}
                    <div>
                        {label('Jinsi')}
                        <div style={{ display: 'flex', gap: '24px' }}>
                            {['Erkak', 'Ayol'].map(g => (
                                <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: text1 }}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g}
                                        checked={form.gender === g}
                                        onChange={() => upd('gender', g)}
                                        style={{ accentColor: '#7E56D8', width: '16px', height: '16px', cursor: 'pointer' }}
                                    />
                                    {g}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Surati */}
                    <div>
                        {label('Surati')}
                        <div
                            onClick={() => fileRef.current.click()}
                            style={{
                                border: `2px dashed ${border}`, borderRadius: '12px',
                                padding: '28px 16px', textAlign: 'center', cursor: 'pointer',
                                transition: 'border-color 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#7E56D8'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = border}
                        >
                            <CloudUploadOutlinedIcon sx={{ fontSize: 36, color: '#7E56D8', mb: 1 }} />
                            <p style={{ margin: '8px 0 4px', fontSize: '13px', color: text1 }}>
                                <span style={{ color: '#7E56D8', fontWeight: 600 }}>Click to upload</span>
                                {' '}or drag and drop
                            </p>
                            <p style={{ margin: 0, fontSize: '12px', color: text2 }}>
                                {form.file ? form.file.name : 'JPG or PNG (max. 800x800px)'}
                            </p>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/jpeg,image/png"
                                style={{ display: 'none' }}
                                onChange={e => upd('file', e.target.files[0] || null)}
                            />
                        </div>
                    </div>

                    {/* + Parol qo'shish */}
                    <div>
                        <button
                            onClick={() => upd('showPassword', !form.showPassword)}
                            style={{ border: 'none', background: 'none', color: '#7E56D8', fontSize: '14px', fontWeight: 600, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            <AddIcon sx={{ fontSize: 18 }} /> Parol qo'shish
                        </button>
                        {form.showPassword && (
                            <input
                                value={form.password}
                                onChange={e => upd('password', e.target.value)}
                                type="password"
                                placeholder="Parolni kiriting"
                                style={{ ...inp(), marginTop: '10px' }}
                            />
                        )}
                    </div>
                </div>

                {/* Drawer footer */}
                <div style={{
                    padding: '16px 24px', borderTop: `1px solid ${border}`,
                    display: 'flex', justifyContent: 'flex-end', gap: '10px', flexShrink: 0,
                }}>
                    <button
                        onClick={closeDrawer}
                        style={{
                            padding: '10px 22px', borderRadius: '10px', fontSize: '14px', fontWeight: 500,
                            border: `1px solid ${border}`, background: 'transparent', color: text1, cursor: 'pointer',
                        }}
                    >
                        Bekor qilish
                    </button>
                    <button
                        style={{
                            padding: '10px 22px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                            border: 'none', background: '#7E56D8', color: '#fff', cursor: 'pointer',
                        }}
                    >
                        Saqlash
                    </button>
                </div>
            </div>

            <style>{`
                table td button:hover { opacity: 0.7; }
                #groupInput::placeholder { color: ${text2}; }
            `}</style>
        </div>
    )
}
