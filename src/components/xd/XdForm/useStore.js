import React, { useReducer } from 'react';

// values 用于定义 form表单自定义组件value信息， errors用于定义自定义表单验证错误信息
// values与errors使用相同:
// 存储值：
// fDispatch({
//     type: "setValues",
//     preload: [{ name: 'test', value: 'testvalue' }]//数组形式，考虑可能会一次赋值多个
//   });
// 获取值: store.values?.test

// XdForm 提供了 action 与 store 两个接口，接收上面的fDispatch 与 store；
// XdForm 将上面的能力给予每个自定义组件；

const initialState = { values: {}, errors: {} };

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
      return { ...state, values: { ...values, ...updates } };
    }
    case 'resetValues':
      return { ...state, values: {} };
    case 'reset':
      return { ...state, errors: {}, values: {} };
    default:
      throw new Error();
  }
}

const useStore = () => {
  const [formStore, fDispatch] = useReducer(reducer, initialState);
  return [formStore, fDispatch];
};

export default useStore;
