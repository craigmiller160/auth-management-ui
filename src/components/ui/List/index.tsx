import React, { ElementType } from 'react';
import MuiList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import makeStyles from '@material-ui/core/styles/makeStyles';
import theme from '../../theme';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';

export interface Item {
    click: () => void;
    avatar?: ElementType;
    text: {
        primary: string;
        secondary?: string;
    }
    secondaryAction?: {
        text: string;
        click: () => void;
    }
}

interface Props {
    items: Array<Item>;
}

const useStyles = makeStyles({
    ListItem: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.secondary.light
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

                    return (
                        <ListItem
                            key={ index }
                            className={ classes.ListItem }
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
                                item.secondaryAction &&
                                <ListItemSecondaryAction>
                                    <Button
                                        color="primary"
                                        onClick={ item.secondaryAction?.click }
                                    >
                                        { item.secondaryAction?.text }
                                    </Button>
                                </ListItemSecondaryAction>
                            }
                        </ListItem>
                    );
                })
            }
        </MuiList>
    );
};

export default List;
