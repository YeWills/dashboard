/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import fetch from 'dva/fetch';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

const parseQuery = (obj) => {
  let str = '';
  for (const key in obj) {
    const value = typeof obj[key] !== 'string' ? JSON.stringify(obj[key]) : obj[key];
    str += `&${key}=${value}`;
  }
  return str.substr(1);
};

const fetchData = (url, data, method = 'post') => {
  const options = {
    method, // HTTP请求方法，默认为GET
    headers: {
      // HTTP的请求头，默认为{}
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    // mode: 'cors',
    credentials: 'include', // 是否携带cookie，默认为omit,不携带; same-origi,同源携带; include,同源跨域都携带
  };
  if (method === 'GET') {
    url += `?${parseQuery(data)}`;
  } else {
    options.body = parseQuery(data);
  }
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => ({ data }))
    .catch((err) => ({ err }));
};
export default fetchData;
