export interface IAuthState {
    isAuth: boolean;
    isLoading: boolean;
    error: string;
    userInfo: IUserInfo
}

export interface ILoginData{
    username: string,
    password: string
}

export interface IAuthResponse{
    accessToken: string
    userInfo: IUserInfo
}

export interface IUserInfo{
    id: number,
    roles:string[],
    displayName: string
}


