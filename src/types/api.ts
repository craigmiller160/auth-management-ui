export interface ClientListItem {
    id: number;
    name: string;
    clientKey: string;
}

export interface ClientListResponse {
    clients: Array<ClientListItem>;
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
}
