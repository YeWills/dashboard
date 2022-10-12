import React from 'react';
import { connect } from 'dva';
import { Route } from 'dva/router';
import { AliveScope } from 'react-activation';
import { Layout } from '@primaryTool';
import routeConfig from '@routes/route';
import localMenu from '@routes/menu';

class LayoutRoute extends React.Component {
  onSuccessLoad = (successData) => {
    const { userMsg, tabPanes, systemList, systemSelected, menuBtnList, sliderList, allMenuBtnList } = successData;
    const { currentLedger } = userMsg;
    this.props.dispatch({
      type: 'GlobalState/updateState',
      payload: {
        userId: userMsg.id,
        userMsg,
        weight: userMsg.minWeight,
        ledgerId: currentLedger && currentLedger.id,
        ledgerCode: currentLedger && currentLedger.code,
        ledgerName: currentLedger && currentLedger.ledgerName,
        systemList, // 系统列表
        systemSelected, // 当前选中的系统
        companyName: currentLedger && currentLedger.companyName,
        companyId: currentLedger && currentLedger.companyId,
        menuBtnList, // 菜单按钮
        sliderList, // 侧边栏数据
        allMenuBtnList, // 所有菜单权限相关数据，
        tabPanes,
      },
    });
  };

  render() {
    const { systemName, openLocalMenu, loginUrl, env } = window.conf;
    return (
      <AliveScope>
        <Route
          path="/"
          render={(props) => {
            return (
              <Layout
                {...props}
                routeConfig={routeConfig}
                env={env}
                loginUrl={loginUrl}
                localMenu={localMenu}
                systemName={systemName}
                onSuccessLoad={this.onSuccessLoad}
                openLocalMenu={openLocalMenu}
              />
            );
          }}
        />
      </AliveScope>
    );
  }
}
const mapStateToProps = ({ GlobalState }) => {
  return {
    GlobalState,
  };
};
export default connect(mapStateToProps)(LayoutRoute);
