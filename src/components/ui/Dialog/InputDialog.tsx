import React from 'react';
import BaseDialog, { DialogAction } from './BaseDialog';
import { useForm } from 'react-hook-form';

interface InputForm {
    value: string;
}

interface Props {
    open: boolean;
    title: string;
}

const InputDialog = (props: Props) => {
    const {
        open,
        title
    } = props;

    const actions: Array<DialogAction> = [
        { label: 'Save', onClick: () => {} },
        { label: 'Cancel', onClick: () => {} }
    ];

    return (
        <BaseDialog
            open={ open }
            title={ title }
            actions={ actions }
        >

        </BaseDialog>
    );
};

export default InputDialog;