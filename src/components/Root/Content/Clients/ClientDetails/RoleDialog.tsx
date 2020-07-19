import React, { ChangeEvent, useEffect } from 'react';
import BaseDialog, { DialogAction } from '../../../../ui/Dialog/BaseDialog';
import TextField from '@material-ui/core/TextField';
import { useImmer } from 'use-immer';
import { useForm } from 'react-hook-form';
import './RoleDialog.scss';
import { Role } from '../../../../../types/api';
import { createRole, deleteRole, updateRole } from '../../../../../services/ClientService';
import { isSome, Option } from 'fp-ts/es6/Option';

interface Props {
    open: boolean;
    role: Role;
    onClose: () => void;
}

interface State {
    role: Role;
}

interface RoleForm {
    name: string;
}

const ROLE_PREFIX = 'ROLE_';

const RoleDialog = (props: Props) => {
    const {
        open,
        onClose,
        role
    } = props;
    const [state, setState] = useImmer<State>({
        role: {
            id: role?.id ?? 0,
            name: role?.name ?? '',
            clientId: role?.clientId ?? 0
        }
    });
    const { register, handleSubmit, errors } = useForm<RoleForm>({
        mode: 'onBlur',
        reValidateMode: 'onChange'
    });

    useEffect(() => {
        setState((draft) => {
            draft.role = {
                ...role,
                name: role.name.replace(ROLE_PREFIX, '')
            }
        });
    }, [role, setState]);

    const onSubmit = async () => {
        const payload = {
            ...state.role,
            name: `${ROLE_PREFIX}${state.role.name}`
        };
        let result: Option<Role>;
        if (state.role.id) {
            result = await updateRole(payload.clientId, payload.id, payload);
        } else {
            result = await createRole(payload.clientId, payload);
        }

        if (isSome(result)) {
            onClose();
        }
    };

    const onDelete = async () => {
        const result = await deleteRole(state.role.clientId, state.role.id);
        if (isSome(result)) {
            onClose();
        }
    };

    const actions: Array<DialogAction> = [
        { label: 'Save', onClick: handleSubmit(onSubmit) },
        { label: 'Cancel', onClick: onClose }
    ];
    if (state.role.id) {
        actions.push({ label: 'Delete', onClick: onDelete });
    }

    const setName = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setState((draft) => {
            draft.role.name = value.toUpperCase();
        });
    };

    const prefixClasses = ['RolePrefix'];
    if (errors.name) {
        prefixClasses.push('error');
    }

    return (
        <BaseDialog
            open={ open }
            title="Role Details"
            actions={ actions }
        >
            <div className="RoleDialog">
                <span className={ prefixClasses.join(' ') }>{ ROLE_PREFIX }</span>
                <TextField
                    name="name"
                    label="Role Name"
                    value={ state.role.name }
                    onChange={ setName }
                    inputRef={ register({ required: 'Required' }) }
                    error={ !!errors.name }
                    helperText={ errors.name?.message ?? '' }
                />
            </div>
        </BaseDialog>
    );
};

export default RoleDialog;
