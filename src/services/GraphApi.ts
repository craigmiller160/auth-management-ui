import api from './Api';

export const graphql = async <R> (payload: string) =>
    api.post<string,R>({
        uri: '/graphql',
        errorMsg: 'Error with GraphQL call',
        body: payload,
        config: {
            headers: {
                'Content-Type': 'application/graphql'
            }
        }
    });
