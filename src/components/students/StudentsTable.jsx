import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'

const iconBtn = 'border-none bg-transparent cursor-pointer p-[3px] flex items-center rounded transition-opacity duration-150 hover:opacity-70'

export default function StudentsTable({ paginated, selected, allSelected, onToggleAll, onToggleOne, onDelete, onEdit }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-[13px]">
                <thead>
                    <tr className="bg-[#f9f8ff] dark:bg-[#162032]">
                        <th className="px-4 py-3 w-11">
                            <input type="checkbox" checked={allSelected} onChange={onToggleAll} className="cursor-pointer w-4 h-4 accent-[#7E56D8]" />
                        </th>
                        <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium">
                            <div className="flex items-center gap-1">Nomi <UnfoldMoreIcon sx={{ fontSize: 16 }} /></div>
                        </th>
                        <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium">Guruh</th>
                        <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium">Telefon raqamlari</th>
                        <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium">Email</th>
                        <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium">Tug'ilgan sanasi</th>
                        <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium">Manzil</th>
                        <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium">Yaratilgan sana</th>
                        <th className="px-4 py-3" />
                    </tr>
                </thead>
                <tbody>
                    {paginated.length === 0 ? (
                        <tr><td colSpan={9} className="px-4 py-10 text-center text-[#6b7280] dark:text-[#94a3b8]">Hech narsa topilmadi</td></tr>
                    ) : paginated.map((s) => {
                        const isSel = selected.includes(s.id)
                        return (
                            <tr
                                key={s.id}
                                className={`border-b border-[#e8e8e8] dark:border-[#2d3748] transition-colors duration-150 ${isSel ? 'bg-[#f5f0ff] dark:bg-[#1a2d42]' : 'hover:bg-[#faf8ff] dark:hover:bg-[#172033]'}`}
                            >
                                <td className="px-4 py-3">
                                    <input type="checkbox" checked={isSel} onChange={() => onToggleOne(s.id)} className="cursor-pointer w-4 h-4 accent-[#7E56D8]" />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8.5 h-8.5 rounded-full bg-[#d1d5db] dark:bg-[#4a5568] flex items-center justify-center text-[#6b7280] dark:text-[#94a3b8] text-[11px] font-bold shrink-0">
                                            {s.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                                        </div>
                                        <span className="font-semibold text-[#1a1a2e] dark:text-[#e2e8f0] whitespace-nowrap">{s.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1 flex-wrap">
                                        {s.groups.map((g, i) => (
                                            <span key={i} className="bg-[#f0f0f0] dark:bg-[#2d3748] text-[#555] dark:text-[#94a3b8] rounded-md px-2 py-0.5 text-[11px] font-medium whitespace-nowrap">{g}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-[#1a1a2e] dark:text-[#e2e8f0] whitespace-nowrap">{s.phone}</td>
                                <td className="px-4 py-3 text-[#6b7280] dark:text-[#94a3b8]">{s.email}</td>
                                <td className="px-4 py-3 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">{s.birth}</td>
                                <td className="px-4 py-3 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">{s.address}</td>
                                <td className="px-4 py-3 text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">{s.created}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-0.5">
                                        <button className={`${iconBtn} text-[#6b7280] dark:text-[#94a3b8]`}><VisibilityIcon sx={{ fontSize: 18 }} /></button>
                                        <button onClick={() => onDelete(s.id)} className={`${iconBtn} text-[#ef4444]`}><DeleteIcon sx={{ fontSize: 18 }} /></button>
                                        <button onClick={() => onEdit(s)} className={`${iconBtn} text-[#6b7280] dark:text-[#94a3b8]`}><EditIcon sx={{ fontSize: 18 }} /></button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
