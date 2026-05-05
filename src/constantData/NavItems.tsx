import type { NavItem } from "../Types/TaskType"
import {  LayoutGrid, BarChart2, User } from "lucide-react";

export const NAV_ITEMS: NavItem[] = [
  { label: "Tasks",icon:<LayoutGrid size={16}/>, to: "/dashboard" },
  { label: "Analytics", icon: <BarChart2 size={16} />, to: "/stats" },
  { label: "Profile", icon: <User size={16} />, to: "/profile" },
];