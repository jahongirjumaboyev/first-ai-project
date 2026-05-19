import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Homepage from './components/Homepage'
import Main from './components/Main'
import Teachers from './components/Teachers'
import Classes from './components/Classes'
import Students from './components/Students'
import Groups from './components/Groups'
import GroupDetail from './components/GroupDetail'
import Prizes from './components/Prizes'
import Settings from './components/Settings'

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
