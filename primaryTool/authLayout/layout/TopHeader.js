import React from 'react';
import { Button, Menu, Dropdown } from '@alifd/next';
import { request } from '../../utils';
import { Leftindent, Rightindent, userImgUrl } from './img';
import logoUrl from './image/big.jpg';
import Simplelogo from './image/sml.jpg';
import styles from './index.scss';

const TopHeader = ({ menuSize, setMenuSize, history }) => {
  const onPersonal = () => {
    history.push('/tryq/personaldata/detail');
  };
  const onUpdatePassword = () => {
    history.push('/tryq/personaldata/updatepassword');
  };
  const logoutClick = async () => {
    const res = await request({ url: '/exitPage' });
    if (res && Object.keys(res).length > 0) {
      window.location.href = `${res.url}/login?redirectUrl=${encodeURIComponent(window.location.href)}`;
    }
  };
  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerleft}>
          <div
            className={styles.logo}
            style={{
              width: menuSize === 'large' ? 180 : 56,
            }}
          >
            <img
              src={menuSize === 'large' ? logoUrl : Simplelogo}
              alt={logoUrl}
              style={{
                width: menuSize === 'large' ? 180 : 40,
                height: menuSize === 'large' ? 60 : 40,
              }}
            />
          </div>
          {menuSize === 'large' ? (
            <img src={Leftindent} alt="" className={styles.fold} onClick={() => setMenuSize('small')} />
          ) : (
            <img src={Rightindent} className={styles.fold} alt="" onClick={() => setMenuSize('large')} />
          )}

          <span className={styles.title}>管理中台</span>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.user}>
            {/* <img src={userImgUrl} alt={userImgUrl} className={styles.userPic} /> */}
            <div className={styles.menuBtn}>
              {/* <span className={styles.menuButton}>小龙虾</span> */}
            </div>
            <span className={styles.userName}>
              你好,
              <Dropdown
                trigger={
                  <Button type="primary" className={styles.persionBtn} text>
                    尉迟恭
                  </Button>
                }
                triggerType="click"
              >
                <Menu>
                  <Menu.Item onClick={onPersonal}>个人资料</Menu.Item>
                  <Menu.Item onClick={onUpdatePassword}>修改密码</Menu.Item>
                </Menu>
              </Dropdown>
            </span>
            <Button type="primary" size="large" text onClick={logoutClick} className={styles.logout}>
              退出
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopHeader;
