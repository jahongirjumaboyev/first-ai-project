import RefreshIcon from '@mui/icons-material/Refresh'
import MoreVertIcon from '@mui/icons-material/MoreVert'

export default function GroupsTable({ groups, onNavigate, onToggleActive }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-[13px]">
                <thead>
                    <tr className="bg-[#f9f8ff] dark:bg-[#162032]">
                        <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium whitespace-nowrap">Status</th>
                        <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium whitespace-nowrap">Guruh nomi</th>
                        <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium whitespace-nowrap">Kurs</th>
                        <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium whitespace-nowrap">Davomiyligi</th>
                        <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium whitespace-nowrap">Dars vaqti</th>
                        <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium whitespace-nowrap">Xona</th>
                        <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium whitespace-nowrap">O'qituvchi</th>
                        <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium whitespace-nowrap">Talabalar</th>
                        <th className="px-4 py-3 w-10">
                            <RefreshIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {groups.length === 0 ? (
                        <tr>
                            <td colSpan={9} className="px-4 py-10 text-center text-[#6b7280] dark:text-[#94a3b8]">Hech narsa topilmadi</td>
                        </tr>
                    ) : groups.map(g => (
                        <tr key={g.id} className="border-b border-[#e8e8e8] dark:border-[#2d3748] hover:bg-[#faf8ff] dark:hover:bg-[#172033] transition-colors duration-150">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onToggleActive(g.id)}
                                        className={`relative w-9 h-5 rounded-full border-none cursor-pointer transition-colors duration-200 shrink-0 ${g.active ? 'bg-[#7E56D8]' : 'bg-[#d1d5db] dark:bg-[#4a5568]'}`}
                                    >
                                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${g.active ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </button>
                                    <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${g.active ? 'text-[#16a34a] bg-[#dcfce7] dark:bg-[#166534]/40' : 'text-[#6b7280] bg-[#f3f4f6] dark:bg-[#374151]'}`}>
                                        {g.active ? 'FAOL' : 'NOFAOL'}
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-3 font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">
                                <button onClick={() => onNavigate(g.id, g)} className="border-none bg-transparent cursor-pointer p-0 font-semibold text-[#1a1a2e] dark:text-[#e2e8f0] hover:text-[#7E56D8] dark:hover:text-[#7E56D8] transition-colors duration-150 text-[13px]">
                                    {g.name}
                                </button>
                            </td>
                            <td className="px-4 py-3">
                                <span className="text-[#7E56D8] bg-[#ede8fb] dark:bg-[#2a1f4a] px-2.5 py-0.5 rounded-md text-[12px] font-medium whitespace-nowrap">{g.course?.name ?? g.course ?? '—'}</span>
                            </td>
                            <td className="px-4 py-3 text-[#6b7280] dark:text-[#94a3b8]">{g.course?.duration_month ? `${g.course.duration_month} oy` : '—'}</td>
                            <td className="px-4 py-3">
                                <div className="font-medium text-[#1a1a2e] dark:text-[#e2e8f0]">{g.start_time ?? '—'}</div>
                                <div className="text-[12px] text-[#6b7280] dark:text-[#94a3b8]">{Array.isArray(g.week_day) ? g.week_day.join(', ') : (g.week_day ?? '—')}</div>
                            </td>
                            <td className="px-4 py-3 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">{g.room?.name ?? g.room ?? '—'}</td>
                            <td className="px-4 py-3 text-[#1a1a2e] dark:text-[#e2e8f0] whitespace-nowrap">{Array.isArray(g.teachers) ? g.teachers.length : '—'}</td>
                            <td className="px-4 py-3 text-[#1a1a2e] dark:text-[#e2e8f0] font-medium">{Array.isArray(g.students) ? g.students.length : (g.max_student ?? '—')}</td>
                            <td className="px-4 py-3">
                                <button className="border-none bg-transparent cursor-pointer text-[#94a3b8] hover:text-[#555] dark:hover:text-[#e2e8f0] flex p-1 rounded transition-colors">
                                    <MoreVertIcon sx={{ fontSize: 18 }} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
