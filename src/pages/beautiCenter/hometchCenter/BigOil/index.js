import React from 'react';
import { connect } from 'dva';
import { Loading } from '@alifd/next';
import { usePost } from '@utils/useHooks';

const pageList = () => {
  // eslint-disable-next-line no-unused-vars
  const [postHandler, loading, refreshKey] = usePost({ unRefresh: false });

  // const postAdd = (formValue) => {
  //   postHandler(
  //     largeinsertMatchRef,
  //     { ...formValue },
  //     {
  //       errAssert: usePost.errAssert,
  //     },
  //   ).then(
  //     ...usePost.event((data) => {
  //       console.log(data);
  //       if (data) {
  //         Message.success('新增成功');
  //       }
  //     }),
  //   );
  // };

  return (
    <Loading visible={loading} style={{ width: '100%' }} tip="加载中...">
      999999999999999887
    </Loading>
  );
};

const mapStateToProps = ({ GlobalState }) => {
  return {
    GlobalState,
  };
};

export default connect(mapStateToProps)(pageList);
