import { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

export default function PersonSelectModal({ type, people, initialSelected, onClose, onApply }) {
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState([...initialSelected])

    const title = type === 'teacher' ? "O'qituvchi qo'shish" : "Talaba qo'shish"
    const sub = type === 'teacher' ? "Bir yoki bir nechta o'qituvchini tanlang" : "Bitta yoki bir nechta talabani tanlang"
    const placeholder = type === 'teacher' ? "O'qituvchi qidirish..." : "Talaba qidirish..."

    const filtered = people.filter(p => (p.full_name ?? '').toLowerCase().includes(search.toLowerCase()))
    const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

    return (
        <>
            <div onClick={onClose} className="fixed inset-0 bg-black/40 z-299" />
            <div className="fixed inset-0 flex items-center justify-center z-300 p-4">
                <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.22)] w-full max-w-sm flex flex-col">
                    <div className="px-6 pt-5 pb-4 border-b border-[#e8e8e8] dark:border-[#2d3748]">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="m-0 text-base font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">{title}</h3>
                                <p className="mt-0.5 mb-0 text-[12px] text-[#6b7280] dark:text-[#94a3b8]">{sub}</p>
                            </div>
                            <button onClick={onClose} className="border-none bg-transparent cursor-pointer text-[#6b7280] dark:text-[#94a3b8] flex p-1 hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0] transition-colors">
                                <CloseIcon sx={{ fontSize: 20 }} />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 mt-3 bg-[#f5f5f5] dark:bg-[#0f1827] border border-[#e8e8e8] dark:border-[#2d3748] rounded-lg px-3 py-1.75">
                            <SearchIcon sx={{ color: '#94a3b8', fontSize: 17 }} />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder={placeholder}
                                className="border-none outline-none bg-transparent text-[13px] text-[#1a1a2e] dark:text-[#e2e8f0] w-full"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="px-6 py-3 flex flex-col gap-0.5 max-h-56 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <p className="text-center text-[13px] text-[#6b7280] dark:text-[#94a3b8] py-4">Hech narsa topilmadi</p>
                        ) : filtered.map(item => (
                            <label key={item.id} className="flex items-center gap-3 px-2 py-2.5 rounded-lg cursor-pointer hover:bg-[#f5f0ff] dark:hover:bg-[#2a1f4a] transition-colors duration-150">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(item.id)}
                                    onChange={() => toggle(item.id)}
                                    className="w-4 h-4 accent-[#7E56D8] cursor-pointer shrink-0"
                                />
                                <span className="text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0]">{item.full_name}</span>
                            </label>
                        ))}
                    </div>
                    <div className="px-6 py-4 border-t border-[#e8e8e8] dark:border-[#2d3748] flex justify-end gap-2.5">
                        <button onClick={onClose} className="px-5 py-2 rounded-[10px] text-sm font-medium border border-[#e8e8e8] dark:border-[#2d3748] bg-transparent text-[#1a1a2e] dark:text-[#e2e8f0] cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors duration-200">
                            Bekor qilish
                        </button>
                        <button onClick={() => onApply(selected)} className="px-5 py-2 rounded-[10px] text-sm font-semibold border-none bg-[#7E56D8] hover:bg-[#6a44c0] text-white cursor-pointer transition-colors duration-200">
                            Saqlash
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
