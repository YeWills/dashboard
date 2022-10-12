import React from 'react';
import { connect } from 'dva';
import { Loading } from '@alifd/next';
import KeepAlive from '@components/KeepAlive';

class pageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryparams: {},
    };
  }

  // 给个样子如何用
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

  render() {
    return (
      <Loading visible={false} style={{ width: '100%' }} tip="加载中...">
        管理周期
      </Loading>
    );
  }
}

const mapStateToProps = ({ GlobalState }) => {
  return {
    GlobalState,
  };
};

export default connect(mapStateToProps)(KeepAlive(pageList));
