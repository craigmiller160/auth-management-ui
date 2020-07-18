import React, { useEffect } from 'react';
import Navbar from './Navbar/Navbar';
import Content from './Content';
import { useDispatch, useSelector } from 'react-redux';
import { loadAuthUser } from '../../store/auth/actions';
import { RootState } from '../../store';
import Alert from '../ui/Alert';

const Root = () => {
    const dispatch = useDispatch();
    const hasChecked = useSelector((state: RootState) => state.auth.hasChecked);
    useEffect(() => {
        dispatch(loadAuthUser());
    }, [dispatch]);

    return (
        <div>
            <Navbar />
            {
                hasChecked &&
                <Content />
            }
        </div>
    );
};

export default Root;
