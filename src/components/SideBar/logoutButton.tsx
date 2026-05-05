import { LogOut } from "lucide-react";
import type { LogoutButtonProps } from "../../Types/TaskType";

export const LogoutButton = ({ onClick }: LogoutButtonProps) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-gray-500 border hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
    style={{ borderColor: "rgba(255,255,255,0.09)" }}
  >
    <LogOut size={15} />
    Logout
  </button>
);