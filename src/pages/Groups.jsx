import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiGet } from '../api'
import AddIcon from '@mui/icons-material/Add'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import GroupsStats from '../components/groups/GroupsStats'
import GroupsTable from '../components/groups/GroupsTable'
import GroupDrawer from '../components/groups/GroupDrawer'

export default function Groups() {
    const navigate = useNavigate()
    const [groups, setGroups]             = useState([])
    const [activeTab, setActiveTab]       = useState('guruhlar')
    const [drawerOpen, setDrawerOpen]     = useState(false)
    const [rooms, setRooms]               = useState([])
    const [courses, setCourses]           = useState([])
    const [apiTeachers, setApiTeachers]   = useState([])
    const [apiStudents, setApiStudents]   = useState([])

    const loadGroups = () =>
        apiGet('/groups/all').then(d => setGroups(Array.isArray(d) ? d : d?.data ?? [])).catch(() => {})

    useEffect(() => {
        loadGroups()
        apiGet('/rooms').then(d => setRooms(Array.isArray(d) ? d : d?.data ?? [])).catch(() => {})
        apiGet('/courses').then(d => setCourses(Array.isArray(d) ? d : d?.data ?? [])).catch(() => {})
        apiGet('/teachers').then(d => setApiTeachers(Array.isArray(d) ? d : d?.data ?? [])).catch(() => {})
        apiGet('/students?page=1&limit=100').then(d => setApiStudents(Array.isArray(d) ? d : d?.data ?? [])).catch(() => {})
    }, [])

    const toggleActive = (id) =>
        setGroups(prev => prev.map(g => g.id === id ? { ...g, active: !g.active } : g))

    return (
        <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-5">
                <h1 className="m-0 text-2xl font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Guruhlar</h1>
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="flex items-center gap-1.5 bg-[#7E56D8] hover:bg-[#6a44c0] text-white border-none rounded-[10px] px-4.5 py-2.5 text-[13px] font-semibold cursor-pointer transition-colors duration-200 w-fit shrink-0"
                >
                    <AddIcon sx={{ fontSize: 18 }} /> Guruh qo'shish
                </button>
            </div>

            <div className="bg-white dark:bg-[#1e2a3a] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] overflow-hidden">
                <div className="flex border-b border-[#e8e8e8] dark:border-[#2d3748] px-4">
                    {[
                        { id: 'guruhlar', label: 'Guruhlar', icon: null },
                        { id: 'arxiv',    label: 'Arxiv',    icon: <CalendarMonthIcon sx={{ fontSize: 15 }} /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-none bg-transparent cursor-pointer transition-colors duration-200 border-b-2 -mb-px ${activeTab === tab.id ? 'text-[#7E56D8] border-[#7E56D8]' : 'text-[#6b7280] dark:text-[#94a3b8] border-transparent hover:text-[#1a1a2e] dark:hover:text-[#e2e8f0]'}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <GroupsStats groups={groups} />
                <GroupsTable
                    groups={groups}
                    onNavigate={(id, group) => navigate(`/dashboard/guruhlar/${id}`, { state: { group } })}
                    onToggleActive={toggleActive}
                />
            </div>

            <GroupDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSaved={loadGroups}
                rooms={rooms}
                courses={courses}
                apiTeachers={apiTeachers}
                apiStudents={apiStudents}
                groups={groups}
            />
        </div>
    )
}
