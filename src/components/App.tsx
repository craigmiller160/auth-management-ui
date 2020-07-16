import React, { useEffect } from 'react';
import { getClients } from '../services/ClientService';

const App = () => {
    useEffect(() => {
        getClients()
            .then((res) => {
                console.log(res); // TODO delete this
            });
    }, []);

    return (
        <h1>Hello World</h1>
    );
};

export default App;
