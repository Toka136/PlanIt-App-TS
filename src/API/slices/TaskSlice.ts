import { createApi } from "@reduxjs/toolkit/query/react";
import type { ResponseTask, Task, TaskType, TaskDelete, TaskCardProps, StatsResponse, TaskCDResponse, RequestTask } from "../../Types/TaskType";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

export const TaskSlice=createApi({
    reducerPath: "task",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Task"],
    endpoints: (builder) => ({
        getTasks: builder.query<ResponseTask, RequestTask>({
            query: ({limit, page}) => `tasks/?limit=${limit}&page=${page}`,
            providesTags: ["Task"],
        }),
        createTask: builder.mutation<Task, TaskType>({
            query: (task) => ({
                url: "tasks/create",
                method: "POST",
                body: task,
            }),
            invalidatesTags: ["Task"],
        }),
        updateTask: builder.mutation<Task, TaskCardProps>({
            query: (task) => ({
                url: `tasks/${task.id}`,
                method: "PATCH",
                body: task,
            }),
            invalidatesTags: ["Task"],
        }),
        deleteTask: builder.mutation<TaskDelete, string>({
            query: (id) => ({
                url: `tasks/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Task"],
        }),
        getTasksStats: builder.query<StatsResponse, void>({
            query: () => "tasks/stats",
            providesTags: ["Task"],
        }),
        getTasksCD: builder.query<TaskCDResponse, void>({
            query: () => "tasks/closeDate",
            providesTags: ["Task"],
        }),
    }),
})

export const {useCreateTaskMutation,useGetTasksQuery,useDeleteTaskMutation,useUpdateTaskMutation,useGetTasksStatsQuery,useGetTasksCDQuery}=TaskSlice