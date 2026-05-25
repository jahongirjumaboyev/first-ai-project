export default function Toast({ message, type }) {
    return (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-9999 flex items-center gap-2.5 px-4 sm:px-7 py-3 sm:py-3.5 rounded-[10px] text-[13px] sm:text-[15px] font-semibold text-white w-[calc(100vw-32px)] sm:w-auto text-center justify-center shadow-[0_6px_24px_rgba(0,0,0,0.25)] ${type === 'success' ? 'bg-[#1F2D5C]' : 'bg-[#c0392b]'}`}>
            {message}
        </div>
    )
}
