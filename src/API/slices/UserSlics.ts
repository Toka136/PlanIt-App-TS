import { createApi } from "@reduxjs/toolkit/query/react";
import type { ResponseUser } from "../../Types/UserTypes";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

export const UserSlice=createApi({
    reducerPath: "user",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getUser: builder.query<ResponseUser, void>({
            query: () => "users/profile/",
            providesTags: ["User"],
        }),
        updateUser: builder.mutation<ResponseUser, FormData>({
            query: (user) => ({
                url: "/users/profile/update",
                method: "PATCH",
                body: user,
            }),
            invalidatesTags: ["User"],
        }),
        deleteUser: builder.mutation<void, void>({
            query: () => ({
                url: "users/profile/delete",
                method: "DELETE",
            }),
          
        }),
      
    }),
})

export const {useGetUserQuery,useUpdateUserMutation,useDeleteUserMutation}=UserSlice