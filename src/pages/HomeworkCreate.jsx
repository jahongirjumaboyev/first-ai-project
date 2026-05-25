import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { apiPostForm } from '../api'

function ToolBtn({ children, title }) {
    return (
        <button
            type="button"
            title={title}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0fdf4] text-[#374151] hover:text-[#10b981] transition-colors"
        >
            {children}
        </button>
    )
}

function Sep() {
    return <div className="w-px h-5 bg-[#e5e7eb] mx-1 flex-shrink-0" />
}

export default function HomeworkCreate() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [subject, setSubject] = useState('')
    const [desc, setDesc] = useState('')
    const [files, setFiles] = useState([])
    const fileInputRef = useRef(null)

    function handleFileChange(e) {
        const chosen = Array.from(e.target.files || [])
        setFiles(chosen)
    }

    function handleDrop(e) {
        e.preventDefault()
        const dropped = Array.from(e.dataTransfer.files || [])
        if (dropped.length) setFiles(dropped)
    }

    async function submit(e) {
        e.preventDefault()
        const form = new FormData()
        form.append('subject_id', subject)
        form.append('description', desc)
        files.forEach(f => form.append('files', f))
        try {
            await apiPostForm(`/homework/own/${id}`, form)
        } catch {}
        navigate(`/dashboard/guruhlar/${id}`)
    }

    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate(`/dashboard/guruhlar/${id}`)} className="text-[#111827] flex items-center">
                    <ArrowBackIcon sx={{ fontSize: 20 }} />
                </button>
                <h2 className="text-2xl font-bold">Yangi uyga vazifa yaratish</h2>
            </div>

            <form onSubmit={submit} className="max-w-4xl">

                <div className="mb-6">
                    <label className="block text-sm font-bold text-[#1a1a2e] mb-2">
                        <span className="text-red-500">*</span> Mavzu
                    </label>
                    <div className="relative">
                        <select
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#eef3f7] rounded-md p-3 pr-10 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 focus:border-[#10b981]"
                        >
                            <option value="">Mavzulardan birini tanlang</option>
                            <option value="1">Html asoslari</option>
                            <option value="2">Kirish</option>
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280]">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </span>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-bold text-[#1a1a2e] mb-2">
                        <span className="text-red-500">*</span> Izoh
                    </label>
                    <div className="border border-[#e5e7eb] rounded-lg bg-white shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#10b981]/30 focus-within:border-[#10b981]">

                        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-[#f0f0f0] bg-[#fafafa]">
                            <ToolBtn title="Bold"><span className="font-bold text-[15px] leading-none">B</span></ToolBtn>
                            <ToolBtn title="Italic"><span className="italic font-semibold text-[15px] leading-none">I</span></ToolBtn>
                            <ToolBtn title="Underline"><span className="underline text-[15px] leading-none">U</span></ToolBtn>
                            <ToolBtn title="Strikethrough"><span className="line-through text-[15px] leading-none">S</span></ToolBtn>
                            <Sep />
                            <ToolBtn title="Blockquote">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                                </svg>
                            </ToolBtn>
                            <ToolBtn title="Code">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="16 18 22 12 16 6" />
                                    <polyline points="8 6 2 12 8 18" />
                                </svg>
                            </ToolBtn>
                            <Sep />
                            <ToolBtn title="Bullet list">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="9" y1="6" x2="20" y2="6" />
                                    <line x1="9" y1="12" x2="20" y2="12" />
                                    <line x1="9" y1="18" x2="20" y2="18" />
                                    <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
                                    <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
                                    <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
                                </svg>
                            </ToolBtn>
                            <ToolBtn title="Numbered list">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="10" y1="6" x2="21" y2="6" />
                                    <line x1="10" y1="12" x2="21" y2="12" />
                                    <line x1="10" y1="18" x2="21" y2="18" />
                                    <path d="M4 6h1v4" />
                                    <path d="M4 10h2" />
                                    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
                                </svg>
                            </ToolBtn>
                            <Sep />
                            <ToolBtn title="Align left">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="21" y1="6" x2="3" y2="6" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                    <line x1="17" y1="18" x2="3" y2="18" />
                                </svg>
                            </ToolBtn>
                            <ToolBtn title="Align right">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="21" y1="6" x2="3" y2="6" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                    <line x1="21" y1="18" x2="7" y2="18" />
                                </svg>
                            </ToolBtn>
                            <Sep />
                            <ToolBtn title="Insert link">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                </svg>
                            </ToolBtn>
                        </div>

                        <div
                            contentEditable
                            suppressContentEditableWarning
                            className="p-4 min-h-[160px] text-sm text-[#374151] focus:outline-none"
                            onInput={e => setDesc(e.currentTarget.textContent || '')}
                        >
                            {!desc && (
                                <span className="text-[#9aa4b2] pointer-events-none select-none">
                                    Vazifa haqida batafsil ma'lumot kiriting...
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <input ref={fileInputRef} type="file" className="hidden" multiple onChange={handleFileChange} />
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={e => e.preventDefault()}
                        onDrop={handleDrop}
                        role="button"
                        tabIndex={0}
                        className="border-2 border-dashed border-[#a7f3d0] rounded-xl p-14 text-center bg-white cursor-pointer hover:border-[#10b981] hover:bg-[#f0fdf4] transition-colors"
                    >
                        <div className="flex justify-center mb-4">
                            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <polyline points="16 16 12 12 8 16" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="12" y1="12" x2="12" y2="21" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <p className="text-[#10b981] font-medium text-base">Faylni tanlash yoki shu yerga tashlang</p>
                    </div>
                    {files.length > 0 && (
                        <div className="mt-3 text-sm text-[#374151] text-left">
                            {files.map((f, i) => (
                                <div key={i} className="truncate">{f.name}</div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-8 py-3 rounded-full bg-white border border-[#e5e7eb] text-[#6b7280] text-base font-medium hover:bg-[#f9fafb] transition-colors"
                    >
                        Bekor qilish
                    </button>
                    <button
                        type="submit"
                        className="px-8 py-3 rounded-full bg-[#10b981] text-white text-base font-semibold shadow-md hover:bg-[#059669] transition-colors"
                    >
                        E'lon qilish
                    </button>
                </div>

            </form>
        </div>
    )
}
