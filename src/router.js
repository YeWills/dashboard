import React from 'react';
import { routerRedux, Switch, Redirect } from 'dva/router';
import LayoutRoute from '@pages/layoutRoute';

import Config from './config';

window.conf = { ...Config, ...window.conf };

const { ConnectedRouter } = routerRedux;

export default function ({ history }) {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <LayoutRoute />
        <Redirect to={`${Config.systemName}/welcome`} />
      </Switch>
    </ConnectedRouter>
  );
}
