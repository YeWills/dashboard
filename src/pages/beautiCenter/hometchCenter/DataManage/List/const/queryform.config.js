export default {
  columns: 3,
  type: 'query',
  fields: [
    {
      label: '名称',
      name: 'skuName',
    },
    {
      label: '号码',
      name: 'code',
    },
  ],
  btns: [
    { type: 'submit', label: '查询' },
    { type: 'reset', label: '重置' },
  ],
};
