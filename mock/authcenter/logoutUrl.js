/**
 * 获取登出地址
 * @url /authcenter/logoutUrl
 * Here you can write a detailed description
 * of the parameters of the information.
 */
const data = {
  ext: {
    'ac-session-id': 'AC_160fa0ad45444a669',
    'u-session-id': '',
    'session-id': 'S_867a3325-f175-4f5b-91a0-e',
  },
  info: 'https://test-tryq.com',
  msg: '成功',
  statusText: '成功',
  traceId: 'tryqapiplus:A580gQiSrwv3sLVDvKVRUAde',
};
module.exports = {
  'code|1': [0, 0, 0, 0, 0], // simulation error code, 1/5 probability of error code 1.
  'message|1': ['success', 'success', 'success', 'success', 'success'],
  ...data,
};
