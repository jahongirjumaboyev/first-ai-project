import { useContext, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ThemeContext } from '../context/ThemeContext'
import RefreshIcon from '@mui/icons-material/Refresh'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SchoolIcon from '@mui/icons-material/School'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import BusinessIcon from '@mui/icons-material/Business'
import GroupIcon from '@mui/icons-material/Group'
import AssignmentIcon from '@mui/icons-material/Assignment'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import SendIcon from '@mui/icons-material/Send'
import HelpIcon from '@mui/icons-material/Help'
import SecurityIcon from '@mui/icons-material/Security'

const tabs = [
    { id: 'kurslar',   label: 'Kurslar',        Icon: SchoolIcon },
    { id: 'xonalar',   label: 'Xonalar',         Icon: MeetingRoomIcon },
    { id: 'filiallar', label: 'Filiallar',        Icon: BusinessIcon },
    { id: 'xodimlar',  label: 'Xodimlar',         Icon: GroupIcon },
    { id: 'sabablar',  label: 'Sabablar',         Icon: AssignmentIcon },
    { id: 'rollar',    label: 'Rollar',           Icon: VpnKeyIcon },
    { id: 'coin',      label: 'Coin',             Icon: MonetizationOnIcon },
    { id: 'xabar',     label: 'Xabar yuborish',   Icon: SendIcon },
    { id: 'faq',       label: 'FAQ',              Icon: HelpIcon },
    { id: 'tekshiruv', label: 'Tekshiruv',        Icon: SecurityIcon },
]

const branches = [
    'AiCoder markazi', 'Fizika va Matematika', '4-maktab',
    'Niner markazi', 'IELTS full mock', 'IELTS full mock centre', 'Arxiv',
]

const rooms = [
    { name: 'Genious room', capacity: 15 },
    { name: 'Impact room',  capacity: 12 },
    { name: '1A',           capacity: 25 },
    { name: '205-xona',     capacity: 32 },
    { name: '16-xona',      capacity: 18 },
    { name: '5 xona',       capacity: 30 },
    { name: 'IELTS with Islombek', capacity: 20 },
    { name: 'Beginner',     capacity: 18 },
    { name: '99',           capacity: 25 },
]

function XonalarTab({ dark }) {
    const [activeBranch, setActiveBranch] = useState(branches[0])
    const surface = dark ? '#1e2a3a' : '#fff'
    const text1   = dark ? '#e2e8f0' : '#1a1a2e'
    const text2   = dark ? '#94a3b8' : '#888'
    const border  = dark ? '#2d3748' : '#e0e0e0'
    const shadow  = dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.07)'
    return (
        <div>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '17px', fontWeight: 700, color: text1 }}>Xonalar</span>
                    <RefreshIcon sx={{ color: text2, fontSize: 20, cursor: 'pointer' }}
                        onClick={() => {}} />
                </div>
                <button style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: '#7E56D8', color: '#fff', border: 'none',
                    borderRadius: '10px', padding: '9px 16px',
                    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    transition: 'background 0.2s',
                }}
                    onMouseEnter={e => e.currentTarget.style.background = '#6a44c0'}
                    onMouseLeave={e => e.currentTarget.style.background = '#7E56D8'}
                >
                    <AddIcon fontSize="small" /> Xonani qo'shish
                </button>
            </div>

            {/* Branch filter pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {branches.map(b => (
                    <button
                        key={b}
                        onClick={() => setActiveBranch(b)}
                        style={{
                            padding: '6px 14px', borderRadius: '20px',
                            fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                            transition: 'all 0.15s',
                            border: activeBranch === b ? '1.5px solid #7E56D8' : `1.5px solid ${border}`,
                            background: activeBranch === b ? '#7E56D820' : surface,
                            color: activeBranch === b ? '#7E56D8' : text2,
                        }}
                    >
                        {b}
                    </button>
                ))}
            </div>

            {/* Rooms grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '14px',
            }}>
                {rooms.map((room) => (
                    <div key={room.name} style={{
                        background: surface,
                        borderRadius: '14px',
                        padding: '18px 16px',
                        boxShadow: shadow,
                        border: `1px solid ${border}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        transition: 'box-shadow 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(126,86,216,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = shadow}
                    >
                        <div style={{
                            width: '42px', height: '42px', borderRadius: '12px',
                            background: dark ? '#2a1f4a' : '#ede8fb',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <MeetingRoomIcon sx={{ color: '#7E56D8', fontSize: 22 }} />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: text1 }}>{room.name}</p>
                            <p style={{ margin: '2px 0 0', fontSize: '12px', color: text2 }}>Sig'imi: {room.capacity}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                            <button style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '4px', padding: '6px 0', borderRadius: '8px',
                                border: `1px solid ${border}`, background: 'transparent',
                                color: '#e53935', fontSize: '12px', cursor: 'pointer',
                                transition: 'background 0.15s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = '#fce4ec'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <DeleteIcon sx={{ fontSize: 15 }} />
                            </button>
                            <button style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '4px', padding: '6px 0', borderRadius: '8px',
                                border: `1px solid ${border}`, background: 'transparent',
                                color: '#7E56D8', fontSize: '12px', cursor: 'pointer',
                                transition: 'background 0.15s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = dark ? '#2a1f4a' : '#ede8fb'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <EditIcon sx={{ fontSize: 15 }} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function PlaceholderTab({ label, dark }) {
    const text2 = dark ? '#4a5568' : '#bbb'
    return (
        <div style={{ textAlign: 'center', padding: '80px 0', color: text2, fontSize: '14px' }}>
            {label} bo'limi tez kunda
        </div>
    )
}

export default function Settings() {
    const dark = useContext(ThemeContext)
    const [searchParams, setSearchParams] = useSearchParams()
    const urlTab = searchParams.get('tab') || 'kurslar'

    const validTab = tabs.find(t => t.id === urlTab)?.id || 'kurslar'
    const [activeTab, setActiveTab] = useState(validTab)
    const [visible, setVisible] = useState(true)
    const prevTab = useRef(validTab)

    /* Sync URL → active tab with fade transition */
    useEffect(() => {
        if (urlTab === activeTab) return
        setVisible(false)
        const timer = setTimeout(() => {
            setActiveTab(urlTab)
            prevTab.current = urlTab
            setVisible(true)
        }, 150)
        return () => clearTimeout(timer)
    }, [urlTab])

    const switchTab = (id) => {
        if (id === activeTab) return
        setSearchParams({ tab: id })
    }

    const surface = dark ? '#1e2a3a' : '#fff'
    const text1   = dark ? '#e2e8f0' : '#1a1a2e'
    const text2   = dark ? '#94a3b8' : '#888'
    const border  = dark ? '#2d3748' : '#e0e0e0'
    const shadow  = dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)'

    const renderContent = () => {
        switch (activeTab) {
            case 'xonalar': return <XonalarTab dark={dark} />
            default: {
                const tab = tabs.find(t => t.id === activeTab)
                return <PlaceholderTab label={tab?.label || ''} dark={dark} />
            }
        }
    }

    return (
        <div>
            {/* Page title */}
            <h1 style={{ margin: '0 0 20px', fontSize: '22px', fontWeight: 700, color: text1 }}>
                Boshqarish
            </h1>

            {/* Tab bar */}
            <div style={{
                background: surface,
                borderRadius: '14px',
                padding: '6px 8px',
                display: 'flex',
                gap: '4px',
                flexWrap: 'wrap',
                boxShadow: shadow,
                marginBottom: '24px',
                border: `1px solid ${border}`,
            }}>
                {tabs.map(({ id, label, Icon }) => {
                    const isActive = id === (visible ? activeTab : prevTab.current)
                    return (
                        <button
                            key={id}
                            onClick={() => switchTab(id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '8px 14px', borderRadius: '10px',
                                border: 'none', cursor: 'pointer',
                                fontSize: '13px', fontWeight: isActive ? 600 : 400,
                                background: isActive ? '#7E56D8' : 'transparent',
                                color: isActive ? '#fff' : text2,
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <Icon sx={{ fontSize: 16 }} />
                            {label}
                        </button>
                    )
                })}
            </div>

            {/* Tab content with fade + slide transition */}
            <div style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.18s ease, transform 0.18s ease',
            }}>
                {renderContent()}
            </div>
        </div>
    )
}
