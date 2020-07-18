import React from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../../theme';
import MuiTable from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';

interface BodyRow {
    click: () => void;
    items: Array<string | number | boolean>;
}

interface Props {
    header: Array<String>;
    body: Array<BodyRow>;
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

const Table = (props: Props) => {
    const classes = useStyles();
    return (
        <TableContainer>
            <MuiTable>
                <TableHead className={ classes.TableHeader }>
                    <TableRow>
                        {
                            props.header.map((name, index) => (
                                <TableCell key={ index }>{ name }</TableCell>
                            ))
                        }
                    </TableRow>
                </TableHead>
                <TableBody className={ classes.TableBody }>
                    {
                        props.body.map((row, index) => (
                            <TableRow key={ index } onClick={ row.click }>
                                {
                                    row.items.map((item, index) => (
                                        <TableCell key={ index }>{ item }</TableCell>
                                    ))
                                }
                            </TableRow>
                        ))
                    }
                </TableBody>
            </MuiTable>
        </TableContainer>
    );
};

export default Table;
