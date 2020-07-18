import React from 'react';
import Divider from '@material-ui/core/Divider';
import './Header.scss';
import Typography from '@material-ui/core/Typography';
import { Variant } from '@material-ui/core/styles/createTypography';

interface HeaderProps {
    title: string;
    variant?: Variant;
}

interface PublicProps {
    title: string;
}

const Header = ({ title, variant }: HeaderProps) => (
    <div className="Header">
        <Typography variant={ variant }>{ title }</Typography>
        <Divider />
    </div>
);

export const PageHeader = ({ title }: PublicProps) => <Header title={ title } variant="h3" />;
export const SectionHeader = ({ title }: PublicProps) => <Header title={ title } variant="h5" />;
