import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import MuiAlert from '@material-ui/lab/Alert';
import { AlertState } from '../../../store/alert/slice';

const Alert = () => {
    const alertState = useSelector<RootState,AlertState>((state) => state.alert, shallowEqual);
    return (
        <div>
            <MuiAlert severity={ alertState.type }>{ alertState.message }</MuiAlert>
        </div>
    );
};

export default Alert;
