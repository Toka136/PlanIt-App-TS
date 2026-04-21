import { createSlice } from "@reduxjs/toolkit";
import type { UserStatusState } from "../../Types/AuthTypes";

const UserStatus=createSlice({
    name:"UserStatus",
    initialState: {
       isLoggedIn: (JSON.parse(localStorage.getItem("isLoggedIn") || "false"))
      },
      reducers: {
        setIsLoggedIn: (state: UserStatusState, action: { payload: boolean }) => {
          state.isLoggedIn = action.payload
          localStorage.setItem("isLoggedIn",JSON.stringify(action.payload))
        } 
      }
})

export const {setIsLoggedIn}=UserStatus.actions
export default UserStatus