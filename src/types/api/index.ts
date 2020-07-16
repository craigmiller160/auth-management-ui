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
