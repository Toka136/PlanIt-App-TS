
import { useEffect, useRef, useState } from "react";
import {  CircularProgress } from "@mui/material";
import {  Menu, X } from "lucide-react";
import { useLogOutMutation } from "../../API/slices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoggedIn } from "../../API/slices/UserStatusslice";
import { useGetUserQuery } from "../../API/slices/UserSlics";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { UserStatusState } from "../../Types/AuthTypes";
import { SidebarContent } from "./sidebarContent";
const SidebarTasks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, error,refetch } = useGetUserQuery();
  const [logout] = useLogOutMutation();
  const dispatch = useDispatch();
  const userStatus=useSelector((state:UserStatusState)=>state.UserStatus.isLoggedIn)
  useEffect(()=>{
    if(userStatus)
    refetch()
  },[userStatus])
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(setIsLoggedIn(false));
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const closeSidebar = () => setIsOpen(false);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        closeSidebar();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isError) console.error("User fetch error:", error);
    const error_res=error as FetchBaseQueryError
    const errorData = error_res?.data as { message: string };
    if (errorData && errorData.message === "refresh token expired") {
      handleLogout();
    }
  
  }, [isError, error]);

  const sidebarStyle: React.CSSProperties = {
    background: "linear-gradient(180deg, #111118 0%, #0e0e15 100%)",
    borderRight: "1px solid rgba(255,255,255,0.06)",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-64" style={sidebarStyle}>
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <>
      {/* ── Hamburger toggle (visible only on small screens) ── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed top-4 left-4 z-50 flex items-center justify-center w-9 h-9 rounded-lg md:hidden text-gray-300 hover:text-white transition-colors"
        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* ── Backdrop (mobile only) ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar: desktop = static, mobile = slide-in overlay ── */}
      <div
        ref={sidebarRef}
        className={
          `fixed top-0 left-0 z-40 h-auto h-min-screen   overflow-y-scroll w-64 transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:z-auto md:h-auto md:min-h-screen
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`
        }
        style={sidebarStyle}
      >
        <SidebarContent
          data={data}
          onNavClick={closeSidebar}
          onLogout={handleLogout}
        />
      </div>
    </>
  );
};

export default SidebarTasks;
