import React from 'react';
import { connect } from 'dva';
import { Button } from '@alifd/next';
import Title from '../title';

class PersonalDetail extends React.Component {
  render() {
    return (
      <div style={{ padding: '12px' }}>
        <Title title="个人信息"></Title>
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Button onClick={this.props.history.goBack}>返回</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ GlobalState }) => {
  return {
    GlobalState,
  };
};

export default connect(mapStateToProps)(PersonalDetail);
