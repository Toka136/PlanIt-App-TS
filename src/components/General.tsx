import { Routes,Route } from "react-router-dom"
import Dashboard from "./Dashboard"
import SidebarTasks from "./Sidebar"
import AnalyticsPage from "./Analytics"
import ProfileSettings from "./Profile"

function General(){
    return(
        <div className="grid grid-cols-[100%] lg:grid-cols-[20%_80%]  gap-0 bg-[#0f0f0f] ">
            <SidebarTasks />
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/stats" element={<AnalyticsPage />} />
              <Route path="/profile" element={<ProfileSettings />} />
              </Routes>
        </div>
    )
}
export default General