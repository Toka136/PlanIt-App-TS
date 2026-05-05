import { NavLink } from "react-router-dom";
import type { NavButtonProps } from "../../Types/TaskType";

export const   NavButton = ({ item, onClick }: NavButtonProps) => (
  <NavLink
    to={item.to}
    onClick={onClick}
      
    className={({ isActive }) =>
    [
    "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200", 
      isActive
          ? "text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)] bg-linear-120 from-[#7c3aed] to-[#6d28d9]"
          : "text-gray-400 hover:bg-white/5 hover:text-gray-300 bg-transparent"
    
        ].join(" ")
    }

  >
    <span className="flex items-center opacity-80">{item.icon}</span>
    <span>{item.label}</span>
  </NavLink>
);
