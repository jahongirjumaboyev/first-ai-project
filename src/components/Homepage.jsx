import { useState, useRef, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { ThemeContext } from '../context/ThemeContext'
import Logo from '../Logos/educoin.jpg'
import HomeIcon from '@mui/icons-material/Home'
import PeopleIcon from '@mui/icons-material/People'
import ClassIcon from '@mui/icons-material/Class'
import SchoolIcon from '@mui/icons-material/School'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import SettingsIcon from '@mui/icons-material/Settings'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import SearchIcon from '@mui/icons-material/Search'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import BusinessIcon from '@mui/icons-material/Business'
import GroupIcon from '@mui/icons-material/Group'
import AssignmentIcon from '@mui/icons-material/Assignment'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import SendIcon from '@mui/icons-material/Send'
import HelpIcon from '@mui/icons-material/Help'
import SecurityIcon from '@mui/icons-material/Security'

const navItems = [
    { text: 'Asosiy',        icon: <HomeIcon fontSize="small" />,         path: '/dashboard/asosiy' },
    { text: "O'qituvchilar", icon: <PeopleIcon fontSize="small" />,       path: '/dashboard/oqituvchilar' },
    { text: 'Sinflar',       icon: <ClassIcon fontSize="small" />,        path: '/dashboard/sinflar' },
    { text: 'Talabalar',     icon: <SchoolIcon fontSize="small" />,       path: '/dashboard/talabalar' },
    { text: "Sovg'alar",     icon: <CardGiftcardIcon fontSize="small" />, path: '/dashboard/sovgalar' },
]

const boshqarishMenu = [
    { label: 'Kurslar',        icon: <SchoolIcon fontSize="small" />,          tab: 'kurslar' },
    { label: 'Xonalar',        icon: <MeetingRoomIcon fontSize="small" />,      tab: 'xonalar' },
    { label: 'Filial',         icon: <BusinessIcon fontSize="small" />,         tab: 'filiallar' },
    { label: 'Hodimlar',       icon: <GroupIcon fontSize="small" />,            tab: 'xodimlar' },
    { label: 'Sabablar',       icon: <AssignmentIcon fontSize="small" />,       tab: 'sabablar' },
    { label: 'Rollar',         icon: <VpnKeyIcon fontSize="small" />,           tab: 'rollar' },
    { label: 'Coin',           icon: <MonetizationOnIcon fontSize="small" />,   tab: 'coin' },
    { label: 'Xabar Yuborish', icon: <SendIcon fontSize="small" />,             tab: 'xabar' },
    { label: 'FAQ',            icon: <HelpIcon fontSize="small" />,             tab: 'faq' },
    { label: 'Tekshiruv',      icon: <SecurityIcon fontSize="small" />,         tab: 'tekshiruv' },
]

export default function Homepage() {
    const [dark, setDark]       = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [menuVisible, setMenuVisible] = useState(false)

    const navigate   = useNavigate()
    const location   = useLocation()
    const triggerRef = useRef(null)
    const panelRef   = useRef(null)

    const isBoshqarish = location.pathname.includes('boshqarish')

    const surface = dark ? '#1e2a3a' : '#fff'
    const bgMain  = dark ? '#111827' : '#f0f2f5'
    const text1   = dark ? '#e2e8f0' : '#1a1a2e'
    const text2   = dark ? '#94a3b8' : '#888'
    const border  = dark ? '#2d3748' : '#e0e0e0'
    const subCard = dark ? '#1a2d42' : '#f5f0ff'

    /* ── Open / close popup ── */
    const openMenu = () => {
        setMenuOpen(true)
        requestAnimationFrame(() => requestAnimationFrame(() => setMenuVisible(true)))
    }
    const closeMenu = () => {
        setMenuVisible(false)
        setTimeout(() => setMenuOpen(false), 280)
    }
    const toggleMenu = () => menuOpen ? closeMenu() : openMenu()

    /* ── Click outside ── */
    useEffect(() => {
        if (!menuOpen) return
        const handler = (e) => {
            if (!triggerRef.current?.contains(e.target) && !panelRef.current?.contains(e.target)) {
                closeMenu()
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [menuOpen])

    /* ── Navigate to a Boshqarish sub-section ── */
    const goTo = (tab) => {
        navigate(`/dashboard/boshqarish?tab=${tab}`)
        closeMenu()
    }

    const sidebarItemStyle = (isActive) => ({
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 14px', borderRadius: '12px',
        textDecoration: 'none', fontSize: '14px', fontWeight: 500,
        transition: 'all 0.2s ease',
        background: isActive ? '#7E56D8' : 'transparent',
        color: isActive ? '#fff' : (dark ? '#94a3b8' : '#444'),
        cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left',
    })

    return (
        <ThemeContext.Provider value={dark}>
            <div style={{ display: 'flex', height: '100vh', fontFamily: "'Roboto', sans-serif", background: bgMain }}>

                {/* ═══════════ SIDEBAR ═══════════ */}
                <aside style={{
                    width: '220px', minWidth: '220px', background: surface,
                    display: 'flex', flexDirection: 'column',
                    boxShadow: dark ? '2px 0 8px rgba(0,0,0,0.3)' : '2px 0 8px rgba(0,0,0,0.07)',
                    zIndex: 30, height: '100vh', position: 'sticky', top: 0,
                }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '20px 16px 16px', borderBottom: `1px solid ${dark ? '#2d3748' : '#f0f0f0'}` }}>
                        <img src={Logo} alt="logo" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />
                        <span style={{ fontSize: '18px', fontWeight: 700, fontStyle: 'italic', color: '#7E56D8', letterSpacing: '1px' }}>
                            EduCoin
                        </span>
                    </div>

                    {/* Nav */}
                    <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.text}
                                to={item.path}
                                onClick={closeMenu}
                                style={({ isActive }) => sidebarItemStyle(isActive)}
                                className="sidebar-link"
                            >
                                <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                                {item.text}
                            </NavLink>
                        ))}

                        {/* Boshqarish — special item */}
                        <button
                            ref={triggerRef}
                            onClick={toggleMenu}
                            className="sidebar-link"
                            style={sidebarItemStyle(isBoshqarish || menuOpen)}
                        >
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                <SettingsIcon fontSize="small" />
                            </span>
                            Boshqarish
                        </button>
                    </nav>

                    {/* Subscription */}
                    <div style={{ margin: '0 10px 16px', background: subCard, borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <EventAvailableIcon color="success" />
                            <div>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: text1 }}>Obuna</p>
                                <p style={{ margin: 0, fontSize: '12px', color: '#e53935' }}>Obunangiz tugagan</p>
                            </div>
                        </div>
                        <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#e53935', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#c62828'}
                            onMouseLeave={e => e.currentTarget.style.background = '#e53935'}
                        >
                            <ElectricBoltIcon fontSize="small" /> Obunani yangilash
                        </button>
                    </div>
                </aside>

                {/* ═══════════ BOSHQARISH POPUP PANEL ═══════════ */}
                {menuOpen && (
                    <div ref={panelRef} style={{
                        position: 'fixed',
                        left: '220px', top: 0, bottom: 0,
                        width: '220px',
                        background: surface,
                        boxShadow: '4px 0 20px rgba(0,0,0,0.12)',
                        zIndex: 20,
                        display: 'flex', flexDirection: 'column',
                        transform: menuVisible ? 'translateX(0)' : 'translateX(-100%)',
                        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
                        borderRight: `1px solid ${border}`,
                    }}>
                        {/* Panel header */}
                        <div style={{ padding: '20px 16px 12px', borderBottom: `1px solid ${border}` }}>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: '15px', color: text1 }}>Menu</p>
                        </div>

                        {/* Items */}
                        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                            {boshqarishMenu.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => goTo(item.tab)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        width: '100%', padding: '10px 12px', borderRadius: '10px',
                                        border: 'none', background: 'transparent',
                                        color: text2, fontSize: '14px', fontWeight: 400,
                                        cursor: 'pointer', textAlign: 'left',
                                        transition: 'background 0.15s, color 0.15s',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = dark ? '#2d3748' : '#f5f0ff'
                                        e.currentTarget.style.color = '#7E56D8'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'transparent'
                                        e.currentTarget.style.color = text2
                                    }}
                                >
                                    <span style={{ display: 'flex', color: 'inherit' }}>{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                )}

                {/* ═══════════ MAIN CONTENT ═══════════ */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Header */}
                    <header style={{
                        height: '60px', background: surface,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0 24px', gap: '16px',
                        boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
                        position: 'sticky', top: 0, zIndex: 9,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: dark ? '#0f1827' : '#f5f5f5', borderRadius: '10px', padding: '6px 14px', border: `1px solid ${border}` }}>
                            <SearchIcon sx={{ color: text2, fontSize: 18 }} />
                            <input type="text" placeholder="Qidirish..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: text1, width: '180px' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <select style={{ border: `1px solid ${border}`, borderRadius: '8px', padding: '6px 10px', fontSize: '13px', cursor: 'pointer', outline: 'none', color: text2, background: surface }}>
                                <option>O'zbekcha</option>
                                <option>Русский</option>
                                <option>English</option>
                            </select>
                            <button style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '18px', color: '#555', transition: 'background 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.background = dark ? '#1e2a3a' : '#f5f5f5'}
                                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                title="Bildirishnomalar"
                            >🔔</button>
                            <button onClick={() => setDark(d => !d)} style={{ background: dark ? '#7E56D8' : 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '18px', color: '#555', transition: 'background 0.2s' }}
                                title="Tungi rejim"
                            >{dark ? '☀️' : '🌙'}</button>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #7E56D8, #5c3fb5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer', flexShrink: 0 }}>C</div>
                        </div>
                    </header>

                    <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
                        <Outlet />
                    </main>
                </div>

                <style>{`
                    .sidebar-link:not([aria-current="page"]):hover {
                        background: ${dark ? '#1e3a5f' : '#ede8fb'} !important;
                        color: #7E56D8 !important;
                    }
                    .sidebar-link:not([aria-current="page"]):hover span svg {
                        color: #7E56D8 !important;
                    }
                    .sidebar-link[aria-current="page"] span svg { color: #fff !important; }
                    input::placeholder { color: ${text2}; }
                `}</style>
            </div>
        </ThemeContext.Provider>
    )
}
