import React, { useEffect } from 'react';
import BaseDialog, { DialogAction } from '../../../../ui/Dialog/BaseDialog';
import TextField from '@material-ui/core/TextField';
import { useForm } from 'react-hook-form';
import './ClientRoleDialog.scss';
import { Role } from '../../../../../types/api';

interface Props {
    open: boolean;
    role: Role;
    onClose: () => void;
    onSave: (role: Role) => void;
    onDelete: (role: Role) => void;
}

interface RoleForm {
    name: string;
}

const ROLE_PREFIX = 'ROLE_';

const ClientRoleDialog = (props: Props) => {
    const {
        open,
        onClose,
        role,
        onSave,
        onDelete
    } = props;
    const { register, handleSubmit, errors, reset } = useForm<RoleForm>({
        mode: 'onBlur',
        reValidateMode: 'onChange'
    });

    useEffect(() => {
        const form: RoleForm = {
            name: role.name.replace(ROLE_PREFIX, '')
        };
        reset(form);
    },[role, reset]);

    const onSubmit = async (values: RoleForm) => {
        const payload: Role = {
            ...role,
            name: `${ROLE_PREFIX}${values.name}`
        };
        onSave(payload);
    };

    const actions: Array<DialogAction> = [
        { label: 'Save', onClick: handleSubmit(onSubmit) },
        { label: 'Cancel', onClick: onClose }
    ];
    if (role.id) {
        actions.push({ label: 'Delete', onClick: () => onDelete(role) });
    }

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
            <div className="ClientRoleDialog">
                <span className={ prefixClasses.join(' ') }>{ ROLE_PREFIX }</span>
                <TextField
                    name="name"
                    label="Role Name"
                    inputRef={ register({ required: 'Required' }) }
                    error={ !!errors.name }
                    helperText={ errors.name?.message ?? '' }
                />
            </div>
        </BaseDialog>
    );
};

export default ClientRoleDialog;
