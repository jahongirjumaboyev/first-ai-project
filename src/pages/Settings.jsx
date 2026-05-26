import { useState, useEffect, useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apiGet } from '../api'
import { ThemeContext } from '../context/ThemeContext'
import KursDrawer from '../components/settings/KursDrawer'
import XonaDrawer from '../components/settings/XonaDrawer'
import KurslarTab from '../components/settings/KurslarTab'
import XonalarTab from '../components/settings/XonalarTab'

const tabs = [
    { id: 'kurslar',  label: 'Kurslar' },
    { id: 'xonalar',  label: 'Xonalar' },
    { id: 'xodimlar', label: 'Hodimlar' },
    { id: 'rollar',   label: 'Rollar' },
    { id: 'xabar',    label: 'Xabar yuborish' },
    { id: 'faq',      label: 'FAQ' },
    { id: 'telegram', label: 'Telegram bot' },
]

function PlaceholderTab({ label }) {
    return (
        <div className="text-center py-20 text-[#bbb] dark:text-[#4a5568] text-sm">
            {label} bo'limi tez kunda
        </div>
    )
}

export default function Settings() {
    useContext(ThemeContext)
    const [searchParams, setSearchParams] = useSearchParams()
    const urlTab    = searchParams.get('tab') || 'kurslar'
    const activeTab = tabs.find(t => t.id === urlTab)?.id || 'kurslar'

    const [drawerOpen, setDrawerOpen]             = useState(false)
    const [xonaOpen, setXonaOpen]                 = useState(false)
    const [editRoom, setEditRoom]                 = useState(null)
    const [courses, setCourses]                   = useState([])
    const [coursesLoading, setCoursesLoading]     = useState(false)
    const [rooms, setRooms]                       = useState([])
    const [roomsLoading, setRoomsLoading]         = useState(false)

    const loadCourses = () => {
        setCoursesLoading(true)
        apiGet('/courses')
            .then(d => setCourses(Array.isArray(d) ? d : d?.data ?? []))
            .catch(() => {})
            .finally(() => setCoursesLoading(false))
    }

    const loadRooms = () => {
        setRoomsLoading(true)
        apiGet('/rooms')
            .then(d => setRooms(Array.isArray(d) ? d : d?.data ?? []))
            .catch(() => {})
            .finally(() => setRoomsLoading(false))
    }

    useEffect(() => { loadCourses(); loadRooms() }, [])

    const switchTab = (id) => { if (id !== activeTab) setSearchParams({ tab: id }) }

    const renderContent = () => {
        switch (activeTab) {
            case 'kurslar': return <KurslarTab onAddClick={() => setDrawerOpen(true)} courses={courses} loading={coursesLoading} />
            case 'xonalar': return <XonalarTab onAddClick={() => setXonaOpen(true)} rooms={rooms} loading={roomsLoading} onRefresh={loadRooms} onEditClick={room => { setEditRoom(room); setXonaOpen(true) }} />
            default: return <PlaceholderTab label={tabs.find(t => t.id === activeTab)?.label || ''} />
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div className="mb-5">
                <h1 className="m-0 mb-1.5 text-[22px] font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Boshqarish</h1>
                <p className="m-0 text-[13px] text-[#888] dark:text-[#94a3b8] max-w-[680px] leading-relaxed">
                    Ushbu sahifada siz sovg'alarni boshqarish imkoniyatiga ega bo'lasiz. Har bir sovg'a haqida batafsil ma'lumot va yangi sovg'a qo'shish imkoniyat bor.
                </p>
            </div>

            <div className="bg-white dark:bg-[#1e2a3a] rounded-t-xl border border-[#e5e7eb] dark:border-[#2d3748] border-b-0 flex overflow-x-auto shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]" style={{ scrollbarWidth: 'none' }}>
                {tabs.map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => switchTab(id)}
                        className={`px-4.5 py-3.5 border-none bg-transparent text-[13px] cursor-pointer whitespace-nowrap transition-colors duration-200 border-b-2 ${id === activeTab ? 'text-[#7E56D8] font-semibold border-[#7E56D8]' : 'text-[#888] dark:text-[#94a3b8] font-normal border-transparent hover:text-[#7E56D8]'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-[#1e2a3a] rounded-b-xl border border-[#e5e7eb] dark:border-[#2d3748] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-6 flex-1 overflow-y-auto">
                <div key={activeTab} className="animate-fadeUp">
                    {renderContent()}
                </div>
            </div>

            <KursDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSaved={loadCourses} />
            <XonaDrawer open={xonaOpen} onClose={() => { setXonaOpen(false); setEditRoom(null) }} onSaved={loadRooms} room={editRoom} />
        </div>
    )
}
