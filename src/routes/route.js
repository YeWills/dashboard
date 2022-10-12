import dynamic from 'dva/dynamic';
import Config from '@src/config';

const RuleManageList = dynamic({
  component: () => import('@pages/xingzCenter/RuleManage/List'),
});

const homeSales = dynamic({
  component: () => import('@pages/beautiCenter/lifeCycle/homeSales/index'),
});

const BigOilList = dynamic({
  component: () => import('@pages/beautiCenter/hometchCenter/BigOil'),
});

const DataManageList = dynamic({
  component: () => import('@pages/beautiCenter/hometchCenter/DataManage/List'),
});

const RuleManageEdit = dynamic({
  component: () => import('@pages/xingzCenter/RuleManage/Edit'),
});

const { systemName } = Config;
export default [
  // 商品中心
  {
    name: 'wrt',
    // path: `/${systemName}/regionalPrice/list`,
    // component: regionalPrice,
    children: [
      {
        name: 'wtr',
        children: [
          {
            name: 'wt',
            path: `/${systemName}/beautiCenter/hometchCenter/BigOil/index`,
            component: BigOilList,
          },

          {
            name: 'tw',
            path: `/${systemName}/beautiCenter/hometchCenter/DataManage/List`,
            component: DataManageList,
          },
        ],
      },
      {
        name: '5',
        children: [
          {
            name: '4',
            path: `/${systemName}/beautiCenter/lifeCycle/homeSales/index`,
            component: homeSales,
          },
        ],
      },
    ],
  },
  {
    name: 'ewrt',
    children: [
      {
        name: '3',
        path: '/tryq/xingzCenter/RuleManage/List',
        component: RuleManageList,
      },
      {
        name: '2',
        path: '/tryq/xingzCenter/RuleManage/Edit',
        component: RuleManageEdit,
      },
      {
        name: '1',
        path: '/tryq/xingzCenter/UnAuth/List',
        component: RuleManageEdit,
      },
    ],
  },
];
