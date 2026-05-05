import React from "react";
import { CheckSquare, ListTodo, TrendingUp } from "lucide-react";
import type { StatCardData } from "../Types/types";

interface StatCardProps {
  data: StatCardData;
}

const ICON_MAP: Record<
  StatCardData["iconType"],
  { icon: React.ElementType; bg: string; color: string }
> = {
  tasks: {
    icon: ListTodo,
    bg: "bg-purple-600/20",
    color: "text-purple-400",
  },
  completed: {
    icon: CheckSquare,
    bg: "bg-green-600/20",
    color: "text-green-400",
  },
  rate: {
    icon: TrendingUp,
    bg: "bg-pink-600/20",
    color: "text-pink-400",
  },
};

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const { icon: Icon, bg, color } = ICON_MAP[data.iconType];

  return (
    <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-3 hover:border-white/[0.12] hover:bg-[#1f1f1f] transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-gray-400 text-sm font-medium">{data.title}</span>
          <span className="text-white text-4xl font-bold tracking-tight">
            {data.value}
          </span>
        </div>
        <div
          className={`${bg} rounded-xl p-3 flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <span className="text-green-400 text-xs font-medium">{data.trend}</span>
    </div>
  );
};

export default StatCard;
