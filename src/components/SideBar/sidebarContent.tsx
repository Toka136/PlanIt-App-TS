import { SquareCheckBig } from "lucide-react";
import type { SidebarContentProps } from "../../Types/TaskType";
import { NavButton } from "./NavButton";
import { Divider } from "@mui/material";
import UserCard from "./UserCard";
import { LogoutButton } from "./logoutButton";
import { NAV_ITEMS } from "../../constantData/NavItems";

export const SidebarContent = ({ data, onNavClick, onLogout }: SidebarContentProps) => (
  <div
    className="flex flex-col h-full py-6 px-4"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >
    {/* Logo */}
    <div className="flex items-center gap-3 px-2 mb-8">
      <div
        className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
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