import React, { ElementType, MouseEvent } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import './BaseDialog.scss.scss';

export interface DialogAction {
    label: string;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

interface Props {
    open: boolean;
    title: string;
    children: ElementType;
    actions: Array<DialogAction>;
}

// TODO whenever this appears there is a console error. figure it out
// TODO add a transition for when the modal appears
// TODO make the modal appear near the top of the page

const BaseDialog = (props: Props) => {
    const {
        open,
        title,
        children,
        actions
    } = props;
    return (
        <Dialog open={ open } className="ConfirmDialog">
            <DialogTitle>{ title }</DialogTitle>
            <DialogContent>
                { children }
            </DialogContent>
            <DialogActions>
                {
                    actions.map((action, index) => (
                        <Button
                            key={ index }
                            color="primary"
                            onClick={ action.onClick }
                        >
                            { action.label }
                        </Button>
                    ))
                }
            </DialogActions>
        </Dialog>
    );
};

export default BaseDialog;
