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

// $SDK_signature 用于 验签失败(json.code == -9580106) 时，用于重新请求的时候加签用；
// $SDK_session 用于 验签失败(json.code == -9580106) 时，存储 session-id cookie，以便重新请求时使用；
// $SDK_acu_session 用于 验签失败(json.code == -9580106) 时，存储 ac-session-id cookie，以便重新请求时使用；

// 关于$SDK_signature的说明
// $SDK_signature 此为密钥，也是后端所说的secret，此参数非常重要，若无，则验证不通过，报错(json.code == -9580106)。
// 获取的方式是项目页面第一次打开时，任意发起一个请求，第一次请求肯定不会成功，但后端会在接口出参中返回给前端 这个 secret，
// sdk将这个secret 保存到 document.cookie 的 $SDK_signature 键值对中 以便以后的请求使用，
// 然后sdk再次发起请求，这次用上次的cookie 的 $SDK_signature ，就请求成功了，
// 接着以后所有的请求，因为有了$SDK_signature  只需发送一次就成功。

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
      if (json.code === -9580106) {
        console.log('验签失败，重新验签9580106');
        // 验签失败，重新验签
        // 重新设置新的secret,session-id,u-session-id,ac-session-id
        this.setCookie('$SDK_signature', json.info.secret, 8); // 秘钥
        this.setCookie('$SDK_session', json.ext['session-id'], 8); // 网关生成的
        if (json.ext['ac-session-id']) {
          // ac-session-id 用户登录
          this.setCookie('$SDK_acu_session', json.ext['ac-session-id']);
        }
        // 重新验签计数，大于4次则停止重新验签
        this._requestRepeatNum++;
        if (this._requestRepeatNum > 5) {
          console.error('请求签名设置异常！');
          this._requestRepeatNum = 0;
        } else {
          this.request(this._option);
        }
      } else if (json.code === 0) {
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

      // ！！！ 需要十分注意的是 ajaxParams 的属性赋值 必须严格属性名升序的方式顺序： ac-session-id appkey data session-id ....
      // ！！！ 打乱顺序，会导致 this.md5Encrypt(ajaxParams) 生成不同值，这样就会与后端固定顺序生成的 md5 码 不一致，校验失败
      // 参考 《网关-使用篇》
      ajaxParams['ac-session-id'] = this.getCookie('ac-session-id') || this.getCookie('$SDK_acu_session');
      ajaxParams.appkey = this._appkey;
      // 固定写法
      ajaxParams.sys = '3001';
      ajaxParams.data = JSON.stringify(params);
      ajaxParams['session-id'] = this.getCookie('$SDK_session') || this.getCookie('session-id');
      ajaxParams.timestamp = new Date().getTime();
      ajaxParams.userAgent = navigator.userAgent.trim();
      // version 指的是 网关协议 版本号
      ajaxParams.version = '632.011';

      // 防止session-id过期或串改 如何sessionid 不是 S_开头，说明是被串改，此时删除  session id，让请求不成功(阻止)
      ajaxParams['session-id'].indexOf('S_') === -1 ? [delete ajaxParams['session-id']] : '';

      // 进行sign签名
      ajaxParams.sign = this.md5Encrypt(ajaxParams);
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
        let key = i;
        const val = arg[key];
        if (key === 'userAgent') key = 'user-agent';
        val && [(param += key + val)];
      }
      return md5(this.getCookie('$SDK_signature') + param).toUpperCase();
    }
  }

  // 对外统一暴露$SDK方法
  // 疑问 为什么要 继承 $_SDK_Main 没有任何作用
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
