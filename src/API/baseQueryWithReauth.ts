import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { setIsLoggedIn } from "./slices/UserStatusslice";
const baseQuery=fetchBaseQuery({
    baseUrl:"http://localhost:4000/api/",
    credentials:"include"
})
export const baseQueryWithReauth:BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
>=async(args,api,extraOptions)=>{
    let result=await baseQuery(args,api,extraOptions)
if ( result.error) {   
    console.log("result.error",result.error);
      const err= result.error as FetchBaseQueryError
          const message=err.data as {message:string} 
          if((result.error.status === 401 &&message?.message === "jwt expired")){
            console.log("expired");
 const refreashResult=await baseQuery({
            url:"auth/refreshToken",
            method:"GET"
        },api,extraOptions)
        console.log("refreashResult",refreashResult);
        if(refreashResult.data){
            console.log("refreashResult.data",refreashResult.data);
              await new Promise((resolve) => setTimeout(resolve, 50));
           result= await baseQuery(args,api,extraOptions)
        }
        else{
            console.log("logout");
           await baseQuery({
            url:"auth/logout",
            method:"GET"
           },api,extraOptions)
           api.dispatch(setIsLoggedIn(false))
        }
   }
       

    }
    return result
}