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
import Container from '@material-ui/core/Container'
import { Redirect, Route, Switch } from 'react-router'
import ProtectedRoute, { Rule } from '@craigmiller160/react-protected-route'
import { useSelector } from 'react-redux'
import { ReduxAlert } from '@craigmiller160/react-material-ui-common'
import Clients from './Clients'
import { isAuthorized } from '../../../store/auth/selectors'
import Home from './Home'
import Users from './Users'
import ClientDetails from './Clients/ClientDetails'
import './Content.scss'
import UserDetails from './Users/UserDetails'

interface RuleProps {
  isAuth: boolean
}

const Content = () => {
  const isAuth = useSelector(isAuthorized)

  const isAuthRule: Rule<RuleProps> = {
    allow: (ruleProps?: RuleProps) => ruleProps?.isAuth ?? false,
    redirect: '/',
  }

  return (
    <Container className="Content">
      <ReduxAlert id="global-alert" />
      <Switch>
        <ProtectedRoute
          path="/clients"
          exact
          component={Clients}
          ruleProps={{
            isAuth,
          }}
          rules={[ isAuthRule ]}
        />
        <ProtectedRoute
          path="/clients/:id"
          component={ClientDetails}
          ruleProps={{
            isAuth,
          }}
          rules={[ isAuthRule ]}
        />
        <ProtectedRoute
          path="/users"
          component={Users}
          exact
          ruleProps={{
            isAuth,
          }}
          rules={[ isAuthRule ]}
        />
        <ProtectedRoute
          path="/users/:id"
          component={UserDetails}
          ruleProps={{
            isAuth,
          }}
          rules={[ isAuthRule ]}
        />
        <Route path="/" exact component={Home} />
        <Redirect to="/" />
      </Switch>
    </Container>
  )
}

export default Content
