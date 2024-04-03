import React, { useEffect } from 'react';
import { connect } from 'dva';

const pageList = ({ test }) => {
  useEffect(() => {
    console.log('123');
  }, []);
  return <div>{test}</div>;
};

const mapStateToProps = ({ GlobalState }) => {
  return {
    GlobalState,
  };
};

export default connect(mapStateToProps)(pageList);
