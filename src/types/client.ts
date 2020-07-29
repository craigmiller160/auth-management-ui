export interface ClientListItem {
    id: number;
    name: string;
    clientKey: string;
}

export interface ClientListResponse {
    clients: Array<ClientListItem>;
}

export interface ClientRole {
    id: number;
    name: string;
}

export interface ClientUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}

export interface ClientDetails {
    id: number;
    name: string;
    clientKey: string;
    clientSecret: string;
    enabled: boolean;
    allowAuthCode: boolean;
    allowClientCredentials: boolean;
    allowPassword: boolean;
    accessTokenTimeoutSecs: number;
    refreshTokenTimeoutSecs: number;
    roles: Array<ClientRole>;
    users: Array<ClientUser>;
}
