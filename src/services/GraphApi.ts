import api, { SuppressErrorFn } from './Api';
import { GraphQLQueryResponse } from '../types/graphApi';
import { Either, map } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';

export interface GraphQLRequest {
    payload: string;
    errorMsg?: string;
    suppressError?: SuppressErrorFn
}

const graphql = async <R> (request: GraphQLRequest): Promise<Either<Error, R>> =>
    pipe(
        await api.post2<string,GraphQLQueryResponse<R>>({
            uri: '/graphql',
            errorMsg: request.errorMsg,
            suppressError: request.suppressError,
            body: request.payload,
            config: {
                headers: {
                    'Content-Type': 'application/graphql'
                }
            }
        }),
        map((res: GraphQLQueryResponse<R>) => res.data)
    );

export default {
    graphql
};
