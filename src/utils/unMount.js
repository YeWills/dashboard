import React from 'react';

export const unMountWhenHide = (Comp) => {
  return (props) => {
    const { visible } = props;
    return visible ? <Comp {...props} /> : null;
  };
};
