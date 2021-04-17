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

import React, { ElementType, MouseEvent } from 'react';
import MuiList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import theme from '../../theme';

export interface ItemSecondaryAction {
  uuid: string;
  text: string;
  click: (event: MouseEvent) => void;
}

export interface Item {
  uuid: string;
  click?: (event: MouseEvent) => void;
  avatar?: ElementType;
  text: {
    primary: string;
    secondary?: string;
  };
  secondaryActions?: Array<ItemSecondaryAction>;
  active?: boolean;
}

interface Props {
  id?: string;
  items: Array<Item>;
  columnLayout?: boolean;
}

const useStyles = makeStyles({
  ListItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.secondary.light
    },
    '&.active': {
      backgroundColor: theme.palette.secondary.light
    }
  },
  Button: {
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.secondary.main
    }
  }
});

const List = (props: Props) => {
  const classes = useStyles();
  const { id, items, columnLayout = false } = props;

  const isNotPhone = useMediaQuery(theme.breakpoints.up('md'));
  const listItemDirection = isNotPhone && !columnLayout ? 'row' : 'column';

  return (
    <MuiList id={id}>
      {items.map((item, index) => {
        const Avatar = item.avatar ?? null;
        const className = [ classes.ListItem ];
        if (item.active) {
          className.push('active');
        }

        const itemId = id ? `${id}-item-${index}` : '';

        const primaryTextId = itemId ? `${itemId}-text-primary` : '';
        const secondaryTextId = itemId ? `${itemId}-text-secondary` : '';

        return (
          <ListItem
            data-testid={itemId}
            key={item.uuid}
            className={className.join(' ')}
            onClick={item.click}
          >
            {Avatar && (
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
            )}
            <Grid container direction={listItemDirection} justify="flex-start">
              <ListItemText
                primary={item.text.primary}
                primaryTypographyProps={{
                  id: primaryTextId
                }}
                secondary={item.text.secondary}
                secondaryTypographyProps={{
                  id: secondaryTextId
                }}
              />
              {item.secondaryActions && (
                <Grid item>
                  {item.secondaryActions?.map((action) => (
                    <Button
                      className={classes.Button}
                      key={action.uuid}
                      color="primary"
                      onClick={action.click}
                    >
                      {action.text}
                    </Button>
                  ))}
                </Grid>
              )}
            </Grid>
          </ListItem>
        );
      })}
    </MuiList>
  );
};

export default List;
