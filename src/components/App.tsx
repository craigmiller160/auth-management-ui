import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../store';
import Root from './Root';

const App = () => (
    <ReduxProvider store={ store }>
        <BrowserRouter>
            <Root />
        </BrowserRouter>
    </ReduxProvider>
);

export default App;
