import { getUserDataAuthTree } from '@services/common';

export default {
  namespace: 'goodimageSpace',
  state: {
    categoryList: [],
    imageSpaceList: [],
    imgTotalSize: 0,
    imgPageNo: 1,
    imgPageSize: 10,
    pageSizeList: [10, 50, 100], // 默认分页列表可选长度
    setImageSpaceResult: false, // 设置图片分类
    deleteImageSpaceResult: false, // 删除图片空间
    insertImageSpaceResult: false,
  },
  effects: {
    // 外部使用示例：
    // addCouponTemplate = async (parms) => {
    //   await this.props.dispatch({
    //     type: "goodimageSpace/getUserDataAuthTree",
    //     data: parms,
    //   });
    //   const { isAddSuccess } = this.props.CouponNew;
    //   if (isAddSuccess && JSON.stringify(isAddSuccess) != "{}") {
    //     Message.success("创建成功！");
    //     this.goBack();
    //     this.resetForm();
    //   }
    // };
    // 新增图片
    *getUserDataAuthTree(action, { put, call }) {
      let result = yield call(getUserDataAuthTree, action.data, true);
      if (typeof result !== 'boolean') {
        result = false;
      }
      yield put({ type: 'save', payload: { insertImageSpaceResult: result } });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
