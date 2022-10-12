/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Loading } from '@alifd/next';
import { withRouter } from 'dva/router';
// import sensors from 'sa-sdk-javascript';
import _ from 'loadsh';
import menuData from './mock/menudata';
import { getCookie } from '../../utils';
import { queryString } from './utils';
import styles from './index.scss';
import WaterMark from './common/WaterMark';
import SideNav from './SideNav';
import TopHeader from './TopHeader';
import TopTab from './TopTab';
import useNavTab from './useNavTab';
import PageRouter from './PageRouter';

const AuthLayout = ({ routeConfig, history }) => {
  const [noWindow] = useState(() => {
    return !!queryString('noWindow');
  });
  const [renderFlag] = useState(false);
  const [islogin] = useState(true);
  const [menuSize, setMenuSize] = useState('large');
  const [localMenu, setMenu] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      setMenu(menuData);
    }, 100);
  }, []);
  const {
    openNavKeys,
    selectedNavKeys,
    tabDatas,
    currentTab,
    tabMaps,
    setNavOpen,
    setNavSelect,
    // setTab,
    // setCurrentTab,
    menuDatas,
    onCloseTab,
  } = useNavTab({ menuDatas: localMenu, history, routeConfig });

  const checkTicket = () => {
    const url = window.location.href;
    const ac_session_id = getCookie('ac-session-id');
    console.log(ac_session_id);
    // if (!ac_session_id) {
    // 为了测试，此处默认都不读取，实际上应该以上面 !ac_session_id
    const test = 0;
    if (test) {
      window.location.href = `${window.conf.loginUrl}/?redirectUrl=${encodeURIComponent(url)}`;
    }
    if (islogin) {
      WaterMark({
        text: `${'尉迟恭'}-${2008}`,
      });
    }
  };

  useEffect(() => {
    checkTicket();
  }, []);

  return (
    <div className={styles.content}>
      <Loading visible={renderFlag} style={{ width: '100%' }} tip="加载中...">
        {!noWindow && <TopHeader history={history} menuSize={menuSize} setMenuSize={setMenuSize} />}
        <div className={styles.body} style={{ height: !noWindow ? 'calc(100vh - 60px)' : '100vh' }}>
          {!noWindow && (
            <div className={styles.slider} style={{ width: menuSize === 'large' ? 180 : 56 }}>
              <SideNav
                openNavKeys={openNavKeys}
                selectedNavKeys={selectedNavKeys}
                tabMaps={tabMaps}
                setNavOpen={setNavOpen}
                setNavSelect={setNavSelect}
                menuDatas={menuDatas}
              />
            </div>
          )}
          <div className={styles.main}>
            {!noWindow && (
              <div className={styles.tab}>
                <div className="tagGroup" hidden={tabDatas.length === 0}>
                  <TopTab datas={tabDatas} currentValue={currentTab} onCloseTab={onCloseTab} />
                </div>
              </div>
            )}
            <div className={styles.scrollContent}>
              <PageRouter currentTab={currentTab} routeConfig={routeConfig} />
            </div>
          </div>
        </div>
      </Loading>
    </div>
  );
};

AuthLayout.defaultProps = {
  openLocalMenu: false, // 是否打开本地菜单
  routeConfig: [],
  localMenu: [], // 本地菜单
  waterMark: true, // 是否显示水印
  enableAuthFrame: false, // 是否启用新旧权限中心交换session
};
export default withRouter(connect()(AuthLayout));
// export default AuthLayout;
