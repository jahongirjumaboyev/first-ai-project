import Study from '../imgs/study.svg'
import Logo from '../imgs/logo.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const navigate = useNavigate()
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null) // { message, type: 'success' | 'error' }

    function showToast(message, type) {
        setToast({ message, type })
        setTimeout(() => setToast(null), 2500)
    }

    function Auth(e) {
        e.preventDefault()
        if (user && password) {
            setLoading(true)
            localStorage.setItem('token', 'fake-token-12345')
            showToast("✅ Muvaffaqiyatli o'tdingiz!", 'success')
            setTimeout(() => {
                navigate('/dashboard')
            }, 2000)
        } else {
            showToast('⚠️ Login yoki parol kiritilmagan!', 'error')
        }
    }

    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', fontFamily: "'Roboto', sans-serif" }}>

            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    top: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: toast.type === 'success' ? '#1F2D5C' : '#c0392b',
                    color: '#fff',
                    padding: '14px 28px',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: 600,
                    boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
                    zIndex: 9999,
                    animation: 'slideDown 0.35s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    whiteSpace: 'nowrap'
                }}>
                    {toast.message}
                    {toast.type === 'success' && (
                        <span style={{ fontSize: '13px', opacity: 0.8 }}> — 2 soniyada yo'naltirilmoqda...</span>
                    )}
                </div>
            )}

            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateX(-50%) translateY(-16px); }
                    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `}</style>

            {/* LEFT — illustration */}
            <div style={{
                width: '55%',
                background: '#1F2D5C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                <img
                    src={Study}
                    alt="study illustration"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>

            {/* RIGHT — form */}
            <div style={{
                width: '45%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '18px',
                background: '#fff',
                position: 'relative'
            }}>
                <p style={{
                    width: '240px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#333',
                    lineHeight: '1.5'
                }}>
                    MUHAMMAD AL-XORAZMIY NOMIDAGI TOSHKENT AXBOROT TEXNOLOGIYALARI UNIVERSITETI
                </p>

                <img src={Logo} alt="logo" style={{ width: '80px', height: '80px' }} />

                <h2 style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    color: '#111',
                    margin: 0
                }}>
                    LEARNING MANAGEMENT SYSTEM
                </h2>

                <form onSubmit={Auth} style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '300px' }}>

                    {/* Login field */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '13px', color: '#444' }}>Login</label>
                        <input
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            type="text"
                            placeholder="Loginni kiriting"
                            style={{
                                padding: '10px 12px',
                                border: '1px solid #aaa',
                                borderRadius: '6px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border 0.2s',
                            }}
                            onFocus={e => e.target.style.borderColor = '#1F2D5C'}
                            onBlur={e => e.target.style.borderColor = '#aaa'}
                        />
                    </div>

                    {/* Parol field */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '13px', color: '#444' }}>Parol</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type={showPass ? 'text' : 'password'}
                                placeholder="Parolni kiriting"
                                style={{
                                    padding: '10px 40px 10px 12px',
                                    border: '1px solid #aaa',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    outline: 'none',
                                    transition: 'border 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = '#1F2D5C'}
                                onBlur={e => e.target.style.borderColor = '#aaa'}
                            />
                            <span
                                onClick={() => setShowPass(!showPass)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                    color: '#888',
                                    fontSize: '18px',
                                    userSelect: 'none'
                                }}
                            >
                                {showPass ? '🙈' : '👁️'}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '12px',
                            background: loading ? '#6b81c7' : '#1F2D5C',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '15px',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s',
                            letterSpacing: '0.5px'
                        }}
                        onMouseEnter={e => { if (!loading) e.target.style.background = '#162040' }}
                        onMouseLeave={e => { if (!loading) e.target.style.background = '#1F2D5C' }}
                    >
                        {loading ? 'Yuklanmoqda...' : 'Kirish'}
                    </button>
                </form>

                {/* Footer */}
                <p style={{
                    position: 'absolute',
                    bottom: '16px',
                    fontSize: '12px',
                    color: '#888'
                }}>
                    Copyright © 2021 of Tashkent University of Information Technologies
                </p>
            </div>
        </div>
    )
}