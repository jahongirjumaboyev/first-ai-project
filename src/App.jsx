import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Homepage from './pages/Homepage'
import Main from './pages/Main'
import Teachers from './pages/Teachers'
import Classes from './pages/Classes'
import Students from './pages/Students'
import Groups from './pages/Groups'
import GroupDetail from './pages/GroupDetail'
import HomeworkCreate from './pages/HomeworkCreate'
import Prizes from './pages/Prizes'
import Settings from './pages/Settings'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login sahifasi */}
        <Route path='/' element={<Login />} />

        {/* Dashboard layout — faqat token bo'lsa kirish mumkin */}
        <Route path='/dashboard' element={<ProtectedRoute><Homepage /></ProtectedRoute>}>
          <Route index          element={<Main />} />
          <Route path='oqituvchilar'  element={<Teachers />} />
          <Route path='sinflar'       element={<Classes />} />
          <Route path='guruhlar'      element={<Groups />} />
          <Route path='guruhlar/:id'  element={<GroupDetail />} />
          <Route path='guruhlar/:id/homework/create' element={<HomeworkCreate />} />
          <Route path='talabalar'     element={<Students />} />
          <Route path='sovgalar'      element={<Prizes />} />
          <Route path='boshqarish'    element={<Settings />} />
        </Route>

        {/* Noto'g'ri URL → login */}
        <Route path='*' element={<Navigate to='/' replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
