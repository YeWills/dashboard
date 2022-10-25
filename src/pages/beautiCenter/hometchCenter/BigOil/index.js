import React, { useCallback, useState } from 'react';
import { connect } from 'dva';
import { Loading } from '@alifd/next';
import { usePost } from '@utils/useHooks';
import Btn from './Btn';
import Select from './Select';

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

  const [num, onnum] = useState(0);
  const [flag, setFlag] = useState(false);
  // const ccc = () => {};
  const ccc = useCallback(() => {}, [num]);
  return (
    <Loading visible={loading} style={{ width: '100%' }} tip="加载中...">
      999999999999999887
      <div onClick={() => setFlag(!flag)}>反转</div>
      <div onClick={() => onnum((pre) => pre + 1)}>dianji</div>
      <div>{num}</div>
      <div>
        {[flag].map((item, in1) => {
          console.log('key', in1);
          if (item) {
            return <Btn key={in1} test={item.toString()}></Btn>;
          }
          return <Btn key={in1} test={item.toString()}></Btn>;
          // return <Select key={in1} test={item.toString()}></Select>;
        })}
      </div>
      <Btn test={ccc}></Btn>
    </Loading>
  );
};

const mapStateToProps = ({ GlobalState }) => {
  return {
    GlobalState,
  };
};

export default connect(mapStateToProps)(pageList);
