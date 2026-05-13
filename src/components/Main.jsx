import { useContext, useState } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import ClassIcon from '@mui/icons-material/Class'
import SchoolIcon from '@mui/icons-material/School'
import PeopleIcon from '@mui/icons-material/People'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import BookIcon from '@mui/icons-material/Book'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

const statsConfig = [
    { label: 'Sinflar',       value: 0, Icon: ClassIcon,       color: '#7E56D8', bg: '#ede8fb', darkBg: '#2a1f4a' },
    { label: 'Fanlar',        value: 0, Icon: BookIcon,         color: '#2196f3', bg: '#e3f2fd', darkBg: '#1a2d4a' },
    { label: 'Talabalar',     value: 1, Icon: SchoolIcon,       color: '#009688', bg: '#e0f7f4', darkBg: '#1a3835' },
    { label: "Sovg'alar",     value: 3, Icon: CardGiftcardIcon, color: '#f59e0b', bg: '#fff8e1', darkBg: '#3a2e1a' },
    { label: "O'qituvchilar", value: 0, Icon: PeopleIcon,       color: '#e91e63', bg: '#fce4ec', darkBg: '#3a1a2a' },
]

export default function Main() {
    const dark = useContext(ThemeContext)
    const [open, setOpen] = useState(true)

    const surface = dark ? '#1e2a3a' : '#fff'
    const text1   = dark ? '#e2e8f0' : '#1a1a2e'
    const text2   = dark ? '#94a3b8' : '#888'
    const shadow  = dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)'

    return (
        <div>
            {/* Greeting */}
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: text1 }}>
                    Salom, creator!
                </h1>
            </div>

            {/* Stat Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '16px',
                marginBottom: '28px',
            }}>
                {statsConfig.map((stat) => {
                    const Icon = stat.Icon
                    return (
                        <div
                            key={stat.label}
                            style={{
                                background: surface,
                                borderRadius: '16px',
                                padding: '22px 16px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '12px',
                                boxShadow: shadow,
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-4px)'
                                e.currentTarget.style.boxShadow = `0 8px 24px ${stat.color}28`
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = shadow
                            }}
                        >
                            <div style={{
                                width: '54px',
                                height: '54px',
                                borderRadius: '16px',
                                background: dark ? stat.darkBg : stat.bg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <Icon sx={{ color: stat.color, fontSize: 28 }} />
                            </div>
                            <p style={{ margin: 0, fontSize: '13px', color: text2, fontWeight: 500 }}>
                                {stat.label}
                            </p>
                            <span style={{ fontSize: '28px', fontWeight: 700, color: text1 }}>
                                {stat.value}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* Dars Jadvali */}
            <div style={{ background: surface, borderRadius: '16px', padding: '20px 24px', boxShadow: shadow }}>
                <div
                    onClick={() => setOpen(o => !o)}
                    style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', cursor: 'pointer', userSelect: 'none',
                    }}
                >
                    <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: text1 }}>
                        Dars Jadvali
                    </h2>
                    <KeyboardArrowDownIcon sx={{
                        color: text2,
                        transition: 'transform 0.3s',
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                    }} />
                </div>

                <div style={{
                    overflow: 'hidden',
                    maxHeight: open ? '200px' : '0',
                    transition: 'max-height 0.35s ease',
                }}>
                    <div style={{
                        marginTop: '20px', textAlign: 'center',
                        padding: '40px 0',
                        color: dark ? '#4a5568' : '#bbb',
                        fontSize: '14px',
                    }}>
                        Hozircha dars jadvali mavjud emas
                    </div>
                </div>
            </div>
        </div>
    )
}
