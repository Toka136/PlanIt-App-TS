import { configureStore } from "@reduxjs/toolkit";
import { AuthSlice } from "./slices/AuthSlice";
import { TaskSlice } from "./slices/TaskSlice";
import UserStatus  from "./slices/UserStatusslice";
import { UserSlice } from "./slices/UserSlics";
export const tasksStore=configureStore({
    reducer: {
        [AuthSlice.reducerPath]: AuthSlice.reducer,
        [TaskSlice.reducerPath]: TaskSlice.reducer,
        [UserSlice.reducerPath]: UserSlice.reducer,
        UserStatus:UserStatus.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(AuthSlice.middleware).concat(TaskSlice.middleware).concat(UserSlice.middleware),

});