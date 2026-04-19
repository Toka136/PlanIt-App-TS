import { Eye, EyeOffIcon, SquareCheckBig } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLoginMutation } from '../API/slices/AuthSlice';
import { CircularProgress } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { useState } from 'react';
import type { loginData } from '../Types/AuthTypes';
import { NavLink, useNavigate } from 'react-router-dom';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn } from '../API/slices/UserStatusslice';
   
       const loginSchema=Yup.object({
        email:Yup.string().email().required(),
        password:Yup.string().required()
    })
function LoginPage  () {
    const[login,{isLoading}]=useLoginMutation()
    const navigate=useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const toastSuccess=()=>toast.success("Login successful")
    const toastError=()=>toast.error("Something went wrong")
    const toastInvalid=()=>toast.error("Invalid credentials")
    const dispatch=useDispatch()
    const loginFormik=useFormik({
        initialValues: {
          email: '',
          password: '',
        },
        validationSchema: loginSchema,
        onSubmit: (values) => {
          console.log(values);
          handleLogin(values)
        },
    })
    const handleLogin=async(values:loginData)=>{
        try{
            const res=await login(values).unwrap()
            console.log(res)
            toastSuccess()
            dispatch(setIsLoggedIn(true))
            localStorage.setItem("isLoggedIn",JSON.stringify(true))
            setTimeout(() => {
              navigate('/dashboard')
            }, 1000);
        }catch(error){
          const err=error as FetchBaseQueryError
          const errorData = err.data as { message: string };
          if(errorData?.message?.includes("Invalid data")){toastInvalid()}
          else
            toastError()
            console.log(error)
        }
    }
  return (
    <>
    {  <div className="flex min-h-screen w-full flex-col md:flex-row bg-[#121212]">
      
      {/* Left Side: Form Section */}
      <div className="flex w-full flex-col justify-center px-8 py-12 md:w-1/2 lg:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="bg-[#8B5CF6] p-1.5 rounded-lg">
              <SquareCheckBig className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">TaskFlow</h1>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={loginFormik.handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
              name='email'
              onChange={loginFormik.handleChange}
              value={loginFormik.values.email}
              onBlur={loginFormik.handleBlur}
                type="email"
                id="email"
                placeholder="you@example.com"
                className="w-full bg-[#262626] border border-transparent focus:border-[#8B5CF6] text-white rounded-xl px-4 py-3 outline-none transition-all placeholder:text-gray-600"
              />
              {loginFormik.errors.email && loginFormik.touched.email && <p className='text-red-500'>{loginFormik.errors.email}</p>}
            </div>

            <div>
              <label htmlFor='pass' className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className='relative'><input
              name='password'
              id='pass'
              onChange={loginFormik.handleChange}
              value={loginFormik.values.password}
              onBlur={loginFormik.handleBlur}
                type={showPassword?'text':'password'}
                placeholder="Enter your password"
                className="w-full bg-[#262626] border border-transparent focus:border-[#8B5CF6] text-white rounded-xl px-4 py-3 outline-none transition-all placeholder:text-gray-600"
              />
              {showPassword?<EyeOffIcon className='absolute right-3 top-3 cursor-pointer text-black' onClick={()=>setShowPassword(false)}/>:
              <Eye className='absolute text-black right-3 top-3 cursor-pointer' onClick={()=>setShowPassword(true)}/>}
              </div>
              
              {loginFormik.errors.password && loginFormik.touched.password && <p className='text-red-500'>{loginFormik.errors.password}</p>}
            </div>
 
            <button
              type="submit"
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold py-3 rounded-xl transition-colors mt-4"
            >
             {isLoading?<CircularProgress/>:'Sign In'}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-8 text-center text-gray-400">
            Don't have an account?{' '}
            <NavLink to="/register" className="text-[#8B5CF6] hover:underline">
              Sign up
            </NavLink>
          </p>
        </div>
      </div>

      {/* Right Side: Visual Section */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-linear-to-br from-[#8B5CF6] via-[#6366F1] to-[#10B981] p-12">
        <div className="max-w-md text-center">
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Stay Organized, Stay Productive
          </h2>
          <p className="text-white/90 text-lg leading-relaxed">
            Manage your tasks efficiently with our intuitive dashboard and powerful analytics.
          </p>
        </div>
      </div>
      <ToastContainer/>
      
    </div>}</>
  
  );
};

export default LoginPage;