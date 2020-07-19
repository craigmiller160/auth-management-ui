import React, { ChangeEvent } from 'react';
import BaseDialog, { DialogAction } from '../../../../ui/Dialog/BaseDialog';
import TextField from '@material-ui/core/TextField';
import { useImmer } from 'use-immer';
import { useForm } from 'react-hook-form';
import './RoleDialog.scss';

interface Props {
    open: boolean;
    onClose: () => void;
}

interface RoleForm {
    name: string;
}

const RoleDialog = (props: Props) => {
    const {
        open,
        onClose
    } = props;
    const [state, setState] = useImmer<RoleForm>({
        name: ''
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
            draft.name = value;
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
                    value={ state.name }
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
