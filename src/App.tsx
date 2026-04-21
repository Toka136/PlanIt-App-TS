import './App.css'
import LoginPage from './components/Login'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUpPage from './components/Register'
import General from './components/General'
import { useSelector } from 'react-redux'
import type { UserStatusState } from './Types/AuthTypes'
function App() {
  const userStatus=useSelector((state:UserStatusState)=>state.UserStatus.isLoggedIn)
  console.log("userStatus",userStatus)
  return (
  <>
  {console.log("userStatus",userStatus)}
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<SignUpPage />} />
    <Route path="/*" element={userStatus?<General />:<Navigate to="/login" />} />
  </Routes>
 

  </>
  )
}

export default App
