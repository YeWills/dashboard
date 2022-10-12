import React from 'react';
import { connect } from 'dva';

class pageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      param: {},
      loading: false,
      removeTagVisible: false,
      setTagVisible: false,
      status: '',
      id: '',
    };
  }

  render() {
    return (
      <div visible={this.state.loading} style={{ width: '100%' }} tip="加载中...">
        999999999999999999
      </div>
    );
  }
}

const mapStateToProps = ({ GlobalState }) => {
  return {
    GlobalState,
  };
};

export default connect(mapStateToProps)(pageList);
