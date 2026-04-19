import { SquareCheckBig, User, Camera, EyeOffIcon, Eye } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRegisterMutation } from '../API/slices/AuthSlice';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import type {  registerTempData } from '../Types/AuthTypes';
import { NavLink, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
      const registerSchema=Yup.object({
        email:Yup.string().email().required(),
        password:Yup.string().required(),
        userName:Yup.string().required(),
    })
function SignUpPage  ()  {
     const[register,{isLoading}]=useRegisterMutation()
     const navigate=useNavigate()
     const[avatar,setAvatar]=useState<File|null>(null)
     const[imgPreview,setImgPreview]=useState("")
        const [showPassword, setShowPassword] = useState(false);
        const toastSuccess=()=>toast.success("registration successful")
        const toastError=()=>toast.error("Something went wrong")
        const toastInvalid=()=>toast.error("User already exist")
        const registerFormik=useFormik({
            initialValues: {
              email: '',
              password: '',
              userName: '',
            },
            validationSchema: registerSchema,
            onSubmit: (values) => {
              console.log(values);
              handleRegister(values)
            },
        })
        const handleRegister=async(values:registerTempData)=>{
            const formData=new FormData()
            formData.append('userName',values.userName)
            formData.append('email',values.email)
            formData.append('password',values.password)
            if (avatar) {
             formData.append('avatar', avatar);
            }
            try{
                const res=await register(formData).unwrap()
                console.log(res)
                toastSuccess()
                setTimeout(() => {
                    navigate('/login')
                },2000);
            }catch(error){
                const err=error as FetchBaseQueryError
                const errorData = err.data as { message: string };
                if(errorData?.message?.includes("User already exist")){toastInvalid()}
                else
                toastError()
                console.log(error)
            }
        }
        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
             const file = event.target.files?.[0];
             if(file)
             {
                setAvatar(file)
              const url=URL.createObjectURL(file);
              setImgPreview(url)
             }

        }
  return (
    <>
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-[#0a0a0a]">
      
      {/* Left Side: Visual Section */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-linear-to-br from-[#10B981] via-[#6366F1] to-[#8B5CF6] p-12">
        <div className="max-w-md text-center">
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Join TaskFlow Today
          </h2>
          <p className="text-white/90 text-lg leading-relaxed">
            Create your account and start managing tasks like a pro with our comprehensive dashboard.
          </p>
        </div>
      </div>

      {/* Right Side: Form Section */}
      <div className="flex w-full flex-col justify-center px-8 py-10 md:w-1/2 lg:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-[#8B5CF6] p-1.5 rounded-lg">
              <SquareCheckBig className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">TaskFlow</h1>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-semibold text-white mb-1">Create Account</h2>
            <p className="text-gray-500 text-sm">Sign up to get started with TaskFlow</p>
          </div>

          {/* Profile Image Upload Placeholder */}
          <div className="flex flex-col items-center mb-8">
            <span className="text-sm font-medium text-gray-300 mb-3">Profile Image</span>
            <div className="relative group cursor-pointer">
              <label htmlFor='image_upload' className="w-30 h-30 rounded-full border-2 border-dashed border-gray-700 flex flex-col items-center justify-center hover:border-[#8B5CF6] transition-colors bg-[#1a1a1a]">
                {imgPreview?<img src={imgPreview} alt="Profile" className="w-full h-full rounded-full object-cover" />:
                <div className='flex flex-col justify-center items-center cursor-pointer'>
                <User className="w-8 h-8 text-gray-500" />
                <span className="text-[10px] text-gray-500 mt-1 uppercase font-semibold">Click or drag</span>
                </div>}
              </label>
              <input id='image_upload' type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <div className="absolute bottom-0 right-0 bg-[#8B5CF6] p-1.5 rounded-full border-2 border-[#0a0a0a]">
                <Camera className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={registerFormik.handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
              name='userName'
              onChange={registerFormik.handleChange}
              value={registerFormik.values.userName}
              onBlur={registerFormik.handleBlur}
                type="text"
                placeholder="John Doe"
                className="w-full bg-[#1e1e1e] border border-transparent focus:border-[#8B5CF6] text-white rounded-xl px-4 py-3 outline-none transition-all placeholder:text-gray-600"
              />
              {registerFormik.touched.userName && registerFormik.errors.userName && <p className="text-red-500 text-xs mt-1">{registerFormik.errors.userName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
              name='email'
              onChange={registerFormik.handleChange}
              value={registerFormik.values.email}
              onBlur={registerFormik.handleBlur}
                type="email"
                placeholder="you@example.com"
                className="w-full bg-[#1e1e1e] border border-transparent focus:border-[#8B5CF6] text-white rounded-xl px-4 py-3 outline-none transition-all placeholder:text-gray-600"
              />
              {registerFormik.touched.email && registerFormik.errors.email && <p className="text-red-500 text-xs mt-1">{registerFormik.errors.email}</p>}
            </div>

           <div>
              <label htmlFor='pass' className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className='relative'><input
              name='password'
              id='pass'
              onChange={registerFormik.handleChange}
              value={registerFormik.values.password}
              onBlur={registerFormik.handleBlur}
                type={showPassword?'text':'password'}
                placeholder="Enter your password"
                className="w-full bg-[#262626] border border-transparent focus:border-[#8B5CF6] text-white rounded-xl px-4 py-3 outline-none transition-all placeholder:text-gray-600"
              />
              {showPassword?<EyeOffIcon className='absolute right-3 top-3 cursor-pointer text-black' onClick={()=>setShowPassword(false)}/>:
              <Eye className='absolute text-black right-3 top-3 cursor-pointer' onClick={()=>setShowPassword(true)}/>}
              </div>
              
              {registerFormik.errors.password && registerFormik.touched.password && <p className='text-red-500'>{registerFormik.errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold py-3 rounded-xl transition-colors mt-2"
            >
              Create Account
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-6 text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <NavLink to="/login" className="text-[#8B5CF6] hover:underline font-medium">
            {isLoading?<CircularProgress size={20}/>:"Sign In"}
            </NavLink>
          </p>
        </div>
        <ToastContainer/>
      </div>
      
    </div>

      
    </>
  );
};

export default SignUpPage;