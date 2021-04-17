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

import React from 'react'
import { useRouteMatch } from 'react-router'
import {
  PageHeader,
  TabConfig,
  Tabs,
} from '@craigmiller160/react-material-ui-common'
import UserConfig from './UserConfig'
import UserGrants from './UserGrants'
import UserAuths from './UserAuths'
import './UserDetails.scss'
import { IdMatchParams, NEW_ID } from '../../../../../types/detailsPage'

const PATH_CONFIG = '/config'
const PATH_GRANTS = '/grants'
const PATH_AUTHS = '/auths'

const LABEL_CONFIG = 'Config'
const LABEL_GRANTS = 'Grants'
const LABEL_AUTHS = 'Authentications'

const UserDetails = () => {
  const match = useRouteMatch<IdMatchParams>()
  const { id } = match.params

  const tabs: Array<TabConfig> = [
    {
      label: LABEL_CONFIG,
      path: PATH_CONFIG,
      component: UserConfig,
    },
  ]
  if (id !== NEW_ID) {
    tabs.push({
      label: LABEL_GRANTS,
      path: PATH_GRANTS,
      component: UserGrants,
    })
    tabs.push({
      label: LABEL_AUTHS,
      path: PATH_AUTHS,
      component: UserAuths,
    })
  }

  return (
    <div className="UserDetails">
      <PageHeader title="User Details" />
      <Tabs tabs={tabs} />
    </div>
  )
}

export default UserDetails
