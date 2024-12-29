// import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/signUpPage'
import LoginPage from './pages/logInPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import { Toaster } from "react-hot-toast";

function App() {
  return (
    
    <div class="min-h-screen bg-gradient-to-tr from-blue-700 to-purple-700 h-screen w-full flex items-center justify-center">
      {/* <h1 className='text-red-500 text-5xl font-bold'>My React App</h1> */}
      <Toaster />

      <Routes>
        <Route path='/' element={<h1 className='text-red-500 text-5xl font-bold'>Home</h1>} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/verify-email' element ={<VerifyEmailPage />} ></Route>
      </Routes>

    </div>
  )
}

export default App
