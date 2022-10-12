import React, { useRef, useEffect } from 'react';
import KeepAlive, { useAliveController } from 'react-activation';
import { connect } from 'dva';
import { differenceBy } from 'loadsh';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const mapStateToProps = ({ GlobalState }) => {
  const { tabPanes = [] } = GlobalState;
  return {
    cacheKeys: tabPanes.map((tab) => tab.linkKey),
  };
};

const isEditPage = (path) => {
  // 其实也可以通过 约定 编辑性质的页面 带有关键字 /Edit 对此类进行过滤
  return path.includes('?');
};

const getMainPath = (path) => {
  let pathArr = path.split('/');
  if (pathArr[pathArr.length - 1] === '') {
    // 比如 /tryq/beautiCenter/hometchCenter/CheckManage/Detail/ 这种path 的时候，需要去除多余的最后一个 /
    pathArr = pathArr.slice(0, pathArr.length - 1);
  }
  return pathArr.slice(0, pathArr.length - 1).join('/');
};
const isExit = (arr, target) => {
  return arr.find((item) => {
    return item.includes(target);
  });
};

// 我们业务中，一般就三种类型页面  列表 编辑 详情， 目前只有列表、编辑需要缓存；详情不需要；
// 列表、编辑缓存的场景也不一样：
// 编辑页面未关闭，tab之间切换的时候，切换回来到编辑的时候，需要缓存编辑内容， 其他情况下 编辑页面都不要做缓存，否者出现 无法更新编辑页面的情况。
// 列表页面 则不仅以上情况要缓存；
// 而且 列表 切入到详情 编辑后，也应该做缓存，

const Comp = ({ render, cacheKeys }) => {
  const { drop, refresh, getCachingNodes } = useAliveController();
  const prevCacheKeys = usePrevious(cacheKeys);
  useEffect(() => {
    differenceBy(prevCacheKeys, cacheKeys).forEach((key) => {
      // 关闭的路由 比如 /tryq/beautiCenter/lifeCycle/Manage/List 去掉最后一个元素后 得到的 /tryq/beautiCenter/lifeCycle/Manage
      // 是否存在于当前打开的tab中，比如 tab 为 [/tryq/beautiCenter/lifeCycle/Manage/Detail] ,
      // 如果存在，说明有以下可能：
      // 列表页面 -> 详情页面 【缓存列表页面】
      // 列表页面 -> 编辑页面  【缓存列表页面】
      // 编辑页面 -> 列表页面 【这种情况即下面的isEditPage(key)，不需要做缓存，一般的业务逻辑就是，从编辑返回列表的其实不需要做缓存，只有不同tab之间切换时，编辑页面未关闭时，才需要缓存】
      // 详情页面 -> 列表页面 【缓存列表页面】
      const mainPath = getMainPath(key);
      const isExitInCurrentTabs = !!isExit(cacheKeys || [], mainPath);

      console.log(isExitInCurrentTabs, mainPath, key, cacheKeys);
      // 针对以上说明的情况，不要执行丢弃缓存
      if (isExitInCurrentTabs && !isEditPage(key)) {
        return;
      }

      refresh(key);
      drop(key);

      // 由于上面对 列表页面等 某些情况下没有去掉缓存，因此这里需要在以下情况时，去除这个缓存
      // 当关闭的页面不存在于当前的tab上时，说明是关闭了tab， 此时应该清除 当前页面 去掉最后一个元素，匹配到的 如 列表、详情、编辑 页面的缓存，都要去掉
      if (!isExitInCurrentTabs) {
        // getCachingNodes 获取 被缓存的所有页面
        const cashKeyNames = (getCachingNodes() || []).map((item) => item.name);
        const sameMainPathCashName = isExit(cashKeyNames, mainPath);
        if (sameMainPathCashName) {
          refresh(sameMainPathCashName);
          drop(sameMainPathCashName);
        }
      }
    });
  }, [cacheKeys]);
  return render();
};

const KeepAliveInner = connect(mapStateToProps)(Comp);

export default (PageComponent) => {
  return ({ ...props }) => {
    const cacheKey = `${props.location.pathname}${props.location.search}`;
    return (
      <KeepAlive name={cacheKey}>
        <KeepAliveInner {...props} render={() => <PageComponent {...props} />} />
      </KeepAlive>
    );
  };
};

// 推荐的规范路由, 下面路由也契合了列表进入详情时，保证tab key 改变，以便编辑页面缓存处理
// /tryq/marketCenter/actionManager/XNActivity/Detail  // 详情
// /tryq/marketCenter/actionManager/XNActivity/List  // 列表
