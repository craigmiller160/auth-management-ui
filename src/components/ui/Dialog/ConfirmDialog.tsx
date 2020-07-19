import React, { MouseEvent } from 'react';
import DialogContentText from '@material-ui/core/DialogContentText';
import BaseDialog, { DialogAction } from './BaseDialog';

interface Props {
    open: boolean;
    title: string;
    message: string;
    onConfirm: (event: MouseEvent<HTMLButtonElement>) => void;
    onCancel: (event: MouseEvent<HTMLButtonElement>) => void;
}

const ConfirmDialog = (props: Props) => {
    const {
        open,
        title,
        message,
        onConfirm,
        onCancel
    } = props;

    const actions: Array<DialogAction> = [
        { label: 'Confirm', onClick: onConfirm },
        { label: 'Cancel', onClick: onCancel }
    ];

    return (
        <BaseDialog
            open={ open }
            title={ title }
            actions={ actions }>
            <DialogContentText>{ message }</DialogContentText>
        </BaseDialog>
    );
};

export default ConfirmDialog;
