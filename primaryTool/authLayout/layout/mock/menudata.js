const data = [
  {
    name: '教育中心',
    children: [
      {
        name: '素质教育',
        children: [
          {
            name: '家庭教育',
            path: `/tryq/beautiCenter/hometchCenter/BigOil/index`,
          },
          {
            name: '学校教育',
            path: `/tryq/beautiCenter/hometchCenter/DataManage/List`,
          },
        ],
      },
      {
        name: '普通教育',
        children: [
          {
            name: '游学',
            path: `/tryq/beautiCenter/lifeCycle/homeSales/index`,
          },
        ],
      },
    ],
  },
  {
    name: '行政中心',
    children: [
      {
        name: '行政规则管理',
        path: '/tryq/xingzCenter/RuleManage/List',
      },
      {
        name: '行政规则编辑',
        path: '/tryq/xingzCenter/RuleManage/Edit',
        relation: '/tryq/xingzCenter/RuleManage/List',
      },
      {
        name: '无权限测试页面',
        path: '/tryq/xingzCenter/UnAuth/List',
      },
      {
        name: '区域搜狐ifarme',
        path: `http://news.sohu.com/20080820/n259034934.shtml`,
      },
      {
        name: '网易ifram订单页面',
        path: 'http://tryq.163.com/09/0904/15/5ICL5DJH00903G4Q.html',
      },
    ],
  },
  {
    name: '实训中心',
    children: [
      {
        name: '搜狐2005页面',
        path: 'http://news.sohu.com/s2009/9616/s267059966/',
      },
      {
        name: '新浪ifram管理',
        path: 'http://blog.sina.com.cn/s/blog_563cd28701008h4j.html',
      },
    ],
  },
];

export default data;
