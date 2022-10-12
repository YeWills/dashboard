import React from 'react';
import Wrap from './Wrap';

const contextHoc = (FormContext, initialState) => {
  return (Comp) => {
    return (props) => {
      return (
        <Wrap FormContext={FormContext} initialState={initialState} {...props}>
          <Comp />
        </Wrap>
      );
    };
  };
};

export default contextHoc;
