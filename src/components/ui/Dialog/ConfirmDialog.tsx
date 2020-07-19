import React, { MouseEvent } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import './ConfirmDialog.scss';
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
            <DialogContentText>{ props.message }</DialogContentText>
        </BaseDialog>
    );
};

export default ConfirmDialog;
