import React, { useEffect, useState } from 'react';
import PageHeader from '../../../ui/PageHeader/PageHeader';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { Client } from '../../../../types/api';
import { getClients } from '../../../../services/ClientService';
import { isSome } from 'fp-ts/es6/Option';
import TableBody from '@material-ui/core/TableBody';
import './Clients.scss';
import theme from '../../../theme';

interface State {
    clients: Array<Client>
}

const Clients = () => {
    const [state, setState] = useState<State>({
        clients: []
    });

    useEffect(() => {
        const action = async () => {
            const result = await getClients();
            if (isSome(result)) {
                setState({
                    clients: result.value.clients
                });
            } else {
                setState({
                    clients: []
                });
            }
        };

        action();
    }, []);

    const headerStyle: React.CSSProperties = {
        backgroundColor: theme.palette.primary.main
    };

    return (
        <div className="Clients">
            <PageHeader title="Clients" />
            <TableContainer>
                <Table>
                    <TableHead style={ headerStyle } className="TableHeader" color="primary">
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Key</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="TableBody">
                        {
                            state.clients.map((client) => (
                                <TableRow key={ client.id }>
                                    <TableCell>{ client.name }</TableCell>
                                    <TableCell>{ client.clientKey }</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Clients;
