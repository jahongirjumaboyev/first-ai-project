import { useState, useEffect } from 'react'
import { apiPost, apiPatch } from '../../api'
import CloseIcon from '@mui/icons-material/Close'
import Toast from '../ui/Toast'

const drawerInputCls = 'w-full border border-[#e5e7eb] dark:border-[#2d3748] rounded-[10px] px-3.5 py-2.5 text-sm bg-white dark:bg-[#111827] text-[#1a1a2e] dark:text-[#e2e8f0] outline-none focus:border-[#7E56D8] transition-colors duration-200'
const initForm = { name: '', capacity: '' }

export default function XonaDrawer({ open, onClose, onSaved, room }) {
    const isEdit = !!room

    const [visible, setVisible] = useState(false)
    const [form, setForm]       = useState(initForm)
    const [saving, setSaving]   = useState(false)
    const [toast, setToast]     = useState(null)

    useEffect(() => {
        if (open) {
            requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
            setForm(room ? { name: room.name ?? '', capacity: room.capacity ?? '' } : initForm)
        } else {
            setVisible(false)
            setForm(initForm)
        }
    }, [open, room])

    function showToast(message, type) {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    async function saveRoom() {
        if (!form.name.trim()) { showToast('⚠️ Xona nomini kiriting', 'error'); return }
        setSaving(true)
        try {
            const payload = { name: form.name.trim(), capacity: Number(form.capacity) || 0 }
            if (isEdit) {
                await apiPatch(`/rooms/${room.id}`, payload)
                showToast('✅ Xona muvaffaqiyatli tahrirlandi!', 'success')
            } else {
                await apiPost('/rooms', payload)
                showToast("✅ Xona muvaffaqiyatli qo'shildi!", 'success')
            }
            onSaved?.()
            setTimeout(() => onClose(), 1200)
        } catch (err) {
            showToast(`⚠️ ${err.message}`, 'error')
        } finally {
            setSaving(false)
        }
    }

    if (!open) return null

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} />}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/45 z-100 transition-opacity duration-280 ${visible ? 'opacity-100' : 'opacity-0'}`}
            />
            <div className={`fixed top-0 right-0 h-screen w-full sm:w-90 bg-white dark:bg-[#1e2a3a] z-101 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.18)] transition-transform duration-280 ease-in-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}>

                <div className="px-6 pt-6 pb-4 border-b border-[#e5e7eb] dark:border-[#2d3748] shrink-0 flex items-center justify-between">
                    <h2 className="m-0 text-lg font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">
                        {isEdit ? 'Xonani tahrirlash' : "Xonani qo'shish"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="border-none bg-transparent cursor-pointer text-[#6b7280] dark:text-[#94a3b8] hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0] flex p-1 transition-colors"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
                    <div>
                        <label className="block text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0] mb-1.5">
                            Nomi <span className="text-[#e53935]">*</span>
                        </label>
                        <input
                            value={form.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                            placeholder="Xona nomi"
                            className={drawerInputCls}
                        />
                    </div>
                    <div>
                        <label className="block text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0] mb-1.5">
                            Sig'imi <span className="text-[#e53935]">*</span>
                        </label>
                        <input
                            type="number"
                            value={form.capacity}
                            onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))}
                            placeholder="Masalan: 20"
                            className={drawerInputCls}
                        />
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-[#e5e7eb] dark:border-[#2d3748] flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-[10px] text-sm font-medium border border-[#e5e7eb] dark:border-[#2d3748] bg-transparent text-[#1a1a2e] dark:text-[#e2e8f0] cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors duration-200"
                    >
                        Bekor qilish
                    </button>
                    <button
                        onClick={saveRoom}
                        disabled={saving}
                        className={`px-7 py-2.5 rounded-[10px] text-sm font-semibold border-none text-white transition-colors duration-200 ${saving ? 'bg-[#a78bda] cursor-not-allowed' : 'bg-[#7E56D8] hover:bg-[#6a44c0] cursor-pointer'}`}
                    >
                        {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                </div>
            </div>
        </>
    )
}
