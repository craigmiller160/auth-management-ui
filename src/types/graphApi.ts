import { ClientDetails, ClientRole } from './api';

export interface GraphQLQueryResponse<T> {
    data: T
}

export interface ClientDetailsWrapper {
    client: ClientDetails
}

export interface RolesForClientWrapper {
    rolesForClient: Array<ClientRole>;
}
