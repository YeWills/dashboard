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
        level3CategoryName: '道可道',
        brandName: '道可道',
        level3CategoryId: 20166,
        updateTime: '2019-12-25 20:01:37',
        supplierCode: '道可道',
        bizMark: 12,
        kzSkuCode: '1245',
        skuName: 'ada2z',
      },

      {
        level3CategoryName: '非常道',
        brandName: '非常道',
        level3CategoryId: 20111,
        supplierCode: '非常道',
        kzSkuCode: '72898ddd1',
        skuName: '非常道',
      },
    ],
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
