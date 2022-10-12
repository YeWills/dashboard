import React, { useState, useEffect } from 'react';
import { enHistory } from './utils';

const openDataKeyName = 'name';

function getMaps(datas, dataPaths) {
  let maps = {};
  datas.forEach((item) => {
    if (item.children) {
      const key = item[openDataKeyName];
      maps = { ...maps, ...getMaps(item.children, [...dataPaths, key]) };
    } else if (item.relation) {
      maps[item.path] = {
        // relation 关联某个path， 一般指 新增、编辑 等按钮页面 此时导航中只显示它对应的列表菜单
        // 此时 其导航 的数据只依赖 relation 的path，不用设置
        label: item.name,
        path: item.path,
        relation: item.relation,
      };
    } else {
      // 初始化写死的页面 默认没有search，不用设置
      maps[item.path] = {
        openKeys: dataPaths,
        selectKeys: item.path,
        label: item.name,
        path: item.path,
      };
    }
  });

  return maps;
}

function formateData(datas) {
  datas.forEach((item) => {
    if (item.children) {
      formateData(item.children);
    } else if (/^https?/.test(item.path)) {
      // 如果 http 开头说明是iframe嵌入
      // eslint-disable-next-line no-param-reassign
      item.path = `/tryq/iframe?url=${encodeURIComponent(item.path)}`;
    }
  });
}

const useNavTab = ({ menuDatas, history, routeConfig }) => {
  const [openNavKeys, setNavOpen] = useState([]);
  const [selectedNavKeys, setNavSelect] = useState([]);
  // 每个tab 对应的 openNavKeys 、selectedNavKeys 以及其他信息，
  // 以selectedNavKeys分析： 注意 会出现 多个tab 对应相同的 selectedNavKeys，比如列表、新增、详情 对应 相同selectedNavKeys
  const [tabMaps, setMap] = useState();

  const [tabDatas, setTab] = useState([]);
  // 真正组件使用的数据
  const [formateMenuDatas, setFormateMenuDatas] = useState([]);
  const [currentTab, setCurrentTab] = useState();

  const checkAuth = () => {
    const { pathname } = window.location;
    routeConfig;
    // 这里只是做一个演示，实际上就是用 routeConfig的path 与 pathname 比较；
    if (pathname === '/tryq/xingzCenter/UnAuth/List') {
      history.push('/tryq/noauthority');
      return false;
    }
    return true;
  };

  // 认为 menuDatas 就会引起tabMaps改变，因此监听tabMaps， 只有在页面初始化时才会改变，
  // 一旦menuDatas(tabMaps)稳定下来，页面将不会改变，所有的 导航和tab逻辑都基于此
  // 所以把页面刷新时，初始化 导航和tab 逻辑放到这里来，
  // 此设计待进一步验证 更多复杂情况 todo
  useEffect(() => {
    if (!tabMaps) return;
    // 路由权限控制
    if (!checkAuth()) return;

    let { pathname } = window.location;
    const { search } = window.location;

    const isIframePage = /\/tryq\/iframe/.test(pathname);

    // iframe 的路径特殊处理过， 见 formateData
    if (isIframePage) {
      pathname = `${pathname}${search}`;
    }

    const tabAndNavnfo = tabMaps[pathname];
    if (!tabAndNavnfo) return;

    if (tabAndNavnfo) {
      let { openKeys } = tabAndNavnfo;
      let { selectKeys } = tabAndNavnfo;
      if (tabAndNavnfo.relation) {
        openKeys = tabMaps[tabAndNavnfo.relation].openKeys;
        selectKeys = tabMaps[tabAndNavnfo.relation].selectKeys;
      }
      setNavOpen(openKeys);
      setNavSelect(selectKeys);

      setCurrentTab(pathname);
      setTab((pre) => {
        // iframe 页面没有 search 的说明，都是写死的完整 page url， 不需要考虑 search
        if (pre.find((t) => t.path === pathname)) {
          if (isIframePage) return pre;
          return pre.map((t) => ({
            ...t,
            search,
          }));
        }
        return [
          ...pre,
          {
            ...tabAndNavnfo,
            search: isIframePage ? undefined : search,
          },
        ];
      });
    }
  }, [tabMaps, window.location.href]);

  useEffect(() => {
    if (menuDatas) {
      const newData = JSON.parse(JSON.stringify(menuDatas));
      // 格式化数据
      formateData(newData);
      setFormateMenuDatas(newData);
      const maps = getMaps(newData, []);
      setMap(maps);
    }
  }, [menuDatas]);

  const onCloseTab = (tabKey) => {
    const newTabdata = tabDatas.filter((t) => t.path !== tabKey);
    setTab(newTabdata);
    enHistory(history, newTabdata[0].path, newTabdata[0].search);
  };

  const enSetNavSelect = (target) => {
    const path = target[0];
    // 注意不能使用 .push({ pathname: path }); 因为iframe的时候不兼容
    //  history.push({ pathname: path });
    // 我们假定 导航 上的 路由都只有path，而没有search，信息
    history.push(path);
  };

  return {
    openNavKeys,
    selectedNavKeys,
    tabDatas,
    currentTab,
    tabMaps,
    setNavOpen,
    setNavSelect: enSetNavSelect,
    // setTab,
    // setCurrentTab,
    onCloseTab,
    menuDatas: formateMenuDatas,
  };
};

export default useNavTab;
