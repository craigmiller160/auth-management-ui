import React, { useEffect } from 'react';
import { getClients } from '../services/ClientService';
import { ClientList } from '../types/api';

const App = () => {
    useEffect(() => {
        getClients()
            .then((res: ClientList | undefined) => {
                console.log(res); // TODO delete this
            });
    }, []);

    return (
        <h1>Hello World</h1>
    );
};

export default App;
