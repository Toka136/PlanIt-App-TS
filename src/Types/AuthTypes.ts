export interface AuthResponse {
     statusText: string,
    data: {
        id: string,
        email: string,
        userName: string,
        avatar: string,
        token?: string
    }
}
 export interface UserStatusState {
    isLoggedIn: boolean
}

export interface registerTempData {
    userName:string,
    email:string,
    password:string,
}
export interface UpdateData {
    userName:string,
    currentPassword:string,
    newPassword:string
}
export interface loginData {
    email: string,
    password: string
}