import React, { MouseEvent, PropsWithChildren } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import './BaseDialog.scss';

export interface DialogAction {
    label: string;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

interface Props {
    open: boolean;
    title: string;
    actions: Array<DialogAction>;
    className?: string;
}

// TODO whenever this appears there is a console error. figure it out
// TODO add a transition for when the modal appears
// TODO make the modal appear near the top of the page

const BaseDialog = (props: PropsWithChildren<Props>) => {
    const {
        open,
        title,
        children,
        actions,
        className
    } = props;

    const rootClasses = ['BaseDialog', className]
        .filter((name) => name)
        .join(' ');

    return (
        <Dialog
            open={ open }
            className={ rootClasses }
        >
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
