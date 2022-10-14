/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-eval */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-classes-per-file */
import md5 from 'md5';

const w = window;
const d = document;

const SDK = (superParams = {}) => {
  const { appkey } = superParams;
  const _appkey = appkey || '';

  class $_SDK_Main {
    constructor() {
      this._option = {}; // $SDK.request入参对象
      this._requestRepeatNum = 0; // 请求重发计数
      this._callback = () => {}; // 成功回调函数,code = 0
      this._callbackFail = () => {}; // 失败回调函数,code != 0
      this.requestHeader = {}; // 设置的请求头，来自入参
    }

    // 格式化参数
    formatParams(data) {
      const arr = [];
      for (const name in data) {
        arr.push(`${encodeURIComponent(name)}=${encodeURIComponent(data[name])}`);
      }
      arr.push(`v=${Math.random()}`.replace('.', ''));
      return arr.join('&');
    }

    // 获取Cookie
    getCookie(c_name) {
      if (c_name) {
        if (d.cookie.length > 0) {
          const value = new RegExp(`(?:^|; )${escape(String(c_name))}=([^;]*)`).exec(document.cookie);
          return value ? unescape(value[1]) : '';
        }
        return '';
      }
      return '';
    }

    // 设置Cookie
    setCookie(c_name, value, expiredays) {
      const exdate = new Date();
      exdate.setTime(exdate.getTime() + expiredays * 60 * 1000);
      d.cookie = `${escape(c_name)}=${escape(value)}${
        expiredays == null ? '' : `;expires=${exdate.toGMTString()}`
      }; path=/`;
    }

    // 设置请求头
    setRequestHeader(xhr, form) {
      for (const header in this.requestHeader) {
        xhr.setRequestHeader(header, this.requestHeader[header]);
      }
      form && xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    // 请求返回code处理
    setCode(json, xml) {
      if (typeof json === 'string' && json.indexOf('{') > -1 && json.indexOf(':') > -1 && json.indexOf('}') > -1)
        json = eval(`(${json})`);
      if (json.code === 0) {
        delete json.ext;
        this._callback(json, xml);
      } else {
        // 返回code ！= 0 时其他情况下执行fail回调
        delete json.ext;
        this._callbackFail && this._callbackFail(json, xml);
        console.warn(json.msg || '系统发生未知异常！');
      }
    }

    // ajax方法
    ajax(opt = {}) {
      const options = opt;
      options.url = options._url || options.url;
      options.type = (options.type || 'GET').toUpperCase();
      options.dataType = options.dataType || 'json';
      const params = this.formatParams(options.data);
      let xhr = {};

      // 设置请求头
      this.requestHeader = options.requestHeader;

      // 创建 XMLHttpRequest
      if (w.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      }
      // 设置跨域cookie
      xhr.withCredentials = true;

      // 接收监听
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          const { status } = xhr;
          if (status >= 200 && status < 300) {
            options.success && [(this._callback = options.success)];
            options.fail && [(this._callbackFail = options.fail)];
            this.setCode(xhr.responseText, xhr.responseXML);
          } else {
            options.fail &&
              options.fail({
                msg: 'error!',
                code: status,
              });
          }
        }
      };

      // 连接发送
      if (options.type === 'GET') {
        xhr.open('GET', `${options.url}?${params}`, true);
        this.setRequestHeader(xhr);
        xhr.send(null);
      } else if (options.type === 'POST') {
        xhr.open('POST', options.url, true);
        this.setRequestHeader(xhr, true);
        xhr.send(params);
      }
    }

    // request方法，对不同类型的请求进行统一管理
    request(opt = {}) {
      const { api, type, result, fail, requestHeader, params = {} } = opt;
      // 将属性值为空的入参去除
      const ajaxParams = {};

      this._option = opt;

      ajaxParams.data = JSON.stringify(params);
      ajaxParams.mdk = 'pro';
      delete ajaxParams.userAgent;

      this.ajax({
        url: api,
        type,
        data: ajaxParams,
        requestHeader,
        success: result,
        fail,
      });
    }

    // md5加签方法
    md5Encrypt(arg) {
      let param = '';
      for (const i in arg) {
        const key = i;
        const val = arg[key];
        val && [(param += key + val)];
      }
      return md5(this.getCookie('$SDK_signature') + param);
    }
  }

  // 对外统一暴露$SDK方法
  class $_SDK extends $_SDK_Main {
    constructor() {
      super();
      this._appkey = '1111';
      this._requestRepeat = false;
      this._timeDifference = 0;
      this.clearTimeout = {};
    }

    // 对外统一暴露request方法
    request(opt) {
      // 对每个request请求进行实例化
      const main = new $_SDK_Main();
      main._appkey = _appkey || this._appkey;
      main.request(opt);
    }
  }

  if (typeof $SDK === 'undefined') {
    w.$SDK = new $_SDK();
  }
};
export default SDK;
