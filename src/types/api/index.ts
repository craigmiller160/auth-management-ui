export interface ErrorResponse {
    status: number;
    message: string;
}

export interface Client {
    accessTokenTimeoutSecs: number;
    allowAuthCode: boolean;
    allowClientCredentials: boolean;
    allowPassword: boolean;
    clientKey: string;
    clientSecret?: string;
    enabled: boolean;
    id: number;
    name: string;
    refreshTokenTimeoutSecs: number;
}

export interface ClientList {
    clients: Array<Client>
}

export interface AuthUser {
    username: string;
    firstName: string;
    lastName: string;
    roles: Array<String>;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
}

export interface UserList {
    users: Array<User>;
}

export interface Role {
    id: number;
    name: string;
    clientId: number;
}

export interface FullClient {
    client: Client;
    users: Array<User>;
    roles: Array<Role>;
}
