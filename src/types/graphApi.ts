export interface GraphQLQueryResponse<T> {
    data: T
}

export interface ClientResponse {
    accessTokenTimeoutSecs?: number;
    allowAuthCode?: boolean;
    allowClientCredentials?: boolean;
    allowPassword?: boolean;
    clientKey?: string;
    enabled?: boolean;
    id?: number;
    name?: string;
    refreshTokenTimeoutSecs?: number;
}

export interface ClientListResponse {
    clients: Array<ClientResponse>;
}
