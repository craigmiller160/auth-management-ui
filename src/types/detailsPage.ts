import { match } from 'react-router';

export const NEW_ID = 'new';

export interface IdMatchParams {
    id: string;
}

export interface IdMatchProps {
    match: match<IdMatchParams>;
}