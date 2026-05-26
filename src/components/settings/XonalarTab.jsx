import { useState } from 'react'
import { apiDel } from '../../api'
import Toast from '../ui/Toast'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import RefreshIcon from '@mui/icons-material/Refresh'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

const addBtn = 'flex items-center gap-1.5 bg-[#7E56D8] hover:bg-[#6a44c0] text-white border-none rounded-[10px] px-4.5 py-2.5 text-[13px] font-semibold cursor-pointer transition-colors duration-200'

export default function XonalarTab({ onAddClick, rooms, loading, onRefresh, onEditClick }) {
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
            await apiDel(`/rooms/${deleteTarget.id}`)
            showToast("✅ Xona o'chirildi", 'success')
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
                            Xonani o'chirish
                        </h3>
                        <p className="m-0 text-center text-[13px] text-[#6b7280] dark:text-[#94a3b8] leading-relaxed mb-6">
                            Rostdan ham o'chirishni hohlaysizmi?
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

            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Xonalar</span>
                    <RefreshIcon onClick={onRefresh} sx={{ fontSize: 18, cursor: 'pointer', color: '#94a3b8' }} />
                </div>
                <button onClick={onAddClick} className={addBtn}>
                    <AddIcon sx={{ fontSize: 17 }} /> Xonani qo'shish
                </button>
            </div>

            {/* ── Content ── */}
            {loading ? (
                <p className="text-center py-12 text-[13px] text-[#94a3b8]">Yuklanmoqda...</p>
            ) : rooms.length === 0 ? (
                <p className="text-center py-12 text-[13px] text-[#94a3b8]">Hech qanday xona topilmadi</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
                    {rooms.map(room => (
                        <div
                            key={room.id ?? room.name}
                            className="bg-white dark:bg-[#1e2a3a] rounded-[14px] p-4.5 border border-[#e5e7eb] dark:border-[#2d3748] flex flex-col gap-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_20px_rgba(126,86,216,0.15)] transition-shadow duration-200"
                        >
                            <div className="w-10.5 h-10.5 rounded-xl bg-[#ede8fb] dark:bg-[#2a1f4a] flex items-center justify-center">
                                <MeetingRoomIcon sx={{ color: '#7E56D8', fontSize: 22 }} />
                            </div>
                            <div>
                                <p className="m-0 font-semibold text-sm text-[#1a1a2e] dark:text-[#e2e8f0]">{room.name}</p>
                                <p className="m-0 mt-0.5 text-xs text-[#888] dark:text-[#94a3b8]">Sig'imi: {room.capacity}</p>
                            </div>
                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => setDeleteTarget(room)}
                                    className="flex-1 flex items-center justify-center py-1.5 rounded-lg border border-[#e5e7eb] dark:border-[#2d3748] bg-transparent text-[#e53935] cursor-pointer hover:bg-[#fce4ec] dark:hover:bg-[#3b1020] transition-colors duration-150"
                                >
                                    <DeleteIcon sx={{ fontSize: 15 }} />
                                </button>
                                <button
                                    onClick={() => onEditClick?.(room)}
                                    className="flex-1 flex items-center justify-center py-1.5 rounded-lg border border-[#e5e7eb] dark:border-[#2d3748] bg-transparent text-[#7E56D8] cursor-pointer hover:bg-[#ede8fb] dark:hover:bg-[#2a1f4a] transition-colors duration-150"
                                >
                                    <EditIcon sx={{ fontSize: 15 }} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
