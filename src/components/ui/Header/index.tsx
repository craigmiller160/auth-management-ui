/*
 *     Auth Management UI
 *     Copyright (C) 2020 Craig Miller
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
