export type taskStatus = "In Progress" | "Completed" | "Not Started";
export type taskPriority = "Low" | "Medium" | "High";

export interface TaskCardProps {
  title: string;
  id: string;
  description: string;
  dueDate: string;
  status: taskStatus;
  priority: taskPriority;
}
export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: Date;
  owner: string;
  status: taskStatus;
  priority: taskPriority;
}
export interface ResponseTask{
  status: string,
  count: number,
  page: number,
  limit: number,
  pages: number,
  data: Task[]
}
export interface RequestTask{
  limit: number,
  page: number,
  status?:string,
  search?:string
}
export type addTask={
  open:boolean,
  edit:boolean,
  old_task?:TaskCardProps,
  onClose:()=>void,
  setEdit?:(edit:boolean)=>void
}
export interface TaskDelete{
  status:string,
  data:string
}
export interface TaskType{
  title:string,
  description:string,
  dueDate:string,
  priority:taskPriority,
  status:taskStatus
}
export interface confirmDeleteType{
  id:string,
   open_confirm: boolean,
   handleClose: () => void, 
   handleDelete: (id: string) => void ,
   isLoading?:boolean
}

export interface StatsType{
    _id: string,
    count: number,
    inprogressCount: number,
    notStartCount: number,
    completedCount: number,
}
export interface StatsResponse{
    status: string,
    data: StatsType
}
export interface TaskStat extends Task {
  diffInDays: number;  
  relativeTime: string;
}

export interface StatCardData {
  title: string;
  value: string | number;
  iconType: "tasks" | "completed" | "rate";
}

export interface TaskCDResponse{
  status:string,
  data:TaskStat[]
}
export type paginationType={
  count: number,
 onPageChange: ( page: number) => void,
 page: number
}