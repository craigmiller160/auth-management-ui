import React from 'react';
import { exists, getOrElse, isNone, map, Option } from 'fp-ts/es6/Option';
import { UserClient } from '../../../../../types/user';
import { SectionHeader } from '../../../../ui/Header';
import { Typography } from '@material-ui/core';
import List, { Item } from '../../../../ui/List';
import Button from '@material-ui/core/Button';
import { pipe } from 'fp-ts/es6/pipeable';
import { SelectDialog } from '../../../../ui/Dialog';
import { useImmer } from 'use-immer';

interface Props {
    selectedClient: Option<UserClient>;
    userId: number;
}

interface State {
    showAddRoleDialog: boolean;
    showRemoveRoleDialog: boolean;
    roleIdToRemove: number;
}

const UserRoles = (props: Props) => {
    const {
        selectedClient,
        userId
    } = props;
    const [state, setState] = useImmer<State>({
        showAddRoleDialog: false,
        showRemoveRoleDialog: false,
        roleIdToRemove: 0
    });

    if (isNone(selectedClient)) {
        return <div />;
    }

    const roleItems: Array<Item> = pipe(
        selectedClient,
        map((selected: UserClient) =>
            selected.userRoles
                .map((role) => ({
                    click: () => {},
                    text: {
                        primary: role.name
                    },
                    secondaryActions: [
                        {
                            text: 'Remove',
                            click: () => {}
                        }
                    ]
                }))
        ),
        getOrElse((): Array<Item> => [])
    );

    return (
        <>
            <SectionHeader title="Roles" />
            {
                exists((selected: UserClient) => selected.allRoles.length === 0)(selectedClient) &&
                <Typography variant="h6">No Roles</Typography>
            }
            {
                exists((selected: UserClient) => selected.allRoles.length > 0)(selectedClient) &&
                <>
                    <List items={ roleItems } />
                    <Button
                        color="primary"
                        variant="contained"
                    >
                        Add Role
                    </Button>
                </>
            }
            <SelectDialog
                open={ state.showAddRoleDialog }
                title="Add Role"
                onSelect={ () => {} }
                onCancel={ () => {} }
                options={ [] }
            />
        </>
    );
};

export default UserRoles;
