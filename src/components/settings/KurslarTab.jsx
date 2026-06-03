import { useState } from 'react'
import { apiDel } from '../../api'
import Toast from '../ui/Toast'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

const addBtn = 'flex items-center gap-1.5 bg-[#7E56D8] hover:bg-[#6a44c0] text-white border-none rounded-[10px] px-4.5 py-2.5 text-[13px] font-semibold cursor-pointer transition-colors duration-200'

export default function KurslarTab({ onAddClick, courses, loading, onRefresh, onEditClick }) {
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleting, setDeleting]         = useState(false)
    const [toast, setToast]               = useState(null)

    function showToast(message, type) {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    async function handleDelete() {
        if (!deleteTarget) return
        setDeleting(true)
        try {
            await apiDel(`/courses/${deleteTarget.id}`)
            showToast("✅ Kurs o'chirildi", 'success')
            setDeleteTarget(null)
            onRefresh?.()
        } catch (err) {
            showToast(`⚠️ ${err.message}`, 'error')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} />}

            {/* ── Delete confirmation modal ── */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-6 sm:p-7 w-full max-w-[380px] animate-fadeUp">
                        <div className="w-14 h-14 rounded-full bg-[#fce4ec] dark:bg-[#3b1020] flex items-center justify-center mx-auto mb-4">
                            <WarningAmberIcon sx={{ fontSize: 28, color: '#e53935' }} />
                        </div>
                        <h3 className="m-0 text-center text-[16px] font-bold text-[#1a1a2e] dark:text-[#e2e8f0] mb-2">
                            Kursni o'chirish
                        </h3>
                        <p className="m-0 text-center text-[13px] text-[#6b7280] dark:text-[#94a3b8] leading-relaxed mb-6">
                            Kursni o'chirishni tasdiqlaysizmi?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={deleting}
                                className="flex-1 py-2.5 border border-[#e5e7eb] dark:border-[#2d3748] rounded-[10px] text-[13px] font-medium bg-transparent text-[#1a1a2e] dark:text-[#e2e8f0] cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors disabled:opacity-50"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className={`flex-1 py-2.5 border-none rounded-[10px] text-[13px] font-semibold text-white transition-colors ${deleting ? 'bg-[#f87171] cursor-not-allowed' : 'bg-[#e53935] hover:bg-[#c62828] cursor-pointer'}`}
                            >
                                {deleting ? "O'chirilmoqda..." : "O'chirish"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <span className="text-base font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Kurslar</span>
                <button onClick={onAddClick} className={addBtn}><AddIcon sx={{ fontSize: 17 }} /> Kurslar qo'shish</button>
            </div>

            {loading ? (
                <p className="text-center py-12 text-[13px] text-[#94a3b8]">Yuklanmoqda...</p>
            ) : courses.length === 0 ? (
                <p className="text-center py-12 text-[13px] text-[#94a3b8]">Hech qanday kurs topilmadi</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
                    {courses.map(course => (
                        <div
                            key={course.id}
                            className="rounded-[14px] p-4 bg-[#f5f5f5] dark:bg-[#162032] border border-[#e5e7eb] dark:border-[#2d3748] flex flex-col gap-2 hover:shadow-[0_4px_16px_rgba(126,86,216,0.13)] transition-shadow duration-200"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <span className="text-[13px] font-bold text-[#1a1a2e] dark:text-[#e2e8f0] leading-snug">{course.name}</span>
                                <div className="flex gap-1 shrink-0">
                                    <button onClick={() => setDeleteTarget(course)} className="border-none bg-transparent p-0.5 cursor-pointer text-[#aaa] hover:text-[#e53935] flex transition-colors duration-150"><DeleteIcon sx={{ fontSize: 16 }} /></button>
                                    <button onClick={() => onEditClick?.(course)} className="border-none bg-transparent p-0.5 cursor-pointer text-[#aaa] hover:text-[#7E56D8] flex transition-colors duration-150"><EditIcon sx={{ fontSize: 16 }} /></button>
                                </div>
                            </div>
                            <p className="m-0 text-xs text-[#888] dark:text-[#94a3b8] leading-relaxed line-clamp-2">{course.description}</p>
                            <div className="flex gap-1.5 flex-wrap mt-1">
                                {[
                                    course.duration_hours && `${course.duration_hours} soat`,
                                    course.duration_month && `${course.duration_month} oy`,
                                    course.price && `${Number(course.price).toLocaleString()} so'm`,
                                ].filter(Boolean).map(tag => (
                                    <span key={tag} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white dark:bg-[#0f1827] text-[#888] dark:text-[#94a3b8] border border-[#e5e7eb] dark:border-[#2d3748]">{tag}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
