import CloseIcon from '@mui/icons-material/Close'

export default function MentorsCard({ teachers, open, onToggle }) {
    return (
        <div className="rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#4a90d9] cursor-pointer select-none" onClick={onToggle}>
                <span className="text-white font-semibold text-[15px]">Guruh mentorlari</span>
                <span className={`text-white/80 transition-transform duration-200 ${open ? 'rotate-0' : 'rotate-45'}`}>
                    <CloseIcon sx={{ fontSize: 18 }} />
                </span>
            </div>
            {open && (
                <div className="bg-white dark:bg-[#1e2a3a] px-5 py-5 flex flex-wrap gap-6 min-h-27.5 items-start">
                    {teachers.length === 0 ? (
                        <p className="text-[#6b7280] dark:text-[#94a3b8] text-sm m-0 w-full text-center py-4">O'qituvchi yo'q</p>
                    ) : teachers.map((t, i) => {
                        const tName = t.full_name ?? t.name ?? `Teacher ${i + 1}`
                        const tPhoto = t.photo ?? null
                        return (
                            <div key={t.id ?? i} className="flex flex-col items-center gap-2">
                                {tPhoto ? (
                                    <img
                                        src={`https://najot-edu.softwareengineer.uz/files/${tPhoto}`}
                                        alt={tName}
                                        className="w-14 h-14 rounded-full object-cover border-2 border-[#e8e8e8] dark:border-[#2d3748]"
                                        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                                    />
                                ) : null}
                                <div
                                    className="w-14 h-14 rounded-full bg-linear-to-br from-[#7E56D8] to-[#5c3fb5] flex items-center justify-center text-white text-lg font-bold"
                                    style={{ display: tPhoto ? 'none' : 'flex' }}
                                >
                                    {tName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                                <div className="text-center">
                                    <p className="m-0 text-[11px] font-semibold text-[#16a34a]">Teacher</p>
                                    <p className="m-0 text-[13px] font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">{tName.split(' ')[0]}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
