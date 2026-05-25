import Study from '../imgs/study.svg'
import Logo from '../imgs/logo.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiPost } from '../api'

export default function Login() {
    const navigate = useNavigate()
    const [phone, setPhone]       = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading]   = useState(false)
    const [toast, setToast]       = useState(null)

    function showToast(message, type) {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    async function Auth(e) {
        e.preventDefault()
        if (!phone || !password) {
            showToast('⚠️ Telefon yoki parol kiritilmagan!', 'error')
            return
        }
        setLoading(true)
        try {
            const data = await apiPost('/auth/login', { phone, password })
            const token = data.accessToken || data.access_token || data.token
            localStorage.setItem('token', token)
            showToast("✅ Muvaffaqiyatli kirdingiz!", 'success')
            setTimeout(() => navigate('/dashboard'), 1500)
        } catch (err) {
            setLoading(false)
            showToast(`⚠️ ${err.message}`, 'error')
        }
    }

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen">

            {toast && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-9999 flex items-center gap-2.5 px-4 sm:px-7 py-3 sm:py-3.5 rounded-[10px] text-[13px] sm:text-[15px] font-semibold text-white w-[calc(100vw-32px)] sm:w-auto text-center justify-center shadow-[0_6px_24px_rgba(0,0,0,0.25)] animate-slideDown ${toast.type === 'success' ? 'bg-[#1F2D5C]' : 'bg-[#c0392b]'}`}>
                    {toast.message}
                    {toast.type === 'success' && (
                        <span className="text-[13px] opacity-80"> — 2 soniyada yo'naltirilmoqda...</span>
                    )}
                </div>
            )}

            <div className="hidden md:flex md:w-[55%] bg-[#1F2D5C] items-center justify-center overflow-hidden">
                <img src={Study} alt="study illustration" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 md:w-[45%] flex flex-col items-center justify-center gap-4.5 bg-white relative px-4 md:px-0">
                <p className="w-full max-w-60 text-center text-xs font-medium text-[#333] leading-relaxed">
                    MUHAMMAD AL-XORAZMIY NOMIDAGI TOSHKENT AXBOROT TEXNOLOGIYALARI UNIVERSITETI
                </p>

                <img src={Logo} alt="logo" className="w-20 h-20" />

                <h2 className="text-base font-bold tracking-[1px] text-[#111] m-0">
                    LEARNING MANAGEMENT SYSTEM
                </h2>

                <form onSubmit={Auth} className="flex flex-col gap-3.5 w-full max-w-75">

                    <div className="flex flex-col gap-1">
                        <label className="text-[13px] text-[#444]">Login</label>
                        <input
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            type="tel"
                            placeholder="Loginni kiriting"
                            className="px-3 py-2.5 border border-[#aaa] rounded-md text-sm outline-none transition-colors duration-200 focus:border-[#1F2D5C]"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[13px] text-[#444]">Parol</label>
                        <div className="relative">
                            <input
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                type={showPass ? 'text' : 'password'}
                                placeholder="Parolni kiriting"
                                className="w-full py-2.5 pl-3 pr-10 border border-[#aaa] rounded-md text-sm outline-none transition-colors duration-200 focus:border-[#1F2D5C]"
                            />
                            <span
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#888] text-lg select-none"
                            >
                                {showPass ? '🙈' : '👁️'}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`py-3 border-none rounded-md text-[15px] font-semibold text-white tracking-[0.5px] transition-colors duration-200 ${loading ? 'bg-[#6b81c7] cursor-not-allowed' : 'bg-[#1F2D5C] hover:bg-[#162040] cursor-pointer'}`}
                    >
                        {loading ? 'Yuklanmoqda...' : 'Kirish'}
                    </button>
                </form>

                <p className="absolute bottom-4 text-xs text-[#888]">
                    Copyright © 2021 of Tashkent University of Information Technologies
                </p>
            </div>
        </div>
    )
}
