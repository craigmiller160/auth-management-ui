import { ClientDetails, ClientRole } from './client';

export interface GraphQLQueryResponse<T> {
    data: T
}

export interface ClientDetailsWrapper {
    client: ClientDetails
}

export interface RolesForClientWrapper {
    rolesForClient: Array<ClientRole>;
}
