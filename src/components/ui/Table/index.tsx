/*
 *     Auth Management UI
 *     Copyright (C) 2020 Craig Miller
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import { makeStyles } from '@material-ui/core/styles';
import MuiTable from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import theme from '../../theme';

export interface BodyRow {
  click: () => void;
  items: Array<string | number | boolean>;
  id?: string;
}

interface Props {
  header: Array<string>;
  body: Array<BodyRow>;
  id?: string;
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
    <TableContainer id={props.id}>
      <MuiTable>
        <TableHead className={classes.TableHeader}>
          <TableRow>
            {props.header.map((name, index) => (
              <TableCell key={name}>{name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody className={classes.TableBody}>
          {props.body.map((row, index) => {
            const id = row.id ?? `id_${index}`;
            return (
              <TableRow id={id} key={id} onClick={row.click}>
                {row.items.map((item) => (
                  <TableCell key={`${item}`}>{item}</TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
