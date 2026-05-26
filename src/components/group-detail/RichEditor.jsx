import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import { TextStyle, FontFamily, FontSize } from '@tiptap/extension-text-style'

import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import FormatStrikethroughSIcon from '@mui/icons-material/StrikethroughS'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import CodeIcon from '@mui/icons-material/Code'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
import LinkIcon from '@mui/icons-material/Link'

const FONT_FAMILIES = [
    { label: 'Default',      value: '' },
    { label: 'Arial',        value: 'Arial, sans-serif' },
    { label: 'Georgia',      value: 'Georgia, serif' },
    { label: 'Courier New',  value: "'Courier New', monospace" },
    { label: 'Verdana',      value: 'Verdana, sans-serif' },
]
const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32']

function Btn({ active, onClick, title, children }) {
    return (
        <button
            type="button"
            title={title}
            onMouseDown={e => { e.preventDefault(); onClick() }}
            className={`p-[5px] rounded border-none cursor-pointer transition-colors shrink-0 ${
                active
                    ? 'bg-[#7c3aed] text-white'
                    : 'bg-transparent text-[#374151] dark:text-[#94a3b8] hover:bg-[#f3f4f6] dark:hover:bg-[#374151]'
            }`}
        >{children}</button>
    )
}

function Sep() {
    return <div className="w-px h-5 bg-[#e5e7eb] dark:bg-[#374151] mx-0.5 shrink-0" />
}

const selectCls =
    'text-[11px] border border-[#e5e7eb] dark:border-[#374151] rounded px-1 py-[3px] bg-white dark:bg-[#1e2a3a] text-[#374151] dark:text-[#94a3b8] cursor-pointer outline-none shrink-0'

export default function RichEditor({ onChange, placeholder = 'Izoh kiriting...' }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            FontFamily,
            FontSize,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({ openOnClick: false }),
        ],
        content: '',
        onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    })

    if (!editor) return null

    const addLink = () => {
        const prev = editor.getAttributes('link').href || ''
        const url  = window.prompt('Link kiriting:', prev || 'https://')
        if (url === null) return
        if (!url) { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    const curFontFamily = editor.getAttributes('textStyle').fontFamily || ''
    const curFontSize   = editor.getAttributes('textStyle').fontSize   || ''

    return (
        <div className="border border-[#e5e7eb] dark:border-[#2d3748] rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-[#e5e7eb] dark:border-[#2d3748] bg-[#f9fafb] dark:bg-[#162032] overflow-x-auto">
                {/* H1 H2 */}
                <Btn active={editor.isActive('heading', { level: 1 })}
                     onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading 1">
                    <span className="text-[11px] font-bold leading-none px-0.5">H1</span>
                </Btn>
                <Btn active={editor.isActive('heading', { level: 2 })}
                     onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
                    <span className="text-[11px] font-bold leading-none px-0.5">H2</span>
                </Btn>

                <Sep />

                {/* Font family */}
                <select
                    className={selectCls}
                    value={curFontFamily}
                    onMouseDown={e => e.stopPropagation()}
                    onChange={e => {
                        const v = e.target.value
                        v ? editor.chain().focus().setFontFamily(v).run()
                          : editor.chain().focus().unsetFontFamily().run()
                    }}
                >
                    {FONT_FAMILIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>

                {/* Font size */}
                <select
                    className={`${selectCls} w-14 ml-0.5`}
                    value={curFontSize}
                    onMouseDown={e => e.stopPropagation()}
                    onChange={e => {
                        const v = e.target.value
                        v ? editor.chain().focus().setFontSize(v).run()
                          : editor.chain().focus().unsetFontSize().run()
                    }}
                >
                    <option value="">Size</option>
                    {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <Sep />

                {/* B I U S */}
                <Btn active={editor.isActive('bold')}      onClick={() => editor.chain().focus().toggleBold().run()}      title="Bold">
                    <FormatBoldIcon sx={{ fontSize: 15 }} />
                </Btn>
                <Btn active={editor.isActive('italic')}    onClick={() => editor.chain().focus().toggleItalic().run()}    title="Italic">
                    <FormatItalicIcon sx={{ fontSize: 15 }} />
                </Btn>
                <Btn active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
                    <FormatUnderlinedIcon sx={{ fontSize: 15 }} />
                </Btn>
                <Btn active={editor.isActive('strike')}    onClick={() => editor.chain().focus().toggleStrike().run()}    title="Strikethrough">
                    <FormatStrikethroughSIcon sx={{ fontSize: 15 }} />
                </Btn>

                <Sep />

                {/* Blockquote Code */}
                <Btn active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote">
                    <FormatQuoteIcon sx={{ fontSize: 15 }} />
                </Btn>
                <Btn active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} title="Inline code">
                    <CodeIcon sx={{ fontSize: 15 }} />
                </Btn>

                <Sep />

                {/* Lists */}
                <Btn active={editor.isActive('bulletList')}  onClick={() => editor.chain().focus().toggleBulletList().run()}  title="Bullet list">
                    <FormatListBulletedIcon sx={{ fontSize: 15 }} />
                </Btn>
                <Btn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">
                    <FormatListNumberedIcon sx={{ fontSize: 15 }} />
                </Btn>

                <Sep />

                {/* Alignment */}
                <Btn active={editor.isActive({ textAlign: 'left' })}
                     onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Left">
                    <FormatAlignLeftIcon sx={{ fontSize: 15 }} />
                </Btn>
                <Btn active={editor.isActive({ textAlign: 'center' })}
                     onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Center">
                    <FormatAlignCenterIcon sx={{ fontSize: 15 }} />
                </Btn>
                <Btn active={editor.isActive({ textAlign: 'right' })}
                     onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Right">
                    <FormatAlignRightIcon sx={{ fontSize: 15 }} />
                </Btn>
                <Btn active={editor.isActive({ textAlign: 'justify' })}
                     onClick={() => editor.chain().focus().setTextAlign('justify').run()} title="Justify">
                    <FormatAlignJustifyIcon sx={{ fontSize: 15 }} />
                </Btn>

                <Sep />

                {/* Link */}
                <Btn active={editor.isActive('link')} onClick={addLink} title="Link">
                    <LinkIcon sx={{ fontSize: 15 }} />
                </Btn>
            </div>

            {/* Editor area */}
            <EditorContent
                editor={editor}
                className="px-3.5 py-3 text-[13px] text-[#1a1a2e] dark:text-[#e2e8f0] bg-white dark:bg-[#0f1827]"
            />
        </div>
    )
}
