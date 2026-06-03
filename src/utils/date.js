// Shared date helpers (Uzbek month labels + formatting)

export const monthUz = {
    January: 'Yan', February: 'Fev', March: 'Mar', April: 'Apr',
    May: 'May', June: 'Iyun', July: 'Iyul', August: 'Avg',
    September: 'Sen', October: 'Okt', November: 'Noy', December: 'Dek',
}

// 0-based month index, suitable for `new Date(year, month, day)` math.
export const monthToNum = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
}

// ISO date string → "D MonUz, YYYY"
export function fmtDate(dateStr) {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return `${d.getDate()} ${monthUz[d.toLocaleString('en', { month: 'long' })]}, ${d.getFullYear()}`
}

// (day, English-month, year?) → "YYYY-MM-DD"
export function toISODate(day, month, year = new Date().getFullYear()) {
    const m = (monthToNum[month] ?? 0) + 1
    return `${year}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}
