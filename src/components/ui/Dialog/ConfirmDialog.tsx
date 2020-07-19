import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import './ConfirmDialog.scss';

interface Props {
    open: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

const ConfirmDialog = (props: Props) => {
    return (
        <Dialog open={ props.open } className="ConfirmDialog">
            <DialogTitle>{ props.title }</DialogTitle>
            <DialogContent>
                <DialogContentText>{ props.message }</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={ props.onConfirm }
                    color="primary"
                >
                    Confirm
                </Button>
                <Button
                    onClick={ props.onCancel }
                    color="primary"
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
