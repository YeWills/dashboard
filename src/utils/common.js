import React from 'react';
import moment from 'moment';

// 范围日期组件 默认禁用当天以前日期 //timeStr: 2021-03-09 10:36:01
export const getDisabledDateHandler = (timeStr) => {
  return (current) => {
    return current < moment(timeStr);
  };
};

const checkButton = (key, list) => {
  const flag = false;

  return flag;
};

// 获取url参数
const queryString = (name) => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
};

// 获取url参数
const queryString2 = (name) => {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] == name) {
      return pair[1];
    }
  }
  return '';
};

// 数组内容合并
const propListToString = (list, key, depart = null) => {
  let str = '';
  let departStr = '';
  for (let i = 0; i < list.length; i++) {
    departStr = depart ? `(${list[i][depart]})` : '';
    str += `${list[i][key]}${departStr},`;
  }
  return str.substring(0, str.length - 1);
};

// 获取动态路由参数
const getDynamicRouteParams = (pathName) => {
  const arr = pathName.split('/');
  const str = arr[arr.length - 1];
  if (str.indexOf('?') > -1) {
    return str.split('?')[0] || null;
  }
  return str;
};

// 新增cookie
const setCookie = (name, value, time) => {
  const _name = name;

  function getsec(str) {
    const str1 = str.substring(1, str.length) * 1;
    const str2 = str.substring(0, 1);
    if (str2 === 's') {
      return str1 * 1000;
    }
    if (str2 === 'h') {
      return str1 * 60 * 60 * 1000;
    }
    if (str2 === 'd') {
      return str1 * 24 * 60 * 60 * 1000;
    }
    if (str2 === 'y') {
      return str1 * 365 * 12 * 24 * 60 * 60 * 1000;
    }
  }

  const strsec = getsec(time);
  const exp = new Date();
  exp.setTime(exp.getTime() + strsec * 1);

  document.cookie = `${encodeURIComponent(String(_name))}=${encodeURIComponent(
    String(value),
  )}; expires=${exp.toUTCString()}; path=/`;
};

// 获取cookie
const getCookie = (name = '') => {
  let arr;
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  arr = document.cookie.match(reg);
  if (arr) return decodeURIComponent(arr[2]);
  return null;
};

// 清除cookie
const clearCookie = (name = '') => {
  const exp = new Date();
  exp.setTime(exp.getTime() - 1);
  const cval = getCookie(name);
  if (cval != null) {
    const { domain } = window.conf;
    // document.cookie = name + "=" + 0 + "; expires=" + exp.toUTCString() + ("; path=/") + ("; domain=" + domain);
    document.cookie = `${name}=0; expires=${exp.toUTCString()}; path=/; domain= + ${domain}`;
  }
};

// 将后台数据转为只有label和value的数据
function dealOriginalDataToCustomData(params = [], isNeedKey = false) {
  if (params && Array.isArray(params)) {
    const customData = [];
    const recursionFn = (itemList) => {
      const newItemList = [];
      for (let i = 0; i < itemList.length; i++) {
        const item = itemList[i];
        const newItem = {};
        newItem.label = item.label;
        newItem.value = item.value;
        if (isNeedKey) {
          newItem.key = item.value;
        }
        if (item.children && Array.isArray(item.children)) {
          newItem.children = recursionFn(item.children);
        }
        newItemList.push(newItem);
      }
      return newItemList;
    };
    for (let i = 0; i < params.length; i++) {
      const item = params[i];
      const newItem = {};
      newItem.label = item.label;
      newItem.value = item.value;
      if (isNeedKey) {
        newItem.key = item.value;
      }
      if (item.children && Array.isArray(item.children)) {
        newItem.children = recursionFn(item.children);
      }
      customData.push(newItem);
    }
    return customData;
  }
  return params;
}

// tree数据key全部转化为小写
const labelToLowerCase = (list) => {
  const newList = [];
  list.forEach((val) => {
    const newObj = {};
    for (const i in val) {
      newObj[i.toLowerCase()] = val[i];
    }
    if (val.children) {
      newObj.children = labelToLowerCase(val.children);
    }
    newList.push(newObj);
  });
  return newList;
};

export const toFixed = (num, precision = 2) => {
  // eslint-disable-next-line no-restricted-globals
  return isNaN(num) ? '' : Number(num).toFixed(precision);
};

export const requiredLable = (text, onClick) => {
  return (
    <span onClick={onClick}>
      <span style={{ color: 'red' }}>* </span>
      {text}
    </span>
  );
};
// 小数 转化为 百分比
export const numberToPercentage = (rate, decimalLeng = 2) => {
  if (isNaN(rate)) {
    return '';
  }
  return `${(Number(rate) * 100).toFixed(decimalLeng)} %`;
};

// 给字符串前加0 的函数
function padLeftZero(str) {
  return `00${str}`.substr(str.length);
}

export const formatDateTime = (value) => {
  const date = new Date(value);
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  let h = date.getHours();
  let i = date.getMinutes();
  let s = date.getSeconds();
  if (m < 10) {
    m = `0${m}`;
  }
  if (d < 10) {
    d = `0${d}`;
  }
  if (h < 10) {
    h = `0${h}`;
  }
  if (i < 10) {
    i = `0${i}`;
  }
  if (s < 10) {
    s = `0${s}`;
  }
  const t = `${y}-${m}-${d} ${h}:${i}:${s}`;
  return t;
};

// 过滤对象空属性
const filterObjectProperty = (obj) => {
  const newObj = {};
  for (const key in obj) {
    const emptyArray = Object.prototype.toString.call(obj[key]) === '[object Array]' && obj[key].length <= 0;
    const emptyObj = !obj[key] && obj[key] !== 0;
    if (!emptyArray && !emptyObj) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};
export const getNumberCheckReg = (leng) => {
  // 检查字符串是否为数字，且为正数，且保留leng小数点几位数
  return new RegExp(`^[1-9][0-9]*\\.[0-9]{0,${leng}}$|^[1-9][0-9]*$|^0\\.?$|^0\\.[0-9]{0,${leng}}$`);
};

export const numberCheck = (val, leng) => {
  // 检查字符串是否为数字，且保留leng小数点几位数
  const rex = getNumberCheckReg(leng);
  return rex.test(val);
};
export {
  queryString,
  queryString2,
  propListToString,
  getDynamicRouteParams,
  setCookie,
  getCookie,
  clearCookie,
  checkButton,
  dealOriginalDataToCustomData,
  labelToLowerCase,
  filterObjectProperty,
};
