import api from './Api';
import { GraphQLQueryResponse } from '../types/graphApi';
import { Either, map } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';

const graphql = async <R> (payload: string): Promise<Either<Error, R>> =>
    pipe(
        await api.post2<string,GraphQLQueryResponse<R>>({
            uri: '/graphql',
            errorMsg: 'Error with GraphQL call',
            body: payload,
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
