import React, { ChangeEvent } from 'react';
import BaseDialog, { DialogAction } from '../../../../ui/Dialog/BaseDialog';
import TextField from '@material-ui/core/TextField';
import { useImmer } from 'use-immer';
import { useForm } from 'react-hook-form';
import './RoleDialog.scss';
import { Role } from '../../../../../types/api';

interface Props {
    open: boolean;
    role?: Role;
    onClose: () => void;
}

interface State {
    role: Role;
}

interface RoleForm {
    name: string;
}

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

    const onSubmit = () => {
        // TODO save stuff
        onClose();
    };

    const onDelete = () => {
        // TODO delete stuff
        onClose();
    };

    const actions: Array<DialogAction> = [
        { label: 'Save', onClick: handleSubmit(onSubmit) },
        { label: 'Cancel', onClick: onClose },
        { label: 'Delete', onClick: onDelete }
    ];

    const setName = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setState((draft) => {
            draft.role.name = value;
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
                <span className={ prefixClasses.join(' ') }>ROLE_</span>
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
