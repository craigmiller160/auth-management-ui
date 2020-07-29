import { ClientDetails } from './api';

export interface GraphQLQueryResponse<T> {
    data: T
}

export interface ClientDetailsWrapper {
    client: ClientDetails
}
