import { useState } from 'react'
import ClassIcon from '@mui/icons-material/Class'
import SchoolIcon from '@mui/icons-material/School'
import PeopleIcon from '@mui/icons-material/People'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import BookIcon from '@mui/icons-material/Book'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

const statsConfig = [
    { label: 'Sinflar',       value: 0, Icon: ClassIcon,       color: '#7E56D8', bg: '#ede8fb' },
    { label: 'Fanlar',        value: 0, Icon: BookIcon,         color: '#2196f3', bg: '#e3f2fd' },
    { label: 'Talabalar',     value: 1, Icon: SchoolIcon,       color: '#009688', bg: '#e0f7f4' },
    { label: "Sovg'alar",     value: 3, Icon: CardGiftcardIcon, color: '#f59e0b', bg: '#fff8e1' },
    { label: "O'qituvchilar", value: 0, Icon: PeopleIcon,       color: '#e91e63', bg: '#fce4ec' },
]

export default function Main() {
    const [open, setOpen] = useState(true)

    return (
        <div>
            <div className="mb-7">
                <h1 className="m-0 text-2xl font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">
                    Salom, creator!
                </h1>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-7">
                {statsConfig.map((stat) => {
                    const Icon = stat.Icon
                    return (
                        <div
                            key={stat.label}
                            className="bg-white dark:bg-[#1e2a3a] rounded-2xl py-[22px] px-4 flex flex-col items-center gap-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-all duration-200 cursor-pointer hover:-translate-y-1"
                            onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 24px ${stat.color}28`}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
                        >
                            <div
                                className="w-[54px] h-[54px] rounded-2xl flex items-center justify-center shrink-0"
                                style={{ background: stat.bg }}
                            >
                                <Icon sx={{ color: stat.color, fontSize: 28 }} />
                            </div>
                            <p className="m-0 text-[13px] text-[#888] dark:text-[#94a3b8] font-medium">
                                {stat.label}
                            </p>
                            <span className="text-[28px] font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">
                                {stat.value}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* Dars Jadvali accordion */}
            <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl px-6 py-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
                <div
                    onClick={() => setOpen(o => !o)}
                    className="flex justify-between items-center cursor-pointer select-none"
                >
                    <h2 className="m-0 text-base font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">
                        Dars Jadvali
                    </h2>
                    <KeyboardArrowDownIcon sx={{
                        color: '#888',
                        transition: 'transform 0.3s',
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                    }} />
                </div>

                <div
                    className="overflow-hidden transition-all duration-[350ms] ease-in-out"
                    style={{ maxHeight: open ? '200px' : '0' }}
                >
                    <div className="mt-5 text-center py-10 text-[#bbb] dark:text-[#4a5568] text-sm">
                        Hozircha dars jadvali mavjud emas
                    </div>
                </div>
            </div>
        </div>
    )
}
