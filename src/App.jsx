import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Homepage from './components/Homepage'
import Main from './components/Main'
import Teachers from './components/Teachers'
import Classes from './components/Classes'
import Students from './components/Students'
import Prizes from './components/Prizes'
import Settings from './components/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login sahifasi */}
        <Route path='/' element={<Login />} />

        {/* Dashboard layout */}
        <Route path='/dashboard' element={<Homepage />}>
          <Route index element={<Navigate to='asosiy' replace />} />
          <Route path='asosiy'        element={<Main />} />
          <Route path='oqituvchilar'  element={<Teachers />} />
          <Route path='sinflar'       element={<Classes />} />
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
