import request from '@utils/request';
// 列表
export const queryItemSaleStatusInfoPost = (params) => {
  return request({
    url: '/authcenter/tableListPost',
    params,
  });
};
