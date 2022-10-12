import React, { useState, useEffect } from 'react';

import { Nav, Icon } from '@alifd/next';
import { Link } from 'dva/router';

const NavItem = Nav.Item;
const { SubNav } = Nav;

const SideNav = ({ menuDatas, openNavKeys, selectedNavKeys, setNavOpen, setNavSelect }) => {
  const [navContent, setContent] = useState();
  useEffect(() => {
    if (!menuDatas) return;
    // showIcon 有个妙用，第一次调用的时候，设置为false，以后都设置为true，
    // 就可以在导航的第一层级做特殊处理，比如下面 第一层菜单 会 都有图标，后面层级的菜单不显示icon
    const getNav = (menulist, showIcon) => {
      return menulist.map((item) => {
        const { path, name } = item;

        if (item.children) {
          return (
            <SubNav
              key={name}
              label={name}
              icon={showIcon ? <Icon size="xs" type="account" style={{ marginRight: '5px' }} /> : undefined}
            >
              {getNav(item.children, false)}{' '}
            </SubNav>
          );
        }

        // relation 关联某个path， 一般指 新增、编辑 等按钮页面 不需要展示
        if (item.relation) {
          return null;
        }

        return (
          <NavItem key={path}>
            <Link key={path} to={path}>
              <span>
                {showIcon && <Icon size="xs" type="account" style={{ marginRight: '5px' }} />}
                <span className="ice-menu-collapse-hide">{name}</span>
              </span>
            </Link>
          </NavItem>
        );
      });
    };

    setContent(getNav(menuDatas, true));
  }, [menuDatas]);

  return (
    <Nav
      onSelect={setNavSelect}
      onOpen={setNavOpen}
      selectedKeys={selectedNavKeys}
      openKeys={openNavKeys}
      openMode="single"
      selectMode="single"
      mode="inline"
      type="primary"
      direction="ver"
    >
      {navContent}
    </Nav>
  );
};

export default SideNav;
