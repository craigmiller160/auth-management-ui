import React, { ElementType } from 'react';
import MuiList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import makeStyles from '@material-ui/core/styles/makeStyles';
import theme from '../../theme';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

export interface ItemSecondaryAction {
    text: string;
    click: () => void;
}

export interface Item {
    click?: () => void;
    avatar?: ElementType;
    text: {
        primary: string;
        secondary?: string;
    }
    secondaryActions?: Array<ItemSecondaryAction>;
    active?: boolean;
}

interface Props {
    items: Array<Item>;
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
    const {
        items
    } = props;

    return (
        <MuiList>
            {
                items.map((item, index) => {
                    const Avatar = item.avatar ?? null;
                    const className = [classes.ListItem];
                    if (item.active) {
                        className.push('active');
                    }

                    return (
                        <ListItem
                            key={ index }
                            className={ className.join(' ') }
                            onClick={ item.click }
                        >
                            {
                                Avatar &&
                                <ListItemAvatar>
                                    <Avatar />
                                </ListItemAvatar>
                            }
                            <ListItemText
                                primary={ item.text.primary }
                                secondary={ item.text.secondary }
                            />
                            {
                                item.secondaryActions &&
                                <div>
                                    {
                                        item.secondaryActions?.map((action, index) => (
                                            <Button
                                                className={ classes.Button }
                                                key={ index }
                                                color="primary"
                                                onClick={ action.click }
                                            >
                                                { action.text }
                                            </Button>
                                        ))
                                    }
                                </div>
                            }
                        </ListItem>
                    );
                })
            }
        </MuiList>
    );
};

export default List;
