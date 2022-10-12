/* eslint-disable react/prefer-stateless-function */
import React from 'react';

const unRefHoc = (Comp) => {
  class UnRefComp extends React.Component {
    render() {
      const { ref, ...rest } = this.props;
      return <Comp {...rest} />;
    }
  }
  return UnRefComp;
};

export default unRefHoc;
