import { useState, useRef } from 'react'
import { apiPost } from '../../api'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import Toast from '../ui/Toast'

const initForm = {
    phone: '+998', email: '', name: '', address: '',
    groups: [], groupInput: '',
    gender: '', showPassword: false, password: '', file: null,
}

const inputCls = 'w-full border border-[#e8e8e8] dark:border-[#2d3748] rounded-[10px] px-3.5 py-2.5 text-sm bg-white dark:bg-[#0f1827] text-[#1a1a2e] dark:text-[#e2e8f0] outline-none'

export default function TeacherDrawer({ open, onClose, onSaved }) {
    const [form, setForm] = useState(initForm)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState(null)
    const fileRef = useRef(null)

    const upd = (key, val) => setForm(prev => ({ ...prev, [key]: val }))
    const addGroup = () => {
        const v = form.groupInput.trim()
        if (v) { upd('groups', [...form.groups, v]); upd('groupInput', '') }
    }
    const removeGroup = (i) => upd('groups', form.groups.filter((_, idx) => idx !== i))
    const closeDrawer = () => { setForm(initForm); onClose() }

    function showToast(message, type) {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const saveTeacher = async () => {
        if (!form.name || !form.phone || !form.email || !form.password) {
            showToast("⚠️ Ism, telefon, email va parol majburiy!", 'error')
            return
        }
        setSaving(true)
        try {
            await apiPost('/teachers', {
                full_name: form.name,
                email:     form.email,
                password:  form.password,
                phone:     form.phone,
                address:   form.address,
            })
            showToast("✅ O'qituvchi muvaffaqiyatli qo'shildi!", 'success')
            await onSaved()
            setTimeout(() => closeDrawer(), 1200)
        } catch (err) {
            showToast(`⚠️ ${err.message}`, 'error')
        } finally {
            setSaving(false)
        }
    }

    const labelEl = (text) => <p className="m-0 mb-1.5 text-[13px] font-medium text-[#1a1a2e] dark:text-[#e2e8f0]">{text}</p>

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} />}

            <div
                onClick={closeDrawer}
                className={`fixed inset-0 bg-black/45 z-[200] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            />

            <div className={`fixed top-0 right-0 bottom-0 w-full sm:w-88 bg-white dark:bg-[#1e2a3a] z-201 flex flex-col shadow-[-6px_0_32px_rgba(0,0,0,0.18)] transition-transform duration-350 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>

                <div className="px-6 pt-[22px] pb-4 border-b border-[#e8e8e8] dark:border-[#2d3748] shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="m-0 text-lg font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">O'qituvchi qo'shish</h2>
                            <p className="mt-1 mb-0 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">Bu yerda siz yangi o'qituvchi qo'shishingiz mumkin.</p>
                        </div>
                        <button onClick={closeDrawer} className="border-none bg-transparent cursor-pointer text-[#6b7280] dark:text-[#94a3b8] flex p-1 mt-0.5 hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0] transition-colors">
                            <CloseIcon sx={{ fontSize: 20 }} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-[18px]">

                    <div>
                        {labelEl('Telefon raqam')}
                        <input value={form.phone} onChange={e => upd('phone', e.target.value)} className={inputCls} placeholder="+998" />
                    </div>

                    <div>
                        {labelEl('Mail')}
                        <div className="relative">
                            <EmailOutlinedIcon sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#94a3b8' }} />
                            <input value={form.email} onChange={e => upd('email', e.target.value)} placeholder="Elektron pochtani kiriting" className={`${inputCls} pl-10`} />
                        </div>
                    </div>

                    <div>
                        {labelEl("O'qituvchi FIO")}
                        <input value={form.name} onChange={e => upd('name', e.target.value)} placeholder="Ma'lumotni kiriting" className={inputCls} />
                    </div>

                    <div>
                        {labelEl('Manzil')}
                        <input value={form.address} onChange={e => upd('address', e.target.value)} placeholder="Shahar yoki viloyat" className={inputCls} />
                    </div>

                    <div>
                        {labelEl('Guruh')}
                        {form.groups.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {form.groups.map((g, i) => (
                                    <span key={i} className="flex items-center gap-1 bg-[#ede8fb] dark:bg-[#2a1f4a] text-[#7E56D8] rounded-lg px-2.5 py-1 text-[13px] font-medium">
                                        {g}
                                        <button onClick={() => removeGroup(i)} className="border-none bg-transparent cursor-pointer text-[#7E56D8] flex p-0 leading-none hover:text-[#e53935] transition-colors duration-150">
                                            <CloseIcon sx={{ fontSize: 14 }} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="flex gap-2">
                            <input
                                value={form.groupInput}
                                onChange={e => upd('groupInput', e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addGroup() } }}
                                placeholder="Guruh nomini kiriting..."
                                className={`${inputCls} flex-1`}
                            />
                            <button
                                onClick={addGroup}
                                className="flex items-center gap-1 bg-[#7E56D8] hover:bg-[#6a44c0] text-white border-none rounded-[10px] px-4 py-2.5 text-[13px] font-semibold cursor-pointer transition-colors duration-200 shrink-0"
                            >
                                <AddIcon sx={{ fontSize: 16 }} /> Qo'shish
                            </button>
                        </div>
                    </div>

                    <div>
                        {labelEl('Jinsi')}
                        <div className="flex gap-6">
                            {['Erkak', 'Ayol'].map(g => (
                                <label key={g} className="flex items-center gap-2 cursor-pointer text-sm text-[#1a1a2e] dark:text-[#e2e8f0]">
                                    <input
                                        type="radio" name="gender" value={g}
                                        checked={form.gender === g}
                                        onChange={() => upd('gender', g)}
                                        className="accent-[#7E56D8] w-4 h-4 cursor-pointer"
                                    />
                                    {g}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        {labelEl('Surati')}
                        <div
                            onClick={() => fileRef.current.click()}
                            className="border-2 border-dashed border-[#e8e8e8] dark:border-[#2d3748] hover:border-[#7E56D8] rounded-xl px-4 py-7 text-center cursor-pointer transition-colors duration-200"
                        >
                            <CloudUploadOutlinedIcon sx={{ fontSize: 36, color: '#7E56D8' }} />
                            <p className="mt-2 mb-1 text-[13px] text-[#1a1a2e] dark:text-[#e2e8f0]">
                                <span className="text-[#7E56D8] font-semibold">Click to upload</span>{' '}or drag and drop
                            </p>
                            <p className="m-0 text-xs text-[#6b7280] dark:text-[#94a3b8]">
                                {form.file ? form.file.name : 'JPG or PNG (max. 800x800px)'}
                            </p>
                            <input ref={fileRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={e => upd('file', e.target.files[0] || null)} />
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={() => upd('showPassword', !form.showPassword)}
                            className="border-none bg-transparent text-[#7E56D8] text-sm font-semibold cursor-pointer p-0 flex items-center gap-1"
                        >
                            <AddIcon sx={{ fontSize: 18 }} /> Parol qo'shish
                        </button>
                        {form.showPassword && (
                            <input
                                value={form.password}
                                onChange={e => upd('password', e.target.value)}
                                type="password"
                                placeholder="Parolni kiriting"
                                className={`${inputCls} mt-2.5`}
                            />
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-[#e8e8e8] dark:border-[#2d3748] flex justify-end gap-2.5 shrink-0">
                    <button onClick={closeDrawer} className="px-5.5 py-2.5 rounded-[10px] text-sm font-medium border border-[#e8e8e8] dark:border-[#2d3748] bg-transparent text-[#1a1a2e] dark:text-[#e2e8f0] cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2d3748] transition-colors duration-200">
                        Bekor qilish
                    </button>
                    <button
                        onClick={saveTeacher}
                        disabled={saving}
                        className={`px-5.5 py-2.5 rounded-[10px] text-sm font-semibold border-none text-white transition-colors duration-200 ${saving ? 'bg-[#a78bda] cursor-not-allowed' : 'bg-[#7E56D8] hover:bg-[#6a44c0] cursor-pointer'}`}
                    >
                        {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                </div>
            </div>
        </>
    )
}
