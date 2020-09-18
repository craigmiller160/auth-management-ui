/*
 *     Auth Management UI
 *     Copyright (C) 2020 Craig Miller
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
