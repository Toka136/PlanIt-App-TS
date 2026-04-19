import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useGetTasksStatsQuery } from "../API/slices/TaskSlice";

ChartJS.register(ArcElement, Tooltip, Legend);
const OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  cutout: "62%",
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: { label: string; parsed: number }) =>
          ` ${ctx.label}: ${ctx.parsed}%`,
      },
    },
  },
};


const DoughnutChart: React.FC = () => {
    const {data,isLoading} = useGetTasksStatsQuery()
    const InProgress = data?data.data.inprogressCount:0;
    const Completed = data?data.data.completedCount:0;
    const NotStarted = data?data.data.notStartCount:0;
    const total=data?data.data.count:0;
    const InProgressP=((InProgress/total)*100).toFixed(2)
    const CompletedP=((Completed/total)*100).toFixed(2)
    const NotStartedP=((NotStarted/total)*100).toFixed(2)
    const LEGEND_ITEMS = [
  { label: "Completed", color: "#22c55e", pct:  Completed  },
  { label: "In Progress", color: "#a855f7", pct:  InProgress },
  { label: "Not Started", color: "#f59e0b", pct:  NotStarted },
];

    const CHART_DATA = {
  labels: ["Completed", "In Progress", "Not Started"],
  datasets: [
    {
      data: [CompletedP, InProgressP, NotStartedP],
      backgroundColor: ["#22c55e", "#a855f7", "#f59e0b"],
      borderColor: ["#16a34a", "#9333ea", "#d97706"],
      borderWidth: 2,
      hoverOffset: 6,
    },
  ],
};
  return (

   <>
   {!isLoading&&
    <div className="bg-[#1a1a1a] border border-white/6 rounded-2xl p-6 flex flex-col gap-6">
      <h2 className="text-white text-lg font-semibold tracking-tight">
        Task Completion Overview
      </h2>
      {/* Chart */}
      <div className="flex justify-center items-center">
        <div className="w-52 h-52 sm:w-60 sm:h-60">
          <Doughnut data={CHART_DATA} options={OPTIONS} />
        </div>
      </div>

      {/* Chart Label Bar */}
      <div className="flex justify-center gap-5 text-sm">
        {LEGEND_ITEMS.map(({ label, color }) => (
          <span key={label} className="flex items-center gap-1.5 text-gray-400">
            <span
              className="w-3 h-3 rounded-sm inline-block shrink-0"
              style={{ backgroundColor: color }}
            />
            {label}
          </span>
        ))}
      </div>

      {/* Percentage Stats */}
      <div className="grid grid-cols-3 gap-3 mt-1">
        {LEGEND_ITEMS.map(({ label, color, pct }) => (
          <div
            key={label}
            className="bg-white/4 rounded-xl p-3 flex flex-col items-center gap-1"
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-gray-400 text-xs text-center">{label}</span>
            <span className="text-white text-xl font-bold">{pct}</span>
          </div>
        ))}
      </div>
    </div>}
   </>
  );
};

export default DoughnutChart;
