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

import React, { useEffect } from 'react'
import './UserAuths.scss'
import { pipe } from 'fp-ts/es6/pipeable'
import * as TE from 'fp-ts/es6/TaskEither'
import * as T from 'fp-ts/es6/Task'
import { useImmer } from 'use-immer'
import LockOpen from '@material-ui/icons/LockOpen'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { SectionHeader } from '@craigmiller160/react-material-ui-common'
import { nanoid } from 'nanoid'
import { IdMatchProps, NEW_ID } from '../../../../../types/detailsPage'
import { formatApiDateTime } from '../../../../../utils/date'
import List, { Item } from '../../../../ui/List'
import { UserAuthDetails, UserAuthDetailsList } from '../../../../../types/user'
import {
  getAllUserAuthDetails,
  revokeUserAuthAccess,
} from '../../../../../services/UserService'

interface State {
  userId: number
  userAuths: UserAuthDetailsList
}
interface Props extends IdMatchProps {}

const defaultUserAuths: UserAuthDetailsList = {
  email: '',
  authDetails: [],
}

const UserAuths = (props: Props) => {
  const { id } = props.match.params
  const [ state, setState ] = useImmer<State>({
    userId: id !== NEW_ID ? parseInt(id, 10) : 0,
    userAuths: defaultUserAuths,
  })

  useEffect(() => {
    const action = () =>
      pipe(
        getAllUserAuthDetails(state.userId),
        TE.fold(
          (): T.Task<UserAuthDetailsList> => T.of(defaultUserAuths),
          (userAuths: UserAuthDetailsList) => T.of(userAuths),
        ),
        T.map((userAuths: UserAuthDetailsList) =>
          setState((draft) => {
            draft.userAuths = userAuths
          }),
        ),
      )()

    action()
  }, [ setState, state.userId ])

  const doRevoke = (clientId: number) => {
    pipe(
      revokeUserAuthAccess(state.userId, clientId),
      TE.map(() =>
        state.userAuths.authDetails.filter(
          (auth) => auth.clientId !== clientId,
        ),
      ),
      TE.fold(
        (): T.Task<UserAuthDetails[]> => T.of(state.userAuths.authDetails),
        (authDetails: UserAuthDetails[]): T.Task<UserAuthDetails[]> =>
          T.of(authDetails),
      ),
      T.map((authDetails: UserAuthDetails[]) =>
        setState((draft) => {
          draft.userAuths.authDetails = authDetails
        }),
      ),
    )()
  }

  const items: Array<Item> = state.userAuths.authDetails.map((auth) => ({
    uuid: nanoid(),
    avatar: () => <LockOpen />,
    text: {
      primary: `Client: ${auth.clientName}`,
      secondary: `Last Authenticated: ${formatApiDateTime(
        auth.lastAuthenticated,
      )}`,
    },
    secondaryActions: [
      {
        uuid: nanoid(),
        text: 'Revoke',
        click: () => doRevoke(auth.clientId),
      },
    ],
  }))

  return (
    <div className="UserAuths">
      <SectionHeader title={state.userAuths.email} noDivider />
      {items.length > 0 && (
        <Grid container direction="row" justify="center">
          <Grid item md={6}>
            <List items={items} />
          </Grid>
        </Grid>
      )}
      {items.length === 0 && (
        <Grid container direction="row" justify="center">
          <Typography variant="body1">Not Authenticated</Typography>
        </Grid>
      )}
    </div>
  )
}

export default UserAuths
