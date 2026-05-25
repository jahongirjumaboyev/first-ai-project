import CloseIcon from '@mui/icons-material/Close'

export default function ParametersCard({ courseName, avgAge, roomCapacity, studentCount, duration, open, onToggle }) {
    const rows = [
        ['Kurs',                      courseName],
        ["O'rta yosh",                avgAge],
        ["O'quvchilar sig'imi",        roomCapacity],
        ["Mavjud o'quvchilar",         studentCount],
        ["O'quv oyidagi darslar soni", '—'],
        ['Kurs davomiyligi (oy)',       duration || '—'],
        ['Jami darslar soni',          '—'],
    ]

    return (
        <div className="rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#4a90d9] cursor-pointer select-none" onClick={onToggle}>
                <span className="text-white font-semibold text-[15px]">Parametrlar</span>
                <span className={`text-white/80 transition-transform duration-200 ${open ? 'rotate-0' : 'rotate-45'}`}>
                    <CloseIcon sx={{ fontSize: 18 }} />
                </span>
            </div>
            {open && (
                <div className="bg-white dark:bg-[#1e2a3a] divide-y divide-[#e8e8e8] dark:divide-[#2d3748]">
                    {rows.map(([label, value]) => (
                        <div key={label} className="flex justify-between items-center px-5 py-2.5">
                            <span className="text-[13px] text-[#6b7280] dark:text-[#94a3b8]">{label}</span>
                            <span className="text-[13px] font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">{value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
