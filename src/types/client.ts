import { UserAuthDetails } from './user';

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
    enabled: boolean;
    roles: Array<ClientRole>;
}

interface BaseClient {
    name: string;
    clientKey: string;
    enabled: boolean;
    accessTokenTimeoutSecs: number;
    refreshTokenTimeoutSecs: number;
    authCodeTimeoutSecs: number;
    redirectUris: Array<string>;
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

export interface ClientWithRoles {
    id: number;
    name: string;
    roles: Array<ClientRole>;
}

export interface ClientAuthDetails {
    clientName: string;
    userAuthDetails: Array<UserAuthDetails>;
}