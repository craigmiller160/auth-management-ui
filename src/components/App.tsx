import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../store';

const App = () => (
    <ReduxProvider store={ store }>
        <BrowserRouter>
            <h1>Hello World</h1>
        </BrowserRouter>
    </ReduxProvider>
);

export default App;
