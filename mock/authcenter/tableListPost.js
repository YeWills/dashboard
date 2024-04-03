/**
 * 列表信息
 * @url /authcenter/tableListPost
 * Here you can write a detailed description
 * of the parameters of the information.
 */

const data = {
  ext: {
    'ac-session-id': 'AC_16110fa0ad45444a669c046dac888ea89d',
    'u-session-id': '',
    'session-id': 'S_867234a3325-f175-4f5b-91a0-e44ef6bd4f96',
  },
  info: {
    totalSize: 261085,
    pageNo: 1,
    pageSize: 10,
    resultList: [
      {
        code: '1001',
        name: '黄小明',
        type: '语文',
        mark: '幽默',
      },
      {
        code: '1002',
        name: '李大海',
        type: '数学',
        mark: '风趣',
      },
      {
        code: '1003',
        name: '雷小军',
        type: '计算机',
        mark: '伟人',
      },
    ]

  },
  msg: '成功',
  statusText: '成功',
  traceId: 'tryqapiplus:dS2EdhDTixNphWDrAFtS7Ade575066',
};
module.exports = {
  'code|1': [0, 0, 0, 0, 1], // simulation error code, 1/5 probability of error code 1.
  'message|1': ['success', 'success', 'success', 'success', 'fail'],
  ...data,
};
