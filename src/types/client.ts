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
    roles: Array<ClientRole>;
}

interface BaseClient {
    name: string;
    clientKey: string;
    enabled: boolean;
    allowAuthCode: boolean;
    allowClientCredentials: boolean;
    allowPassword: boolean;
    accessTokenTimeoutSecs: number;
    refreshTokenTimeoutSecs: number;
}

export interface ClientDetails extends BaseClient {
    id: number;
}

export interface FullClientDetails extends ClientDetails {
    id: number;
    roles: Array<ClientRole>;
    users: Array<ClientUser>;
}

export interface ClientInput extends BaseClient {
    clientSecret: string;
}

export interface ClientAuthDetails {
    tokenId: string | null;
    clientId: number;
    lastAuthenticated: string | null;
}
