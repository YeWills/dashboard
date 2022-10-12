import React from 'react';

const defaultColumn = [
  {
    title: '号码',
    dataIndex: 'dfad',
    width: 120,
    lock: 'left',
  },
  {
    title: '名称',
    dataIndex: 'fafsd',
    width: 150,
    lock: 'left',
  },
  {
    title: '代号1',
    dataIndex: 'fadsf',
    width: 90,
  },
  {
    title: '代号2',
    dataIndex: 'wewfrewr',
    width: 100,
  },

  {
    title: '顺序',
    dataIndex: 'usersfgSignOrder',
    width: 100,
    cell: (val) => {
      if (val === true) return '是';
      if (val === false) return '否';
      return '';
    },
  },
  {
    title: 'ok',
    dataIndex: 'signdfFlowBilsdfglCountROS',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'rugsdleStsdfatus',
    width: 100,
    cell: (val) => {
      const maps = { 0: '停用', 1: '启用' };
      return maps[val] || '';
    },
  },
  {
    title: '提交信息',
    dataIndex: '_create',
    width: 140,
  },
  {
    title: '最近更新',
    dataIndex: '_update',
    width: 140,
  },
  {
    title: '操作',
    dataIndex: 'handle',
    lock: 'right',
    width: 100,
  },
];

export default defaultColumn;
