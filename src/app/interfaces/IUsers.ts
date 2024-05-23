export interface ILoginRequest {
    username: string;
    password: string;
}

export interface ILoginResponse {
    status: boolean; 
    first_name?: string;
    last_name?: string;
    role?: string;
}