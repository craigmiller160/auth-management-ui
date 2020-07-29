
interface BaseUser {
    email: string;
    firstName: string;
    lastName: string;
}

export interface UserInput extends BaseUser {
    password: string;
}

export interface UserDetails extends BaseUser {
    id: number;
}

export interface FullUserDetails extends UserDetails {}

export interface UserList {
    users: Array<UserDetails>;
}
