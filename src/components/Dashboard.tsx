
import { 

  Search, 
  Plus,
} from 'lucide-react';
import TaskCard from './TaskCard';
import { useGetTasksQuery } from '../API/slices/TaskSlice';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import type { paginationType } from '../Types/TaskType';
import AddEditTaskModal from './AddTask';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function BasicPagination({count,onPageChange}:paginationType) {
  return (
    <Stack spacing={2} color={"white"} className=' items-center flex'>
      <Pagination count={count} onChange={(_,page)=>onPageChange(page)} 
      sx={{
    '& .MuiPaginationItem-root': {
      color: '#fff', // Normal state color
    },
    '& .Mui-selected': {
      backgroundColor: '#712DDF !important', // Active background
      color: '#fff !important', // Active text color
    },
    '& .MuiPaginationItem-root:hover': {
      backgroundColor: '#712DDF', // Hover state
    },
  }} />
     
    </Stack>
  );
}

function Dashboard  () {
  const [openModel, setOpenModel]=useState<boolean>(false)
  const[edit,setEdit]=useState<boolean>(false)
    const [page,setPage]=useState<number>(1)
    const[filterText,setFilterText]=useState<string>("All")
    const[searchText,setSearchText]=useState<string>("")
  const{data,isLoading,isError,error}=useGetTasksQuery({limit:3,page,status:filterText,search:searchText})
//   const filteredTasks = useMemo(() =>{
//     console.log("data",data?.data);
//  return data?.data?.filter(task => {
//   console.log("taskone",task);
//   if (searchText === "") {
//     return true;
//   }

//   const matchesSearch =
//     task.title.toLowerCase().includes(searchText.toLowerCase());
 

//   return matchesSearch })
// },[searchText,filterText,data]);
  useEffect(()=>{
    if(error){
      console.log(error)
     
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isError])
  // useEffect(()=>{
  //   if(!isLoading&&data){
  //     console.log("data.data",data.data)
  //     setTasks(data!.data)
  //     setStopLoad(true)
  //   }
  // },[isLoading,data])
  
  return (
    <>
    {isLoading?<div className='flex justify-center items-center h-full'>
      <CircularProgress />
    </div>:

    <div className="flex h-auto bg-[#0a0a0a] text-white font-sans">
      
        <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex flex-wrap items-center md:px-8 gap-4 md:gap-0  justify-between px-14 py-4 border-b border-gray-800">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              onChange={(e)=>setSearchText(e.target.value as string)}
              placeholder="Search tasks..." 
              className="w-full bg-[#1e1e1e] rounded-xl py-2 pl-10 pr-4 text-sm outline-none border border-transparent focus:border-gray-700"
            />
          </div>
          <p className="text-gray-400 text-sm">{new Date().toDateString()}</p>
        </header>
              {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-1">My Tasks</h2>
          <p className="text-gray-500 mb-8">Manage and track your tasks efficiently</p>

          {/* Filters Bar */}
          <div className="flex flex-wrap gap-6 mb-8 items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Status:</span>
              <select onChange={(e)=>setFilterText(e.target.value as string)} className="bg-[#1e1e1e] px-4 py-2 rounded-xl text-white flex items-center gap-2 border border-gray-800">
                <option value={"All"}  defaultChecked={true} className='text-white'>
                   All Tasks
                </option>
                <option value="Not Started" className='text-white'>
                   Not Started 
                </option>
                <option value="In Progress" className='text-white'>
                   In Progress 
                </option>
                <option value="Completed" className='text-white'>
                   Completed
                </option>
              </select>
            </div>
         
          </div>

          {/* Task Cards Grid */}
          {data?.count===0&&<div className="flex justify-center items-center h-full">
            <h2 className="text-3xl font-bold mb-1 text-white">No Tasks Found</h2>
          </div>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-8">
            {data?.data?.map((task)=>
            <TaskCard key={task._id} title={task.title} status={task.status} priority={task.priority} description={task.description} dueDate={task.dueDate}  id={task._id}/>)}
           
          </div>
        </div>
         {data?.count!==0&&
      <BasicPagination count={+(data!.pages)} onPageChange={(page: number) => setPage(page)}/>}
      </main>

      {/* Floating Action Button */}
      <button onClick={()=>{setOpenModel(true);setEdit(false)}} className="fixed bottom-8 right-8 bg-[#8B5CF6] p-4 rounded-full shadow-lg shadow-purple-500/20 hover:scale-110 transition-transform">
        <Plus className="text-white w-6 h-6" />
      </button>
    </div>
    }
    <AddEditTaskModal open={openModel} onClose={()=>setOpenModel(false)} edit={edit}  />
    </>
     
  );
};

// Sub-component for clean cards


export default Dashboard;