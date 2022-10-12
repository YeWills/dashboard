import React from 'react';

const unMountWhenHide = (Comp) => {
  return (props) => {
    const { visible } = props;
    return visible ? <Comp {...props} /> : null;
  };
};

export default unMountWhenHide;
