export default {
  columns: 3,
  type: 'query',
  fields: [
    {
      label: '教育编号',
      name: 'code',
    },
    {
      label: '老师',
      name: 'name',
    },
    {
      label: '类别',
      name: 'type',
    },
  ],
  btns: [
    { type: 'submit', label: '查询' },
    { type: 'reset', label: '重置' },
  ],
};
