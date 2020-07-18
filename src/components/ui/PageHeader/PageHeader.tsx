import React from 'react';
import Divider from '@material-ui/core/Divider';
import './PageHeader.scss';
import Typography from '@material-ui/core/Typography';
import { Variant } from '@material-ui/core/styles/createTypography';

interface Props {
    title: string;
    variant?: Variant;
}

const PageHeader = ({ title, variant = 'h3' }: Props) => (
    <div className="PageHeader">
        <Typography variant={ variant }>{ title }</Typography>
        <Divider />
    </div>
);

export default PageHeader;
