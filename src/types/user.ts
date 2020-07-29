
interface BaseUser {
    email: string;
    firstName: string;
    lastName: string;
}

export interface UserRole {
    id: number;
    name: string;
}

export interface UserClient {
    id: number;
    name: string;
    clientKey: string;
    allRoles: Array<UserRole>;
    userRoles: Array<UserRole>;
}

export interface UserInput extends BaseUser {
    password: string;
}

export interface UserDetails extends BaseUser {
    id: number;
}

export interface FullUserDetails extends UserDetails {
    clients: Array<UserClient>;
}

export interface UserList {
    users: Array<UserDetails>;
}
