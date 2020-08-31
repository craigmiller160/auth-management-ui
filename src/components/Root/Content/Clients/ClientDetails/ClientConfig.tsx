import React from 'react';
import { Prompt } from 'react-router';

const ClientConfig = () => {
    return (
        <div className="ClientConfig">
            <Prompt
                when={ false }
                message="Are you sure you want to leave? Any unsaved changes will be lost."
            />
            <form>

            </form>
        </div>
    );
};

export default ClientConfig;
