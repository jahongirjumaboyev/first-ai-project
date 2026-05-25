import PeopleIcon from '@mui/icons-material/People'
import SchoolIcon from '@mui/icons-material/School'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const avatarStack = [
    { label: 'M', color: '#7E56D8' },
    { label: 'A', color: '#e91e63' },
    { label: 'S', color: '#16a34a' },
]

export default function GroupsStats({ groups }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 border-b border-[#e8e8e8] dark:border-[#2d3748]">
            <div className="border border-[#e8e8e8] dark:border-[#2d3748] rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#6b7280] dark:text-[#94a3b8] text-[13px]">
                        <PeopleIcon sx={{ fontSize: 20, color: '#6b7280' }} /> Jami guruhlar
                    </div>
                    <button className="border-none bg-transparent cursor-pointer text-[#94a3b8] hover:text-[#555] dark:hover:text-[#e2e8f0] flex p-0.5 transition-colors">
                        <MoreVertIcon sx={{ fontSize: 18 }} />
                    </button>
                </div>
                <span className="text-3xl font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">{groups.length}</span>
            </div>
            <div className="border border-[#e8e8e8] dark:border-[#2d3748] rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#6b7280] dark:text-[#94a3b8] text-[13px]">
                        <PeopleIcon sx={{ fontSize: 20, color: '#6b7280' }} /> O'qituvchilar
                    </div>
                    <button className="border-none bg-transparent cursor-pointer text-[#94a3b8] hover:text-[#555] dark:hover:text-[#e2e8f0] flex p-0.5 transition-colors">
                        <MoreVertIcon sx={{ fontSize: 18 }} />
                    </button>
                </div>
                <span className="text-3xl font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">0</span>
            </div>
            <div className="border border-[#e8e8e8] dark:border-[#2d3748] rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#6b7280] dark:text-[#94a3b8] text-[13px]">
                        <SchoolIcon sx={{ fontSize: 20, color: '#6b7280' }} /> O'quvchilar
                    </div>
                    <button className="border-none bg-transparent cursor-pointer text-[#94a3b8] hover:text-[#555] dark:hover:text-[#e2e8f0] flex p-0.5 transition-colors">
                        <MoreVertIcon sx={{ fontSize: 18 }} />
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">0</span>
                    <div className="flex -space-x-2">
                        {avatarStack.map((a, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1e2a3a] flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: a.color }}>
                                {a.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
