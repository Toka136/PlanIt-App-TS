export interface User {
    id: string;
    userName: string;
    email: string;
    avatar: string;
}
export interface ResponseUser {
   statusText: string;
   data: User
}