
export interface AuthUser {
    username: string;
    firstName: string;
    lastName: string;
    roles: Array<String>;
}

export interface AuthCodeLogin {
    url: string;
}
