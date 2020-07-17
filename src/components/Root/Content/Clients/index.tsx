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
import theme from '../../../theme';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';

interface State {
    clients: Array<Client>
}

const useStyles = makeStyles({
    TableHeader: {
        '& th': {
            fontWeight: 'bold'
        }
    },
    TableBody: {
        '& tr': {
            cursor: 'pointer'
        },
        '& tr:hover': {
            backgroundColor: theme.palette.secondary.light
        }
    }
});

const Clients = () => {
    const classes = useStyles();
    const history = useHistory();
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

    const rowClick = (id: number) => history.push(`/clients/${id}`);

    return (
        <div>
            <PageHeader title="Clients" />
            <TableContainer>
                <Table>
                    <TableHead className={ classes.TableHeader } color="primary">
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Key</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className={ classes.TableBody }>
                        {
                            state.clients.map((client) => (
                                <TableRow key={ client.id } onClick={ () => rowClick(client.id) }>
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
