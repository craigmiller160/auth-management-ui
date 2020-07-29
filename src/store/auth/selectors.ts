import { createSelector } from '@reduxjs/toolkit';
import { AuthUser } from '../../types/oldApi';
import { Option, isSome } from 'fp-ts/es6/Option';
import { RootState } from '../index';

const userDataSelector = (state: RootState): Option<AuthUser> => state.auth.userData;

export const isAuthorized = createSelector(
    userDataSelector,
    (userData: Option<AuthUser>) => isSome(userData)
);
