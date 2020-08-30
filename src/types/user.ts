
interface BaseUser {
    email: string;
    firstName: string;
    lastName: string;
    enabled: boolean;
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

export interface UserClients {
    id: number;
    email: string;
    clients: Array<UserClient>;
}

// TODO delete this
export interface FullUserDetails extends UserDetails {
    clients: Array<UserClient>;
}

export interface UserList {
    users: Array<UserDetails>;
}

export interface UserAuthDetails {
    tokenId: string | null;
    clientId: number;
    clientName: string;
    userId: number;
    userEmail: string;
    lastAuthenticated: string | null;
}

export interface UserAuthDetailsList {
    email: string;
    authDetails: Array<UserAuthDetails>;
}
