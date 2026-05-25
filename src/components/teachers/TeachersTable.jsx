import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import ShareIcon from '@mui/icons-material/Share'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import EditIcon from '@mui/icons-material/Edit'

const iconBtn = 'border-none bg-transparent cursor-pointer p-[3px] flex items-center rounded transition-opacity duration-150 hover:opacity-70'

export default function TeachersTable({ paginated, selected, allSelected, someSelected, onToggleAll, onToggleOne }) {
    return (
        <>
            {someSelected && (
                <div className="flex gap-2.5 px-5 py-2.5 border-b border-[#e8e8e8] dark:border-[#2d3748] bg-[#f5f0ff] dark:bg-[#1a2d42]">
                    <button className="flex items-center gap-1.5 bg-transparent border border-[#e8e8e8] dark:border-[#2d3748] text-[#6b7280] dark:text-[#94a3b8] rounded-lg px-3.5 py-1.5 text-[13px] cursor-pointer">
                        <ShareIcon sx={{ fontSize: 16 }} /> Export
                    </button>
                    <button className="flex items-center gap-1.5 bg-transparent border border-[#f44336] text-[#f44336] rounded-lg px-3.5 py-1.5 text-[13px] cursor-pointer">
                        <DeleteIcon sx={{ fontSize: 16 }} /> Delete
                    </button>
                </div>
            )}
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
                            <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium">Tug'ilgan sanasi</th>
                            <th className="px-4 py-3 text-left text-[#6b7280] dark:text-[#94a3b8] font-medium">Yaratilgan sana</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr><td colSpan={7} className="px-4 py-10 text-center text-[#6b7280] dark:text-[#94a3b8]">Hech narsa topilmadi</td></tr>
                        ) : paginated.map((t) => {
                            const isSel = selected.includes(t.id)
                            return (
                                <tr
                                    key={t.id}
                                    className={`border-b border-[#e8e8e8] dark:border-[#2d3748] transition-colors duration-150 ${isSel ? 'bg-[#f5f0ff] dark:bg-[#1a2d42]' : 'hover:bg-[#faf8ff] dark:hover:bg-[#172033]'}`}
                                >
                                    <td className="px-4 py-3">
                                        <input type="checkbox" checked={isSel} onChange={() => onToggleOne(t.id)} className="cursor-pointer w-4 h-4 accent-[#7E56D8]" />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8.5 h-8.5 rounded-full bg-linear-to-br from-[#7E56D8] to-[#5c3fb5] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                                                {t.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">{t.name}</div>
                                                <div className="flex gap-1 mt-1 flex-wrap">
                                                    {t.labels.map((lbl, i) => (
                                                        <span key={i} className="bg-[#f0f0f0] dark:bg-[#2d3748] text-[#6b7280] dark:text-[#94a3b8] rounded px-[7px] py-px text-[11px] font-medium">{lbl}</span>
                                                    ))}
                                                    {t.extra > 0 && <span className="bg-[#ede8fb] dark:bg-[#2a1f4a] text-[#7E56D8] rounded px-[7px] py-px text-[11px] font-semibold">+{t.extra}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-[#6b7280] dark:text-[#94a3b8]">—</td>
                                    <td className="px-4 py-3 text-[#1a1a2e] dark:text-[#e2e8f0]">{t.phone}</td>
                                    <td className="px-4 py-3 text-[#6b7280] dark:text-[#94a3b8]">{t.birth}</td>
                                    <td className="px-4 py-3 text-[#6b7280] dark:text-[#94a3b8]">{t.created}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-0.5">
                                            <button className={`${iconBtn} text-[#6b7280] dark:text-[#94a3b8]`}><VisibilityIcon sx={{ fontSize: 18 }} /></button>
                                            <button className={`${iconBtn} text-[#6b7280] dark:text-[#94a3b8]`}><FileDownloadIcon sx={{ fontSize: 18 }} /></button>
                                            <button className={`${iconBtn} text-[#ef4444]`}><DeleteIcon sx={{ fontSize: 18 }} /></button>
                                            <button className={`${iconBtn} text-[#6b7280] dark:text-[#94a3b8]`}><EditIcon sx={{ fontSize: 18 }} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}
