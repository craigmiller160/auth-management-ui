import React, { useEffect } from 'react';
import { IdMatchProps, NEW_ID } from '../../../../../types/detailsPage';
import { useImmer } from 'use-immer';
import { pipe } from 'fp-ts/es6/pipeable';
import { getFullClientDetails } from '../../../../../services/ClientService';
import { map } from 'fp-ts/es6/Either';
import { ClientRole, ClientUser } from '../../../../../types/client';
import { Typography } from '@material-ui/core';
import './ClientGrants.scss';

interface Props extends IdMatchProps {}

interface State {
    clientId: number;
    clientName: string;
    allRoles: Array<ClientRole>;
    users: Array<ClientUser>;
}

const ClientGrants = (props: Props) => {
    const id = props.match.params.id;

    const [state, setState] = useImmer<State>({
        clientId: id !== NEW_ID ? parseInt(id) : 0,
        clientName: '',
        allRoles: [],
        users: []
    });

    const loadFullClientDetails = async () => {
        pipe(
            await getFullClientDetails(state.clientId),
            map((fullClientDetails) =>
                setState((draft) => {
                    draft.clientName = fullClientDetails.name;
                    draft.allRoles = fullClientDetails.roles;
                    draft.users = fullClientDetails.users;
                })
            )
        )
    };

    useEffect(() => {
        loadFullClientDetails();
    }, []);

    console.log(state.users); // TODO delete this

    return (
        <div className="ClientGrants">
            <Typography
                className="name"
                variant="h5"
            >
                { state.clientName }
            </Typography>
        </div>
    );
};

export default ClientGrants;
