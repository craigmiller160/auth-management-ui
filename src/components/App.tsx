import React, { useEffect } from 'react';
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../store';
import Root from './Root';
import theme from './theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { loadAuthUser } from '../store/auth/actions';

const App = () => {
    const dispatch = useDispatch(); // TODO move inside root
    useEffect(() => {
        dispatch(loadAuthUser());
    }, [dispatch]);

    return (
        <ReduxProvider store={ store }>
            <BrowserRouter>
                <ThemeProvider theme={ theme }>
                    <Root />
                </ThemeProvider>
            </BrowserRouter>
        </ReduxProvider>
    );
}

export default App;
