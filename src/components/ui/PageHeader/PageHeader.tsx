import React from 'react';
import Divider from '@material-ui/core/Divider';
import './PageHeader.scss';
import Typography from '@material-ui/core/Typography';

interface Props {
    title: string;
}

const PageHeader = ({ title }: Props) => (
    <div className="PageHeader">
        <Typography variant="h3">{ title }</Typography>
        <Divider />
    </div>
);

export default PageHeader;
