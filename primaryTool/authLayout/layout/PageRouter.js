import React from 'react';
import { Route, Switch, Redirect } from 'dva/router';

// 导入路由
import Iframe from './iframe';
import Welcome from './common/Welcome';
import NoAuthority from './common/NoAuthority';

import PersonalDetail from './common/personalData/Detail';
import UpdatePassword from './common/personalData/UpdatePassword';

const PageRouter = ({ routeConfig, state, currentTab }) => {
  const getPageRoutes = (routes) => {
    let arr = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].component) {
        const Component = routes[i].component;
        arr.push(<Route key={routes[i].name} path={routes[i].path} component={Component} />);
      }
      if (routes[i].children) {
        arr = arr.concat(getPageRoutes(routes[i].children));
      }
    }
    return arr;
  };

  const getRoutes = (routes) => {
    let arr = getPageRoutes(routes);
    const systemName = 'tryq';
    arr = arr.concat([
      <Route
        key="iframe"
        path={`/${systemName}/iframe`}
        render={() => {
          return <Iframe currentTab={currentTab} />;
        }}
      />,
      <Route
        key="welcome"
        path={`/${systemName}/welcome`}
        render={() => {
          return <Welcome successData={state} />;
        }}
      />,
      <Route
        key="noAuthority"
        path={`/${systemName}/noauthority`}
        render={() => {
          return <NoAuthority successData={state} />;
        }}
      />,
      <Route
        key="personalDetail"
        path={`/${systemName}/personaldata/detail`}
        render={(props) => {
          return <PersonalDetail {...props} successData={state} />;
        }}
      />,
      <Route
        key="updatePassword"
        path={`/${systemName}/personaldata/updatepassword`}
        render={(props) => {
          return <UpdatePassword {...props} successData={state} />;
        }}
      />,
    ]);
    return arr;
  };

  return (
    <Switch>
      {getRoutes(routeConfig)}
      <Redirect to={`/tryq/welcome`} />
    </Switch>
  );
};

export default PageRouter;
