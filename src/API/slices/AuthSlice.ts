import { createApi } from "@reduxjs/toolkit/query/react";
import type { loginData, AuthResponse } from "../../Types/AuthTypes";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

export const AuthSlice=createApi({
  reducerPath: "auth",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, FormData>({
      query: (user) => ({
        url: "auth/register",
        method: "POST",
        body: user,
      }),
    }),
    login: builder.mutation<AuthResponse, loginData>({
      query: (user) => ({
        url: "auth/login",
        method: "POST",
        body: user,
      }),
    }),
    logOut: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logOut",
        method: "GET",
      }),
    }),
   
  }),
   
})
export const {useRegisterMutation,useLoginMutation,useLogOutMutation}=AuthSlice