import './App.css'
import LoginPage from './components/Auth/Login'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUpPage from './components/Auth/Register'
import General from './components/General'
import { UseAppSelector } from './Types/StoreHooks'
function App() {
  const userStatus=UseAppSelector((state)=>state.UserStatus.isLoggedIn)
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
