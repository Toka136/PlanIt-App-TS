
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Divider, CircularProgress } from "@mui/material";
import { SquareCheckBig, LayoutGrid, BarChart2, LogOut, Menu, X, User } from "lucide-react";
import { useLogOutMutation } from "../API/slices/AuthSlice";
import { useDispatch } from "react-redux";
import { setIsLoggedIn } from "../API/slices/UserStatusslice";
import { useGetUserQuery } from "../API/slices/UserSlics";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: "Tasks", icon: <LayoutGrid size={16} />, to: "/dashboard" },
  { label: "Analytics", icon: <BarChart2 size={16} />, to: "/stats" },
  { label: "Profile", icon: <User size={16} />, to: "/profile" },
];

const BASE_URL = "http://localhost:4000/uploads";

// ─── Sub-components ───────────────────────────────────────────────────────────

interface NavButtonProps {
  item: NavItem;
  onClick?: () => void;
}

const NavButton = ({ item, onClick }: NavButtonProps) => (
  <NavLink
    to={item.to}
    onClick={onClick}
    className={({ isActive }) =>
      [
        "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
        isActive
          ? "text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)]"
          : "text-gray-400 hover:bg-white/5 hover:text-gray-300",
      ].join(" ")
    }
    style={({ isActive }) => ({
      background: isActive
        ? "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
        : "transparent",
    })}
  >
    <span className="flex items-center opacity-80">{item.icon}</span>
    <span>{item.label}</span>
  </NavLink>
);

interface UserCardProps {
  avatar?: string;
  userName?: string;
  email?: string;
}

const UserCard = ({ avatar, userName, email }: UserCardProps) => (
  <div
    className="flex items-center gap-3 px-3 py-3 rounded-xl"
    style={{
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    <img
      src={avatar ? `${BASE_URL}/${avatar}` : `${BASE_URL}/defualt.webp`}
      alt="User Avatar"
      className="w-10 h-10 rounded-full object-cover shrink-0"
    />
    <div className="flex flex-col min-w-0">
      <span className="text-sm font-semibold truncate text-gray-100">
        {userName}
      </span>
      <span className="text-xs truncate text-gray-500">{email}</span>
    </div>
  </div>
);

interface LogoutButtonProps {
  onClick: () => void;
}

const LogoutButton = ({ onClick }: LogoutButtonProps) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-gray-500 border hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
    style={{ borderColor: "rgba(255,255,255,0.09)" }}
  >
    <LogOut size={15} />
    Logout
  </button>
);

// ─── Sidebar Content ──────────────────────────────────────────────────────────

interface SidebarContentProps {
  data: { data: { avatar?: string; userName?: string; email?: string } } | undefined;
  onNavClick: () => void;
  onLogout: () => void;
}

const SidebarContent = ({ data, onNavClick, onLogout }: SidebarContentProps) => (
  <div
    className="flex flex-col h-full py-6 px-4"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >
    {/* Logo */}
    <div className="flex items-center gap-3 px-2 mb-8">
      <div
        className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
          boxShadow: "0 4px 14px rgba(124, 58, 237, 0.4)",
        }}
      >
        <SquareCheckBig size={18} color="#fff" />
      </div>
      <span
        className="text-xl font-bold tracking-tight"
        style={{ color: "#f1f0ff", letterSpacing: "-0.02em" }}
      >
        TaskFlow
      </span>
    </div>

    {/* Navigation */}
    <nav className="flex flex-col gap-1 flex-1">
      {NAV_ITEMS.map((item) => (
        <NavButton key={item.label} item={item} onClick={onNavClick} />
      ))}
    </nav>

    {/* Footer */}
    <div className="flex flex-col gap-3">
      <Divider sx={{ borderColor: "rgba(255,255,255,0.07)" }} />
      <UserCard
        avatar={data?.data.avatar}
        userName={data?.data.userName}
        email={data?.data.email}
      />
      <LogoutButton onClick={onLogout} />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const SidebarTasks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, error } = useGetUserQuery();
  const [logout] = useLogOutMutation();
  const dispatch = useDispatch();

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
        className={[
          "fixed top-0 left-0 z-40 h-auto h-min-screen   overflow-y-scroll w-64 transition-transform duration-300 ease-in-out",
          "md:static md:translate-x-0 md:z-auto md:h-auto md:min-h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
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
