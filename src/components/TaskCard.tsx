import  { useState, useRef, useEffect } from "react";
import { Calendar, Zap, SquarePen, Trash2, MoreVertical } from "lucide-react";
import type { TaskCardProps, taskPriority, taskStatus ,confirmDeleteType} from "../Types/TaskType";
import { useDeleteTaskMutation } from '../API/slices/TaskSlice';

import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import AddEditTaskModal from "./AddTask";


const statusStyles: Record<taskStatus, { bg: string; text: string; border: string }> = {
  "In Progress": {
    bg: "rgba(124, 58, 237, 0.15)",
    text: "#a78bfa",
    border: "rgba(124, 58, 237, 0.3)",
  },
  "Completed": {
    bg: "rgba(16, 185, 129, 0.12)",
    text: "#34d399",
    border: "rgba(16, 185, 129, 0.3)",
  },
  "Not Started": {
    bg: "rgba(99, 102, 241, 0.12)",
    text: "#818cf8",
    border: "rgba(99, 102, 241, 0.3)",
  },
};

const priorityStyles: Record<taskPriority, { bg: string; text: string; border: string }> = {
  Low: {
    bg: "rgba(59, 130, 246, 0.15)",
    text: "#60a5fa",
    border: "rgba(59, 130, 246, 0.3)",
  },
  Medium: {
    bg: "rgba(180, 120, 20, 0.25)",
    text: "#fbbf24",
    border: "rgba(251, 191, 36, 0.25)",
  },
  High: {
    bg: "rgba(239, 68, 68, 0.12)",
    text: "#f87171",
    border: "rgba(239, 68, 68, 0.25)",
  },
};

function TaskCard(task: TaskCardProps) {
  console.log("task", task);
  const { id, title, description, dueDate, status, priority } = task;
  const [menuOpen, setMenuOpen] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [open_confirm, setOpen_confirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
    const[deleteTask,{isLoading:isDeleting}]=useDeleteTaskMutation()
   const onDelete= async(id:string)=>{
       try{
         const res =await deleteTask(id).unwrap()
         console.log("delete res",res)
       }catch(err){
         console.log(err)
       }
     }
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const s = statusStyles[status];
  const p = priorityStyles[priority];

  return (
    <div
      className="relative w-full rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: "#18181f",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Top Row */}
      <div className="flex items-center justify-between">
        {/* Status Badge */}
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{
            background: s.bg,
            color: s.text,
            border: `1px solid ${s.border}`,
            letterSpacing: "0.01em",
          }}
        >
          {status}
        </span>

        {/* Kebab Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150"
            style={{
              background: menuOpen ? "rgba(255,255,255,0.08)" : "transparent",
              color: "#6b7280",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLButtonElement).style.color = "#d1d5db";
            }}
            onMouseLeave={(e) => {
              if (!menuOpen) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
              }
            }}
          >
            <MoreVertical size={16} />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div
              className="absolute right-0 top-10 z-50 rounded-xl overflow-hidden flex flex-col"
              style={{
                background: "#1e1e28",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
                minWidth: "130px",
                animation: "fadeIn 0.12s ease",
              }}
            >
              <button
                onClick={() => { setMenuOpen(false); setEditForm(true); }}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-150"
                style={{
                  color: "#e5e7eb",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.06)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "transparent")
                }
              >
                <SquarePen size={15} style={{ color: "#9ca3af" }} />
                Edit
              </button>

              <button
                onClick={() => { setOpen_confirm(true); }}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-150"
                style={{
                  color: "#f87171",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(239,68,68,0.08)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "transparent")
                }
              >
               <div className="flex items-center gap-3"><Trash2 size={15} />Delete
                  </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <div className="flex flex-col gap-2">
        <h3
          className="text-base font-bold leading-snug"
          style={{ color: "#f3f4f6", letterSpacing: "-0.01em" }}
        >
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
          {description}
        </p>
      </div>

      {/* Footer Meta */}
      <div className="flex items-center gap-4 pt-1">
        {/* Date */}
        <div className="flex items-center gap-1.5" style={{ color: "#6b7280" }}>
          <Calendar size={13} />
          <span className="text-xs font-medium">{dueDate.split("T")[0]}</span>
        </div>

        {/* Priority Badge */}
        <span
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
          style={{
            background: p.bg,
            color: p.text,
            border: `1px solid ${p.border}`,
          }}
        >
          <Zap size={11} fill={p.text} />
          {priority}
        </span>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <ConfirmDialog open_confirm={open_confirm} handleClose={()=>setOpen_confirm(false)} handleDelete={onDelete} id={id} isLoading={isDeleting}/>
   <AddEditTaskModal open={editForm} onClose={() => { setEditForm(false); }} edit={true} old_task={task} />
    </div>
  );
};
 const ConfirmDialog = ({ open_confirm, handleClose, handleDelete,id,isLoading }: confirmDeleteType) =>{
  return <Dialog
  slotProps={{ paper: { style: { background: "#0A0A0A" ,textAlign:"center",color:"white"} }}}
        open={open_confirm}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="text-white">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ color: '#9CA3AF' }}>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={()=>handleDelete(id)} 
            color="error" 
            variant="contained" 
            autoFocus
          >
            {isLoading?<div className="flex justify-center items-center"><CircularProgress color="inherit" /></div>:
           <div>Delete</div> }
          </Button>
        </DialogActions>
      </Dialog>}
export default TaskCard;