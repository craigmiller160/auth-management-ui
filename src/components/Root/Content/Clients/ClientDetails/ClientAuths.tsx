import React, { useEffect } from 'react';
import { match } from 'react-router';
import { UserAuthDetails } from '../../../../../types/user';
import { useImmer } from 'use-immer';
import { pipe } from 'fp-ts/es6/pipeable';
import { getAuthDetailsForClient } from '../../../../../services/ClientService';
import { map } from 'fp-ts/es6/Either';
import { Grid, Typography } from '@material-ui/core';
import './ClientAuths.scss';
import List, { Item } from '../../../../ui/List';
import { LockOpen } from '@material-ui/icons';
import { formatApiDateTime } from '../../../../../utils/date';

const NEW = 'new'; // TODO create a common constant for this
interface MatchParams { // TODO create a common type for this...
    id: string;
}

interface Props {
    match: match<MatchParams>; // TODO create a common type for this
}

interface State {
    clientId: number;
    clientName: string;
    userAuthDetails: Array<UserAuthDetails>;
}

const ClientAuths = (props: Props) => {
    const id = props.match.params.id;
    const [state, setState] = useImmer<State>({
        clientId: id !== NEW ? parseInt(id) : 0, // TODO make re-usable function
        clientName: '',
        userAuthDetails: []
    });

    const loadAuthDetails = async () =>
        pipe(
            await getAuthDetailsForClient(state.clientId),
            map((clientAuthDetails) => {
                setState((draft) => {
                    draft.clientName = clientAuthDetails.clientName;
                    draft.userAuthDetails = clientAuthDetails.userAuthDetails;
                });
            })
        );

    useEffect(() => {
        loadAuthDetails();
    }, []);

    const items: Array<Item> = state.userAuthDetails
        .map((auth) => ({
            avatar: () => <LockOpen />,
            text: {
                primary: `User: ${auth.userEmail}`,
                secondary: `Last Authenticated: ${formatApiDateTime(auth.lastAuthenticated)}`
            },
            secondaryActions: [
                {
                    text: 'Revoke',
                    click: () => {}
                }
            ]
        }));

    return (
        <div className="ClientAuths">
            <Typography
                className="name"
                variant="h5"
            >
                { state.clientName }
            </Typography>
            <Grid
                container
                direction="row"
                justify="center"
            >
                <Grid
                    item
                    md={ 5 }
                >
                    {
                        items.length > 0 &&
                        <List items={ items } />
                    }
                    {
                        items.length === 0 &&
                        <Typography
                            className="no-auths"
                            variant="body1"
                        >
                            No Authorizations
                        </Typography>
                    }
                </Grid>
            </Grid>
        </div>
    );
};

export default ClientAuths;
