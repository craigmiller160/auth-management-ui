import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../store';
import Root from './Root';
import theme from './theme';
import { ThemeProvider } from '@material-ui/core/styles';

const App = () => (
    <ReduxProvider store={ store }>
        <BrowserRouter>
            <ThemeProvider theme={ theme }>
                <Root />
            </ThemeProvider>
        </BrowserRouter>
    </ReduxProvider>
);

export default App;
