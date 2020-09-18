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
