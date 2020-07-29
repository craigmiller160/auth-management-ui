import api from './Api';
import { Option, map } from 'fp-ts/es6/Option';
import { GraphQLQueryResponse } from '../types/graphApi';

const graphql = async <R> (payload: string): Promise<Option<R>> => {
    const resultOption = await api.post<string,GraphQLQueryResponse<R>>({
        uri: '/graphql',
        errorMsg: 'Error with GraphQL call',
        body: payload,
        config: {
            headers: {
                'Content-Type': 'application/graphql'
            }
        }
    });
    return map((res: GraphQLQueryResponse<R>) => res.data)(resultOption);
};

export default {
    graphql
};
