import ForgotPassword from './components/ForgotPassword'
import Home from './components/Home'
import LoginRegister from './components/LoginRegister'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/' element={<LoginRegister />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
