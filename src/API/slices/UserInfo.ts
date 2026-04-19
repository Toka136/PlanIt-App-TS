import { createSlice } from "@reduxjs/toolkit";

const UserInfo=createSlice({
    name:"UserInfo",
    initialState: {
       userName: (JSON.parse(localStorage.getItem("userName") || "null"))
      },
      reducers: {
        setUserName(state,action){state.userName=action.payload}
      }
})
export const {setUserName}=UserInfo.actions
export default UserInfo