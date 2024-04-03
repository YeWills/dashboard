import React from 'react';
import moment from 'moment';


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
  setCookie,
  getCookie,
  checkButton,
};
