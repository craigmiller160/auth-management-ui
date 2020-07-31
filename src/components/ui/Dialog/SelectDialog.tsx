import React, { MouseEvent } from 'react';
import BaseDialog, { DialogAction } from './BaseDialog';

interface Props {
    open: boolean;
    title: string;
    onSelect: (event: MouseEvent<HTMLButtonElement>) => void;
    onCancel: (event: MouseEvent<HTMLButtonElement>) => void;
}

const SelectDialog = (props: Props) => {
    const {
        open,
        title,
        onSelect,
        onCancel
    } = props;

    const actions: Array<DialogAction> = [
        { label: 'Select', onClick: onSelect },
        { label: 'Cancel', onClick: onCancel }
    ];

    return (
        <BaseDialog
            open={ open }
            title={ title }
            actions={ actions }
        />
    );
};

export default SelectDialog;
