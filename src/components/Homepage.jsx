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
import GroupIcon from '@mui/icons-material/Group'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import SendIcon from '@mui/icons-material/Send'
import HelpIcon from '@mui/icons-material/Help'
import TelegramIcon from '@mui/icons-material/Telegram'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import LogoutIcon from '@mui/icons-material/Logout'

const navItems = [
    { text: 'Asosiy',        icon: <HomeIcon fontSize="small" />,         path: '/dashboard',             end: true },
    { text: "O'qituvchilar", icon: <PeopleIcon fontSize="small" />,       path: '/dashboard/oqituvchilar' },
    { text: 'Guruhlar',      icon: <ClassIcon fontSize="small" />,        path: '/dashboard/guruhlar' },
    { text: 'Talabalar',     icon: <SchoolIcon fontSize="small" />,       path: '/dashboard/talabalar' },
    { text: "Sovg'alar",     icon: <CardGiftcardIcon fontSize="small" />, path: '/dashboard/sovgalar' },
]

const boshqarishMenu = [
    { label: 'Kurslar',        icon: <SchoolIcon fontSize="small" />,      tab: 'kurslar' },
    { label: 'Xonalar',        icon: <MeetingRoomIcon fontSize="small" />, tab: 'xonalar' },
    { label: 'Hodimlar',       icon: <GroupIcon fontSize="small" />,       tab: 'xodimlar' },
    { label: 'Rollar',         icon: <VpnKeyIcon fontSize="small" />,      tab: 'rollar' },
    { label: 'Xabar Yuborish', icon: <SendIcon fontSize="small" />,        tab: 'xabar' },
    { label: 'FAQ',            icon: <HelpIcon fontSize="small" />,        tab: 'faq' },
    { label: 'Telegram bot',   icon: <TelegramIcon fontSize="small" />,    tab: 'telegram' },
]

export default function Homepage() {
    const [dark, setDark]               = useState(false)
    const [menuOpen, setMenuOpen]       = useState(false)
    const [menuVisible, setMenuVisible] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [collapsed, setCollapsed]     = useState(false)

    const navigate   = useNavigate()
    const location   = useLocation()
    const triggerRef = useRef(null)
    const panelRef   = useRef(null)

    const isBoshqarish = location.pathname.includes('boshqarish')

    /* Token tekshiruvi */
    useEffect(() => {
        if (!localStorage.getItem('token')) navigate('/', { replace: true })
    }, [location.pathname, location.search, navigate])

    useEffect(() => {
        const check = () => {
            if (!localStorage.getItem('token')) navigate('/', { replace: true })
        }
        window.addEventListener('focus', check)
        return () => window.removeEventListener('focus', check)
    }, [navigate])

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark)
    }, [dark])

    const openMenu  = () => {
        setMenuOpen(true)
        requestAnimationFrame(() => requestAnimationFrame(() => setMenuVisible(true)))
    }
    const closeMenu = () => {
        setMenuVisible(false)
        setTimeout(() => setMenuOpen(false), 280)
    }
    const toggleMenu = () => menuOpen ? closeMenu() : openMenu()

    useEffect(() => {
        if (!menuOpen) return
        const handler = (e) => {
            if (!triggerRef.current?.contains(e.target) && !panelRef.current?.contains(e.target)) closeMenu()
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [menuOpen])

    const logout = () => {
        localStorage.removeItem('token')
        navigate('/', { replace: true })
    }

    const handleBoshqarishClick = () => {
        if (window.innerWidth < 768) {
            navigate('/dashboard/boshqarish')
            setSidebarOpen(false)
        } else {
            toggleMenu()
        }
    }

    const goTo = (tab) => {
        navigate(`/dashboard/boshqarish?tab=${tab}`)
        closeMenu()
    }

    /* Sidebar width values */
    const sidebarW     = collapsed ? 'w-14 min-w-14' : 'w-55 min-w-55'
    const popupLeft    = collapsed ? 'left-14' : 'left-55'

    const linkBase     = `flex items-center rounded-xl text-sm font-medium transition-all duration-200 no-underline w-full text-left cursor-pointer border-none py-2.5 ${collapsed ? 'justify-center px-0' : 'gap-3 px-3.5'}`
    const linkActive   = 'bg-[#7E56D8] text-white [&_span_svg]:text-white'
    const linkInactive = 'text-[#444] dark:text-[#94a3b8] bg-transparent hover:bg-[#ede8fb] dark:hover:bg-[#1e3a5f] hover:text-[#7E56D8]'

    return (
        <ThemeContext.Provider value={dark}>
            <div className="flex h-screen bg-[#f0f2f5] dark:bg-[#111827] overflow-hidden">

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                {/* ═══ SIDEBAR ═══ */}
                <aside className={`fixed md:sticky top-0 inset-y-0 left-0 ${sidebarW} bg-white dark:bg-[#1e2a3a] flex flex-col shadow-[2px_0_8px_rgba(0,0,0,0.07)] dark:shadow-[2px_0_8px_rgba(0,0,0,0.3)] z-40 h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

                    {/* Logo row */}
                    <div className={`flex items-center border-b border-[#f0f0f0] dark:border-[#2d3748] h-15 shrink-0 ${collapsed ? 'justify-center px-0' : 'justify-between px-4'}`}>
                        {!collapsed && (
                            <div className="flex items-center gap-2.5">
                                <img src={Logo} alt="logo" className="w-9 h-9 rounded-lg shrink-0" />
                                <span className="text-lg font-bold italic text-[#7E56D8] tracking-[1px] whitespace-nowrap">NajotEdu</span>
                            </div>
                        )}
                        {collapsed && (
                            <img src={Logo} alt="logo" className="w-8 h-8 rounded-lg shrink-0" />
                        )}
                        {/* Desktop collapse toggle */}
                        <button
                            onClick={() => setCollapsed(c => !c)}
                            className={`hidden md:flex items-center justify-center w-7 h-7 rounded-lg border border-[#e8e8e8] dark:border-[#2d3748] bg-white dark:bg-[#1e2a3a] text-[#6b7280] dark:text-[#94a3b8] cursor-pointer hover:bg-[#ede8fb] hover:text-[#7E56D8] hover:border-[#7E56D8] transition-all duration-200 shrink-0 ${collapsed ? 'ml-0' : ''}`}
                        >
                            {collapsed
                                ? <ChevronRightIcon sx={{ fontSize: 16 }} />
                                : <ChevronLeftIcon sx={{ fontSize: 16 }} />
                            }
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className={`flex-1 py-3 flex flex-col gap-1 overflow-y-auto ${collapsed ? 'px-1.5' : 'px-2.5'}`}>
                        {navItems.map(item => (
                            <NavLink
                                key={item.text}
                                to={item.path}
                                end={item.end}
                                title={collapsed ? item.text : undefined}
                                onClick={() => { setSidebarOpen(false); closeMenu() }}
                                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
                            >
                                <span className="flex items-center shrink-0">{item.icon}</span>
                                {!collapsed && item.text}
                            </NavLink>
                        ))}

                        {/* Boshqarish */}
                        <button
                            ref={triggerRef}
                            onClick={handleBoshqarishClick}
                            title={collapsed ? 'Boshqarish' : undefined}
                            className={`${linkBase} ${isBoshqarish || menuOpen ? linkActive : linkInactive}`}
                        >
                            <span className="flex items-center shrink-0"><SettingsIcon fontSize="small" /></span>
                            {!collapsed && 'Boshqarish'}
                        </button>
                    </nav>

                    {/* Subscription — hidden when collapsed */}
                    {!collapsed && (
                        <div className="mx-2.5 bg-[#f5f0ff] dark:bg-[#1a2d42] rounded-[14px] p-3.5 flex flex-col gap-2.5">
                            <div className="flex items-center gap-2.5">
                                <EventAvailableIcon color="success" />
                                <div>
                                    <p className="m-0 font-bold text-sm text-[#1a1a2e] dark:text-[#e2e8f0]">Obuna</p>
                                    <p className="m-0 text-xs text-[#e53935]">Obunangiz tugagan</p>
                                </div>
                            </div>
                            <button className="flex items-center justify-center gap-1.5 bg-[#e53935] hover:bg-[#c62828] text-white border-none rounded-lg py-2 text-xs font-semibold cursor-pointer transition-colors duration-200">
                                <ElectricBoltIcon fontSize="small" /> Obunani yangilash
                            </button>
                        </div>
                    )}

                    {/* Logout */}
                    <div className={`mb-4 mt-2 ${collapsed ? 'px-1.5' : 'px-2.5'}`}>
                        <button
                            onClick={logout}
                            title={collapsed ? 'Chiqish' : undefined}
                            className={`flex items-center w-full rounded-xl py-2.5 text-sm font-medium border-none bg-transparent text-[#e53935] cursor-pointer hover:bg-[#fce4ec] dark:hover:bg-[#3a1a1a] transition-colors duration-200 ${collapsed ? 'justify-center px-0' : 'gap-3 px-3.5'}`}
                        >
                            <LogoutIcon fontSize="small" />
                            {!collapsed && 'Chiqish'}
                        </button>
                    </div>
                </aside>

                {/* ═══ BOSHQARISH POPUP (desktop) ═══ */}
                {menuOpen && (
                    <div
                        ref={panelRef}
                        className={`fixed ${popupLeft} top-0 bottom-0 w-55 bg-white dark:bg-[#1e2a3a] shadow-[4px_0_20px_rgba(0,0,0,0.12)] z-20 flex flex-col border-r border-[#e0e0e0] dark:border-[#2d3748] transition-transform duration-280 ease-in-out ${menuVisible ? 'translate-x-0' : '-translate-x-full'}`}
                    >
                        <div className="px-4 pt-5 pb-3 border-b border-[#e0e0e0] dark:border-[#2d3748]">
                            <p className="m-0 font-bold text-[15px] text-[#1a1a2e] dark:text-[#e2e8f0]">Menu</p>
                        </div>
                        <nav className="flex-1 overflow-y-auto p-2">
                            {boshqarishMenu.map(item => (
                                <button
                                    key={item.label}
                                    onClick={() => goTo(item.tab)}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[10px] border-none bg-transparent text-[#888] dark:text-[#94a3b8] text-sm font-normal cursor-pointer text-left transition-colors duration-150 hover:bg-[#f5f0ff] dark:hover:bg-[#2d3748] hover:text-[#7E56D8]"
                                >
                                    <span className="flex text-inherit">{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                )}

                {/* ═══ MAIN CONTENT ═══ */}
                <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                    {/* Header */}
                    <header className="h-15 bg-white dark:bg-[#1e2a3a] flex items-center justify-between px-4 md:px-6 gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] sticky top-0 z-9 shrink-0">

                        <div className="flex items-center gap-3">
                            {/* Hamburger – mobile only */}
                            <button
                                onClick={() => setSidebarOpen(s => !s)}
                                className="md:hidden border-none bg-transparent cursor-pointer text-[#555] dark:text-[#94a3b8] flex items-center p-1 rounded-lg hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors"
                            >
                                <MenuIcon />
                            </button>
                            {/* Search – desktop */}
                            <div className="hidden md:flex items-center gap-2 bg-[#f5f5f5] dark:bg-[#0f1827] rounded-[10px] px-3.5 py-1.5 border border-[#e0e0e0] dark:border-[#2d3748]">
                                <SearchIcon sx={{ color: '#888', fontSize: 18 }} />
                                <input type="text" placeholder="Qidirish..." className="border-none outline-none bg-transparent text-sm text-[#1a1a2e] dark:text-[#e2e8f0] w-45" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                            <select className="hidden sm:block border border-[#e0e0e0] dark:border-[#2d3748] rounded-lg px-2.5 py-1.5 text-[13px] cursor-pointer outline-none text-[#888] dark:text-[#94a3b8] bg-white dark:bg-[#1e2a3a]">
                                <option>O'zbekcha</option>
                                <option>Русский</option>
                                <option>English</option>
                            </select>
                            <button className="hidden sm:flex bg-transparent hover:bg-[#f5f5f5] dark:hover:bg-[#1e2a3a] border border-[#e0e0e0] dark:border-[#2d3748] rounded-lg px-2.5 py-1.5 cursor-pointer text-lg text-[#555] transition-colors duration-200">
                                🔔
                            </button>
                            <button
                                onClick={() => setDark(d => !d)}
                                className={`border border-[#e0e0e0] dark:border-[#2d3748] rounded-lg px-2.5 py-1.5 cursor-pointer text-lg text-[#555] transition-colors duration-200 ${dark ? 'bg-[#7E56D8]' : 'bg-transparent'}`}
                            >
                                {dark ? '☀️' : '🌙'}
                            </button>
                            <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#7E56D8] to-[#5c3fb5] flex items-center justify-center text-white font-bold text-[15px] cursor-pointer shrink-0">
                                C
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto p-4 md:p-7">
                        <Outlet />
                    </main>
                </div>
            </div>
        </ThemeContext.Provider>
    )
}
