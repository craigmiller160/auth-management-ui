import React, { useEffect } from 'react';
import { getClients } from '../services/ClientService';
import { ClientList } from '../types/api';
import { Option } from 'fp-ts/es6/Option';

const App = () => {
    useEffect(() => {
        getClients()
            .then((res: Option<ClientList>) => {
                console.log(res); // TODO delete this
            });
    }, []);

    return (
        <h1>Hello World</h1>
    );
};

export default App;
