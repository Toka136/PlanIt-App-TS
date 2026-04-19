import React from "react";
import DoughnutChart from "./DoughnutChart";
import TaskCard from "./TaskCardDate";
import StatCard from "./StatCard";
import type{ StatCardData } from "../Types/TaskType";
import { useGetTasksCDQuery, useGetTasksStatsQuery } from "../API/slices/TaskSlice";
import { CircularProgress } from "@mui/material";

const AnalyticsPage: React.FC = () => {
      const {data,isLoading} = useGetTasksStatsQuery()
      const {data:TasksCD,isLoading:TasksCDLoading} = useGetTasksCDQuery()
       {console.log("dataAnalytics",data)}
      const Completed = data?data.data.completedCount:0;
      const total=data?data.data.count:0;
      const CompletedP=((Completed/total)*100).toFixed(2)
      const STAT_CARDS:StatCardData[]=[
        {
          title: "Total Tasks",
          value: total,
          iconType: "tasks",  
      },
      {
        title: "Completed Tasks",
        value: `${Completed}`,
        iconType: "completed",
      },
      {
        title: "Completion Rate",
        value: `${CompletedP}%`,
        iconType: "rate",
      }]
  return (

    <>
    {console.log("TasksCD",TasksCD)}
    {isLoading||TasksCDLoading?
    <div className="flex justify-center items-center ">
    <CircularProgress color="secondary"/>
    </div>:<div className="min-h-screen bg-[#111111] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Analytics
          </h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">
            Track your productivity and task completion
          </p>
        </div>

        {/* Main 2-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

          {/* Left: Doughnut Chart */}
          <DoughnutChart />

          {/* Right: Close Due Date */}
          <div className="bg-[#1a1a1a] border border-white/6 rounded-2xl p-6 flex flex-col gap-4 h-fit">
            <h2 className="text-white text-lg font-semibold tracking-tight">
              Close Due Date
            </h2>
            {TasksCD?.data.length===0?
            <div className="flex justify-center items-center">
            <p className="text-gray-400 text-2xl  h-full">No Urgent Tasks</p>
            </div>
            :<div className="flex flex-col gap-3">
              {TasksCD?.data.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
            }
          </div>
        </div>

        {/* Bottom stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {STAT_CARDS.map((card) => (
            <StatCard key={card.title} data={card} />
          ))}
        </div>

      </div>
    </div>}
    </>
  );
};

export default AnalyticsPage;