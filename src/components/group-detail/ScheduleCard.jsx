import { useState } from 'react'

const monthUz = {
    January: 'Yan', February: 'Fev', March: 'Mar', April: 'Apr',
    May: 'May', June: 'Iyun', July: 'Iyul', August: 'Avg',
    September: 'Sen', October: 'Okt', November: 'Noy', December: 'Dek',
}
const monthNum = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
}

const SHOW_INIT = 2

export default function ScheduleCard({ teachers, daysLabel, timeLabel, dateRange, roomName, schedules, onDateClick }) {
    const [showAll, setShowAll] = useState(false)
    const [showAllMonths, setShowAllMonths] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)

    const today = new Date()
    const isPast = (d) => {
        const mIdx = monthNum[d.month] ?? 0
        return new Date(today.getFullYear(), mIdx, d.day) < today
    }

    const monthKeys = schedules ? Object.keys(schedules).sort((a, b) => Number(a) - Number(b)) : []
    const visibleTeachers = showAll ? teachers : teachers.slice(0, SHOW_INIT)
    const hiddenCount = teachers.length - SHOW_INIT

    return (
        <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e8e8e8] dark:border-[#2d3748]">
                <h3 className="m-0 text-[15px] font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Dars jadvali</h3>
            </div>

            <div className="divide-y divide-[#e8e8e8] dark:divide-[#2d3748]">
                {teachers.length === 0 ? (
                    <p className="px-5 py-6 text-center text-sm text-[#6b7280] dark:text-[#94a3b8] m-0">Jadval mavjud emas</p>
                ) : visibleTeachers.map((t, i) => {
                    const tName = t.full_name ?? t.name ?? `Teacher ${i + 1}`
                    return (
                        <div key={t.id ?? i} className="px-5 py-4">
                            <div className="bg-white dark:bg-[#12202a] rounded-lg shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-[#3b82f6] font-semibold cursor-pointer hover:underline text-[14px]">{tName}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                                    <span className="whitespace-nowrap">{daysLabel || '—'}</span>
                                    <span className="font-medium text-[#1a1a2e] dark:text-[#e2e8f0] whitespace-nowrap">{timeLabel}</span>
                                    <span className="whitespace-nowrap">{dateRange}</span>
                                    <span className="whitespace-nowrap">{roomName}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {hiddenCount > 0 && (
                <div className="px-5 py-3 border-t border-[#e8e8e8] dark:border-[#2d3748] flex justify-center">
                    <button
                        onClick={() => setShowAll(s => !s)}
                        className="border border-[#e8e8e8] dark:border-[#2d3748] bg-transparent text-[#1a1a2e] dark:text-[#e2e8f0] rounded-lg px-5 py-2 text-[13px] cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors"
                    >
                        {showAll ? "Yig'ish" : `Yana ko'rsatish (${hiddenCount})`}
                    </button>
                </div>
            )}

            <div className="px-5 py-4 border-t border-[#e8e8e8] dark:border-[#2d3748]">
                {monthKeys.some(k => (schedules?.[k]?.days ?? []).length > 0) ? (
                    <div className="flex flex-col gap-6">
                        {(showAllMonths ? monthKeys : monthKeys.slice(0, 2)).map(k => {
                            const mDays = schedules?.[k]?.days ?? []
                            if (!mDays.length) return null
                            return (
                                <div key={k}>
                                    <p className="m-0 mb-3 text-[13px] font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">{k}-o'quv oyi</p>
                                    <div className="flex flex-wrap gap-2">
                                        {mDays.map((d, i) => {
                                            const past = d.isCompleted || isPast(d)
                                            const isSelected = selectedDate && selectedDate.day === d.day && selectedDate.month === d.month
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => onDateClick ? onDateClick(d) : setSelectedDate(d)}
                                                    className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg border transition-all cursor-pointer ${past ? 'bg-[#dfe4ef] dark:bg-[#4a5568] border-[#c5cfe0] dark:border-[#5a6b7c] text-[#5b6b8c] dark:text-[#a0afc4]' : (isSelected ? 'bg-[#5b7cfa] dark:bg-[#3b5bda] border-[#4a63d9] dark:border-[#2a4bc9] text-white' : 'bg-white dark:bg-[#0f1724] border-[#d1d5db] dark:border-[#374151] text-[#1a1a2e] dark:text-[#e2e8f0] hover:border-[#9ca3af] dark:hover:border-[#4b5563]')}`}
                                                >
                                                    <span className="text-[10px] font-medium">{monthUz[d.month] ?? d.month}</span>
                                                    <span className="font-bold text-[14px]">{d.day}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}

                        {monthKeys.length > 2 && (
                            <div className="flex justify-center pt-2">
                                <button
                                    onClick={() => setShowAllMonths(s => !s)}
                                    className="text-[13px] font-medium text-[#4a90d9] hover:text-[#2563eb] bg-transparent border-none cursor-pointer"
                                >
                                    {showAllMonths ? "Yig'ish" : "Barchasini ko'rish"}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-center text-sm text-[#6b7280] dark:text-[#94a3b8] m-0 py-4">Dars jadvali mavjud emas</p>
                )}
            </div>
        </div>
    )
}
