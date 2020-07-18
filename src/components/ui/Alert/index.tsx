import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import MuiAlert from '@material-ui/lab/Alert';
import alertSlice, { AlertState } from '../../../store/alert/slice';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Collapse from '@material-ui/core/Collapse';

const capitalize = (text: string) => {
    const firstLetter = text.substring(0, 1).toUpperCase();
    return `${firstLetter}${text.substring(1)}`;
};

const Alert = () => {
    const dispatch = useDispatch();
    const alertState = useSelector<RootState,AlertState>((state) => state.alert, shallowEqual);
    return (
        <Collapse in={ alertState.show }>
            <MuiAlert
                severity={ alertState.type }
                onClose={ () => dispatch(alertSlice.actions.hideAlert()) }
            >
                <AlertTitle>{ capitalize(alertState.type) }</AlertTitle>
                { alertState.message }
            </MuiAlert>
        </Collapse>
    );
};

export default Alert;
