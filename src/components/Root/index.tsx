import React, { useEffect } from 'react';
import Navbar from './Navbar/Navbar';
import Content from './Content';
import { useDispatch } from 'react-redux';
import { loadAuthUser } from '../../store/auth/actions';

const Root = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadAuthUser());
    }, [dispatch]);

    return (
        <div>
            <Navbar />
            <Content />
        </div>
    );
};

export default Root;
