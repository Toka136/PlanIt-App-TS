import { useFormik } from "formik";
import { useState, useRef, type ChangeEvent,type DragEvent, useEffect } from "react";
import * as Yup from "yup";
import { useDeleteUserMutation, useGetUserQuery, useUpdateUserMutation } from "../../API/slices/UserSlics";
import type {  UpdateData } from "../../Types/AuthTypes";
import { CircularProgress } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {  toast, ToastContainer } from "react-toastify";
import ConfirmDialog from "./DeleteAccount";
import {  useNavigate } from "react-router-dom";
const profileSchema=Yup.object({
  userName: Yup.string().required(),
  currentPassword: Yup.string(),
  newPassword: Yup.string().min(8),
})
const BASE_URL = "http://localhost:4000/uploads";

export default function ProfileSettings() {
  const {data:user,isLoading}=useGetUserQuery()
  const[updateUser,{isLoading:updateUserLoading,error}]=useUpdateUserMutation()
  const [deleteUser,{isLoading:deleteLoading}]=useDeleteUserMutation()
   const [isDragging, setIsDragging] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string|null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
   const [avatar, setAvatar] = useState<File|null>(null);
   const [showPassword, setShowPassword] = useState<boolean>(false);
   const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
   const [errorMessage, setErrorMessage] = useState<string | null>(null);
   const[open_confirm,setOpen_confirm]=useState<boolean>(false)
   const handleClose=()=>{setOpen_confirm(false)}
   const navigate=useNavigate()
  const profilFormik=useFormik({
   initialValues:{
  userName: "",
  currentPassword: "",
  newPassword: "",
},
    validationSchema:profileSchema,
    onSubmit:(values)=>{
      console.log("values",values)
   
       handleUpdate(values)
    }
  })
  useEffect(()=>{
    if(user){
      console.log("user",user)
      profilFormik.setValues({
        userName: user.data.userName,
        currentPassword: "",
        newPassword: "",})
      console.log("user.data.avatar",user.data.avatar)
      setPreviewUrl(user.data.avatar ? user.data.avatar  : `${BASE_URL}/defualt.webp`)
    }
    // eslint-disable-next-line
  },[user,isLoading])
  useEffect(()=>{
    if(error){
      const e=error as FetchBaseQueryError
      const errorData=e.data as {message:string}

        setErrorMessage(errorData.message)
     
      console.log("error",error)
    }
  },[error])
  const handleUpdate=async(values:UpdateData)=>{
        const formData=new FormData()
       if(values.userName.length>1)formData.append("userName",values.userName)
       if(values.currentPassword.length >1)formData.append("currentPassword",values.currentPassword)
       if(values.newPassword.length >1)formData.append("password",values.newPassword)
       if(avatar){
        formData.append("avatar",avatar)
       }
       console.log("formdata",formData)
     try {
      const res=await updateUser(formData).unwrap()
      console.log(res)
      setErrorMessage(null)
      
     } catch (error) {
       console.log("update error",error)
      
     }
  }
  const handleDelete=async()=>{
    try{
      await deleteUser().unwrap()
      console.log("account deleted")
      toast.info("account deleted")
      setTimeout(() => {
         navigate("/login")
      }, 1000);
     
    }catch(err){
      const e=err as FetchBaseQueryError
      const errorData=e.data as {message:string}
      setErrorMessage(errorData.message)
      console.log("delete error",err)
    }
  }

  const handleFileSelect = (file: File|null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setAvatar(file);
  };

  const handleFileInputChange = (e:ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files?.[0] ?? null);
  };

  const handleDrop = (e:DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer?.files?.[0] ?? null);
  };

  const handleDragOver = (e:DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-10 font-sans">
      <div className="max-w-3xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Picture Card */}
         <form onSubmit={profilFormik.handleSubmit}>
        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6 border border-[#2a2a2a]">
          <h2 className="text-base font-semibold text-white mb-5">Profile Picture</h2>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
           
            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleChooseFile}
              className={`
                relative shrink-0 w-40 h-40 rounded-full border-2 border-dashed cursor-pointer
                flex flex-col items-center justify-center gap-2 transition-colors duration-200
                ${isDragging
                  ? "border-purple-400 bg-purple-500/10"
                  : "border-[#3a3a3a] hover:border-purple-500 bg-[#111]"
                }
              `}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <>
                  <svg
                    className="w-7 h-7 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  <span className="text-xs text-gray-500 text-center leading-tight px-2">
                    Drop image here or click to upload
                  </span>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInputChange}
              />
            </div>

            {/* Right side text + button */}
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="text-base font-semibold text-white">Upload Your Photo</h3>
                <p className="text-sm text-gray-400 mt-1 max-w-xs leading-relaxed">
                  Drag and drop your profile picture or click to browse.
                  Recommended size: 400×400px
                </p>
              </div>
              <button type="button"
                onClick={handleChooseFile}
                className="
                  inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                  bg-purple-600 hover:bg-purple-500 active:bg-purple-700
                  text-white text-sm font-medium transition-colors duration-150
                  focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#1a1a1a]
                  w-fit
                "
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                Choose File
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
          <h2 className="text-base font-semibold text-white mb-6">Personal Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="userName"
                className="flex items-center gap-2 text-sm text-gray-300 font-medium"
              >
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                Full Name
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                value={profilFormik.values.userName}
                onChange={profilFormik.handleChange}
                onBlur={profilFormik.handleBlur}
                className="
                  w-full px-4 py-2.5 rounded-xl text-sm text-white
                  bg-[#111] border border-[#2a2a2a]
                  hover:border-[#3a3a3a] focus:border-purple-500
                  focus:outline-none focus:ring-1 focus:ring-purple-500
                  transition-colors duration-150 placeholder-gray-600
                  selection:bg-none autofill:bg-transparent
                "
              />
               {profilFormik.errors.userName && (
                <div
                  className="text-red-500"
                  style={{
                    color: "#ef4444",
                  }}
                >
                  {profilFormik.errors.userName}
                </div>
              )}
            </div>


          </div>
        </div>
                   {/* Password Change Section */}
<div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] mt-6">
  <h2 className="text-base font-semibold text-white mb-6">Change Password</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

    {/* Current Password */}
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-gray-300 font-medium">
        Current Password
      </label>
            <div className="flex justify-between w-full px-4 py-2.5 rounded-xl text-sm text-white
                  bg-[#111] border border-[#2a2a2a]
                  hover:border-[#3a3a3a] focus:border-purple-500
                  focus:outline-none focus:ring-1 focus:ring-purple-500
                  transition-colors duration-150 "> 
      <input
        name="currentPassword"
        type={showOldPassword?"text":"password"}
        value={profilFormik.values.currentPassword}
        onChange={profilFormik.handleChange}
        className="w-full  text-sm text-white placeholder-gray-600 focus:outline-0 selection:bg-none autofill:bg-transparent"
      />
      {profilFormik.errors.currentPassword && (
        <div
          className="text-red-500"
          style={{
            color: "#ef4444",
          }}
        >
          {profilFormik.errors.currentPassword}
        </div>
      )}
       <span onClick={()=>setShowOldPassword((prev)=>!prev)}>
        {showOldPassword ? (
        <EyeOff color="#3a3a3a"
          size={20}/>
      ):( <Eye
        size={20}/>)}</span>
      </div>
      
    </div>

    {/* New Password */}
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-gray-300 font-medium">
        New Password
      </label>
      <div className="flex justify-between w-full px-4 py-2.5 rounded-xl text-sm text-white
                  bg-[#111] border border-[#2a2a2a]
                  hover:border-[#3a3a3a] focus:border-purple-500
                  focus:outline-none focus:ring-1 focus:ring-purple-500
                  transition-colors duration-150 "> 
          <input
        name="newPassword"
        type={showPassword ? "text" : "password"}
        value={profilFormik.values.newPassword}
        onChange={profilFormik.handleChange}
        className="w-full  text-sm text-white placeholder-gray-600 focus:outline-0 selection:bg-none autofill:bg-transparent"
      />
      <span onClick={()=>setShowPassword((prev)=>!prev)}>
        {showPassword ? (
        <EyeOff color="#3a3a3a"
          size={20}/>
      ):( <Eye
        size={20}/>)}</span>
        </div>
      { profilFormik.errors.newPassword && (
        <div
          className="text-red-500"
          style={{
            color: "#ef4444",
          }}
        >
          {profilFormik.errors.newPassword}
        </div>
      )}
    
    </div>
  </div>
      <p className="text-md text-red-500 mt-8 text-center " >{errorMessage}</p>

</div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="
              inline-flex items-center gap-2 px-6 py-2.5 rounded-xl
              bg-purple-600 hover:bg-purple-500 active:bg-purple-700
              text-white text-sm font-medium transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#0f0f0f]
            "
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
              />
            </svg>
            {updateUserLoading?<CircularProgress/>:
            "Save Changes"}
          </button>
        </div>
        </form>
          {/* Danger Zone */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] mt-6">
          <h2 className="text-base font-semibold text-red-500 mb-6">Danger Zone</h2>
          <p className="text-sm text-gray-400 mb-4">
            Deleting your account is irreversible. All your data will be lost.
            Please proceed with caution.
          </p>
          <button
            onClick={()=>setOpen_confirm(true)}
            className="
            cursor-pointer
              inline-flex items-center gap-2 px-6 py-2.5 rounded-xl
              bg-red-600 hover:bg-red-500 active:bg-red-700
              text-white text-sm font-medium transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[#0f0f0f]
            "
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
            Delete Account
          </button>
        </div>
      </div>
      <ConfirmDialog open_confirm={open_confirm} handleClose={handleClose} handleDelete={handleDelete} isLoading={deleteLoading}/>
      <ToastContainer />
    </div>
  );
}
