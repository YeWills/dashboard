/* eslint-disable eqeqeq */
import React, { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'setErrors': {
      const { erros } = state;
      const { preload } = action;
      const updates = preload.reduce((acc, { name, value }) => {
        acc[name] = value;
        return acc;
      }, {});
      return { ...state, errors: { ...erros, ...updates } };
    }
    case 'resetErrors':
      return { ...state, errors: {} };
    case 'setValues': {
      const { values } = state;
      const { preload } = action;
      const updates = preload.reduce((acc, { name, value }) => {
        acc[name] = value;
        return acc;
      }, {});
      // _isValueChange 用于标识form的store values是否重新被赋值，可用场景有表单编辑的保存按钮，若无变化则禁用
      return {
        ...state,
        values: { ...values, _isValueChange: true, ...updates },
      };
    }
    case 'resetValues':
      return { ...state, values: {} };
    case 'reset':
      return { ...state, errors: {}, values: {} };
    default:
      throw new Error();
  }
}

function init(initialState) {
  return { values: { ...initialState }, errors: {} };
}

const Wrap = ({ children, FormContext, initialState = {}, ...rest }) => {
  const [formStore, fDispatch] = useReducer(reducer, initialState, init);

  return (
    <FormContext.Provider value={fDispatch}>
      {React.cloneElement(children, {
        ...children.props,
        ...rest,
        formStore,
        action: fDispatch,
      })}
    </FormContext.Provider>
  );
};

export default Wrap;
