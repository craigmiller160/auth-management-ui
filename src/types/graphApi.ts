import { ClientRole, FullClientDetails } from './client';

export interface GraphQLError {
    message: string;
}

export interface GraphQLQueryResponse<T> {
    data: T;
    errors: Array<GraphQLError>;
}

export interface ClientDetailsWrapper {
    client: FullClientDetails
}

export interface RolesForClientWrapper {
    rolesForClient: Array<ClientRole>;
}
