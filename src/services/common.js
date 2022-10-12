// 用于定义公共 业务接口
import request from '@utils/request';

export const getUserDataAuthTree = () => {
  return request({
    url: '/pricecenter/TempAccoun111',
  });
};

const SaleEnumUrl = '/ite11emMatchRenumList';
export const querySaleEnumList = () => {
  return request({
    url: SaleEnumUrl,
    params: { dataType: 'saleChannel' },
  });
};

export const querySaleEnumStatusList = () => {
  return request({
    url: SaleEnumUrl,
    params: { dataType: 'saleStatus' },
  });
};

export const skuSaleStatusList = [
  { value: 1, label: '发大' },
  { value: 4, label: '放到' },
];

// 查询商品（售卖）状态
export const querySaleStatusEnumPost = () => {
  return request({
    url: '/itewwmSaleStatusEnum',
    params: { dataType: 'saleChannel' },
  });
};
