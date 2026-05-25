import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

export default function Pagination({ page, totalPages, onPageChange }) {
    const pages = totalPages <= 6 ? Array.from({ length: totalPages }, (_, i) => i + 1) : null

    return (
        <div className="flex justify-between items-center px-5 py-3.5 border-t border-[#e8e8e8] dark:border-[#2d3748]">
            <button
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`flex items-center gap-1 bg-transparent border border-[#e8e8e8] dark:border-[#2d3748] rounded-lg px-3.5 py-1.5 text-[13px] ${page === 1 ? 'opacity-50 cursor-not-allowed text-[#6b7280]' : 'cursor-pointer text-[#1a1a2e] dark:text-[#e2e8f0] hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748]'} transition-colors duration-200`}
            >
                <NavigateBeforeIcon sx={{ fontSize: 18 }} /> Previous
            </button>
            <div className="flex gap-1 items-center">
                {(pages || [1, 2, 3]).map(p => (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`w-8.5 h-8.5 rounded-lg border-none text-[13px] cursor-pointer font-medium transition-colors duration-200 ${page === p ? 'bg-[#7E56D8] text-white font-semibold' : 'bg-transparent text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748]'}`}
                    >{p}</button>
                ))}
                {!pages && (
                    <>
                        <span className="text-[#6b7280] px-0.5">...</span>
                        {[totalPages - 2, totalPages - 1, totalPages].map(p => (
                            <button
                                key={p}
                                onClick={() => onPageChange(p)}
                                className={`w-8.5 h-8.5 rounded-lg border-none text-[13px] cursor-pointer transition-colors duration-200 ${page === p ? 'bg-[#7E56D8] text-white font-semibold' : 'bg-transparent text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748]'}`}
                            >{p}</button>
                        ))}
                    </>
                )}
            </div>
            <button
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`flex items-center gap-1 bg-transparent border border-[#e8e8e8] dark:border-[#2d3748] rounded-lg px-3.5 py-1.5 text-[13px] ${page === totalPages ? 'opacity-50 cursor-not-allowed text-[#6b7280]' : 'cursor-pointer text-[#1a1a2e] dark:text-[#e2e8f0] hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748]'} transition-colors duration-200`}
            >
                Next <NavigateNextIcon sx={{ fontSize: 18 }} />
            </button>
        </div>
    )
}
