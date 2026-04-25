"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import { X, CalendarDays } from "lucide-react";
import type { addTask, TaskCardProps } from "../Types/TaskType";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { TaskType } from "../Types/TaskType";
import type { taskPriority } from "../Types/TaskType";
import type { taskStatus } from "../Types/TaskType";
import { useCreateTaskMutation, useUpdateTaskMutation } from "../API/slices/TaskSlice";
import { useEffect, useState } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
const taskSchema = Yup.object({
  title: Yup.string().required("title is required"),
  description: Yup.string().required("title is required"),
  dueDate: Yup.date().min(new Date(), "Date must be in the future"),
});

export default function AddEditTaskModal({ open, onClose,edit,old_task }: addTask) {
  const[createTask, {isLoading}]=useCreateTaskMutation();
  const [updateTask, {isLoading:updateLoading}]=useUpdateTaskMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const onAdd =async (values: TaskType) => {
    console.log("type of date",typeof values.dueDate)
    console.log(" date", values.dueDate)
  try{
    await createTask(values).unwrap()
       handleCancel();
  }catch(err){
    console.log("adding error",err)
    const error=err as FetchBaseQueryError
    const errorData = error.data as { message: string };
    setErrorMessage(errorData.message)
  }

};
const onUpdate =async (values: TaskCardProps) => {
  console.log("updating task",values)
  try{
    await updateTask(values).unwrap()
    handleCancel();
  }catch(err){
    console.log("updating error",err)
    console.log("adding error",err)
    const error=err as FetchBaseQueryError
    const errorData = error.data as { message: string };
    setErrorMessage(errorData.message)
  }
   
}
 const taskForm = useFormik({
    initialValues: {
      title: "",
      description: "",
      status: "Not Started",
      dueDate: "",
      priority: "Low",
    },
    validationSchema: taskSchema,
    onSubmit: (values) => {
      const priority = values.priority as taskPriority;
      const status = values.status as taskStatus;
      console.log("priority", priority, "status", status);
      if(edit){
        onUpdate({ ...values,dueDate:new Date(values.dueDate).toISOString(), priority, status,id:old_task!.id });
      }
      else
      onAdd({ ...values,dueDate:new Date(values.dueDate).toISOString(), priority, status });
    },
  });
useEffect(() => {
  if (edit && old_task) {
    taskForm.setValues({
      ...old_task,
      dueDate: old_task.dueDate
        ? new Date(old_task.dueDate).toISOString().split("T")[0]
        : "",
    });
  }
  //eslint-disable-next-line
}, [edit]);
 

  const handleCancel = () => {
    if(edit){
    taskForm.setValues({
      ...old_task!,
      dueDate: old_task?.dueDate
        ? new Date(old_task.dueDate).toISOString().split("T")[0]
        : "",
    });
    // setEdit(false);
    }
    else{
          taskForm.resetForm();

    }
    setErrorMessage(null);
    onClose();
  };

  return (
    <>
    {    console.log("dueDate:old_task!.dueDate",old_task?.dueDate.toString().split("T")[0])
}
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          padding: "0",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
          // Background color for the main dialog paper
          backgroundColor: "#161618",
          backgroundImage: "none",
          borderRadius: "12px",
        },
      }}
    >
      {/* ── Header ── */}
      <DialogTitle
        className="flex items-center justify-between"
        sx={{ pb: 1, px: 3, pt: 2.5 }}
      >
        <span
          style={{
            fontSize: "1.35rem",
            fontWeight: 700,
            // Main title text color
            color: "#FFFFFF",
            letterSpacing: "-0.3px",
          }}
        >
          Add New Task
        </span>
        <IconButton
          onClick={handleCancel}
          size="small"
          sx={{
            // "X" close icon color
            color: "#999999",
            backgroundColor: "transparent",
            "&:hover": { backgroundColor: "#2A2A2A", color: "#fff" },
          }}
        >
          <X size={16} />
        </IconButton>
      </DialogTitle>

      {/* ── Body ── */}
      <DialogContent
        sx={{ px: 3, py: 1.5, display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        {/* Title */}
        <form onSubmit={taskForm.handleSubmit} id="addTaskForm">
          <div>
            <label
              htmlFor="title"
              className="block mb-1.5 text-sm font-semibold text-gray-200"
              style={{
                // Field label color
                color: "#FFFFFF",
              }}
            >
              Title
            </label>
            <TextField
              id="title"
              fullWidth
              name="title"
              placeholder="Enter task title"
              value={taskForm.values.title}
              onChange={taskForm.handleChange}
              onBlur={taskForm.handleBlur}
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  // Input field styles
                  color: "#FFFFFF",
                  backgroundColor: "#222224",
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#a78bfa",
                  },
                },
              }}
              slotProps={{
                input: {
                  style: {
                    fontSize: "0.9rem",
                    color: "#FFFFFF",
                  },
                  // Placeholder text color
                  className: "placeholder:text-[#999999]",
                },
              }}
            />
            {taskForm.errors.title && (
              <div
                className="text-red-500"
                style={{
                  color: "#ef4444",
                }}
              >
                {taskForm.errors.title}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block mb-1.5 text-sm font-semibold text-gray-200"
              style={{
                color: "#FFFFFF",
              }}
            >
              Description
            </label>
            <TextField
              id="description"
              name="description"
              fullWidth
              placeholder="Enter task description"
              value={taskForm.values.description}
              onChange={taskForm.handleChange}
              variant="outlined"
              multiline
              rows={4}
              sx={{
                "& .MuiOutlinedInput-root": {
                  // Input field styles
                  color: "#FFFFFF",
                  backgroundColor: "#222224",
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#a78bfa",
                  },
                },
              }}
              slotProps={{
                input: {
                  style: {
                    fontSize: "0.9rem",
                    color: "#FFFFFF",
                  },
                  // Placeholder text color
                  className: "placeholder:text-[#999999]",
                },
              }}
            />
            {taskForm.errors.description && (
              <div
                className="text-red-500"
                style={{
                  color: "#ef4444",
                }}
              >
                {taskForm.errors.description}
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block mb-1.5 text-sm font-semibold text-gray-200"
              style={{
                color: "#FFFFFF",
              }}
            >
              Status
            </label>
            <Select
              id="status"
              name="status"
              fullWidth
              value={taskForm.values.status}
              onChange={taskForm.handleChange}
              sx={{
                // Select input styles
                color: "#FFFFFF",
                backgroundColor: "#222224",
                borderRadius: "8px",
                height: "40px",
                fontSize: "0.9rem",
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover fieldset": {
                  borderColor: "transparent",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#a78bfa",
                },
                "& .MuiSelect-icon": {
                  // Dropdown arrow icon color
                  color: "#999999",
                },
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    // Styles for the dropdown menu paper
                    backgroundColor: "#1D1D1F",
                    color: "#FFFFFF",
                  },
                },
              }}
            >
              <MenuItem value="Not Started">Not Started</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </div>

          {/* Due Date */}
          <div>
            <label
              htmlFor="dueDate"
              className="block mb-1.5 text-sm font-semibold text-gray-200"
              style={{
                color: "#FFFFFF",
              }}
            >
              Due Date
            </label>
            <TextField
              id="dueDate"
              name="dueDate"
              fullWidth
              type="date"
              value={taskForm.values.dueDate}
              onChange={taskForm.handleChange}
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  // Input field styles
                  color: "#FFFFFF",
                  backgroundColor: "#222224",
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#a78bfa",
                  },
                },
              }}
              slotProps={{
                input: {
                  style: {
                    color: "#FFFFFF",
                  },
                  endAdornment: (
                    <CalendarDays
                      size={16}
                      className="text-gray-400 mr-1"
                      style={{
                        // Calendar icon color
                        color: "#999999",
                      }}
                    />
                  ),
                },
                inputLabel: {
                  shrink: true,
                },
              }}
            />
            {taskForm.errors.dueDate && (
              <div
                className="text-red-500"
                style={{
                  color: "#ef4444",
                }}
              >
                {taskForm.errors.dueDate}
              </div>
            )}
          </div>

          {/* priority */}
          <div>
            <label
              htmlFor="priority"
              className="block mb-1.5 text-sm font-semibold text-gray-200"
              style={{
                color: "#FFFFFF",
              }}
            >
              Priority
            </label>
            <Select
              id="priority"
              name="priority"
              fullWidth
              value={taskForm.values.priority}
              onChange={taskForm.handleChange}
              sx={{
                // Select input styles
                color: "#FFFFFF",
                backgroundColor: "#222224",
                borderRadius: "8px",
                height: "40px",
                fontSize: "0.9rem",
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover fieldset": {
                  borderColor: "transparent",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#a78bfa",
                },
                "& .MuiSelect-icon": {
                  // Dropdown arrow icon color
                  color: "#999999",
                },
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    // Styles for the dropdown menu paper
                    backgroundColor: "#1D1D1F",
                    color: "#FFFFFF",
                  },
                },
              }}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </div>
        </form>
      </DialogContent>

      {/* ── Footer ── */}
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1.5 }}>
        <Button onClick={handleCancel}  fullWidth variant="contained"
                    sx={{
            borderRadius: "10px",
            // Cancel button text and border color
            borderColor: "transparent",
            color: "#FFFFFF",
            // Cancel button background color
            backgroundColor: "#222224",
            fontWeight: 600,
            py: 1.3,
            "&:hover": {
              borderColor: "transparent",
              backgroundColor: "#2A2A2E",
            },
          }}
        >
          Cancel
        </Button>
        <Button
        type={isLoading ? "button" : "submit"} form="addTaskForm"
          fullWidth
          variant="contained"
          sx={{
            borderRadius: "10px",
            // Add Task button text color
            color: "#FFFFFF",
            // Add Task button solid background color
            backgroundColor: "#A78BFA",
            fontWeight: 700,
            py: 1.3,
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#BBABFB",
              boxShadow: "none",
            },
          }}
        >
  
          {edit===false&&(isLoading?<CircularProgress size={20} color="secondary"/>:"Add Task")}
          {edit===true&&(updateLoading?<CircularProgress size={20} color="secondary"/>:"Update Task")}
         
          
        </Button>
      </DialogActions>
      {errorMessage && (
        <div
          className="text-red-500 text-center pb-6"
          style={{
            color: "#ef4444",
          }}
        >
          {errorMessage}
        </div>
      )}
    </Dialog></>
  );
}