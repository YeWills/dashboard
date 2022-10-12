import { Message } from '@alifd/next';

// 获取url参数
const queryString = (name) => {
  // 由于 ? 在new RegExp 转义有问题，因此用 [] 包含起来
  const reg = new RegExp(`([?]|&)${name}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.match(reg);
  if (r) {
    return decodeURIComponent(r);
  }
  return '';
};

// 新增cookie
const setCookie = (name, value, time = 'h8') => {
  const _name = name;
  function getsec(str) {
    const str1 = str.substring(1, str.length) * 1;
    const str2 = str.substring(0, 1);
    if (str2 == 's') {
      return str1 * 1000;
    }
    if (str2 == 'h') {
      return str1 * 60 * 60 * 1000;
    }
    if (str2 == 'd') {
      return str1 * 24 * 60 * 60 * 1000;
    }
    if (str2 == 'y') {
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
  if ((arr = document.cookie.match(reg))) return decodeURIComponent(arr[2]);
  return null;
};

// 清除cookie
const clearCookie = (name = '') => {
  const exp = new Date();
  exp.setTime(exp.getTime() - 1);
  const cval = getCookie(name);
  if (cval != null) {
    document.cookie = `${name}=${0}; expires=${exp.toUTCString()}; path=/`;
  }
};

const request = (option) => {
  return new Promise((resolve, reject) => {
    const { systemName } = window.conf;
    // model中存储的ledgerId和当前账套不同则刷新页面
    if (getCookie('ledgerId') && window.ledgerId !== undefined && getCookie('ledgerId') != window.ledgerId) {
      // 如果是退出接口则不做这层过滤
      if (option.url !== '/authcenter/logout') {
        window.location.reload();
        return false;
      }
    }

    if (!navigator.onLine) {
      // 无网络
      Message.show({
        type: 'error',
        content: '网络异常，请稍后重试！',
      });
      return false;
    }

    const url = window.location.href;
    const goLogin = () => {
      window.location.href = `${window.conf.loginUrl}/?redirectUrl=${encodeURIComponent(url)}`;
    };

    const logout = async () => {
      const res = await request({ url: '/authcenter/exitUrl' });
      if (res && Object.keys(res).length > 0) {
        window.location.href = `${
          res.authcenter
        }/authcenter/commonService?logout=true&work=ture&redirectUrl=${encodeURIComponent(url)}`;
      }
    };

    const postMessage = (e) => {
      window.parent.postMessage(
        {
          data: e,
          source: systemName,
          type: 'request_error',
        },
        '*',
      );
    };

    const handlerError = (e) => {
      if (e.code === -200) {
        // 未登录
        Message.show({
          type: 'warning',
          content: '请先登录！',
        });
        if (queryString('noWindow') === 'noWindow' && window.parent) {
          postMessage(e);
        } else {
          goLogin();
        }
      } else if (e.code === -3304006) {
        console.log(`${option.url}--${e.msg}`);
        if (queryString('noWindow') === 'noWindow' && window.parent) {
          postMessage(e);
          window.location.href = `/${systemName}/noauthority?noWindow=noWindow`;
        } else {
          window.location.href = `/${systemName}/noauthority`;
        }
      } else if ([-3304007, -13304007].includes(e.code)) {
        // 没有系统权限
        if (queryString('noWindow') === 'noWindow' && window.parent) {
          postMessage(e);
          window.location.href = `/${window.conf.systemName}/noauthority?errorCode=${e.code}&noWindow=noWindow`;
        } else {
          window.location.href = `/${window.conf.systemName}/noauthority?errorCode=${e.code}`;
        }
      } else if (e.code === -3304109) {
        // 校验ticket
        resolve({ code: -3304109 });
      } else if (e.code === -3304108) {
        logout();
      } else if (e.code === -13305002 || e.code === -13304705) {
        // -13305002, "系统需要钉钉扫码登录进行访问"
        // -13304705, "系统需要启动360卫士进行访问"
        Message.show({ type: 'warning', content: e.msg });
        setTimeout(() => {
          logout();
        }, 3000);
      } else if (e.code === -13305003) {
        // -13305003, "帐号已在其他地方登录，当前系统被迫下线"
        Message.show({ type: 'warning', content: e.msg });
        setTimeout(() => {
          goLogin();
        }, 3000);
      } else if (!option.closeErrorMsgShow) {
        Message.show({
          type: 'error',
          content: e.msg,
        });
      }
      option.getErrorMsg ? resolve(e) : resolve({});
      // reject(e)
    };

    const req = {
      ...option,
      api: `/tryqapi${option.url}`,
      // dataType: 'jsonp',
      type: option.type || 'POST',
      params: option.params,
      result(data) {
        if (data.code === 0) {
          option.getSuccessMsg === true ? resolve(data) : resolve(data.info);
        } else if (queryString('noWindow') === 'noWindow' && window.parent) {
          postMessage(data);
          option.getErrorMsg ? resolve(data) : resolve({});
          if (!option.closeErrorMsgShow) {
            Message.show({
              type: 'error',
              content: data.msg,
            });
          }
        } else {
          handlerError(data);
        }
      },
      fail(e) {
        if (queryString('noWindow') === 'noWindow' && window.parent) {
          postMessage(e);
          option.getErrorMsg ? resolve(e) : resolve({});
          if (!option.closeErrorMsgShow) {
            Message.show({
              type: 'error',
              content: e.msg,
            });
          }
        } else {
          handlerError(e);
        }
      },
    };
    window.$SDK.request(req);
  });
};

export { queryString, setCookie, getCookie, clearCookie, request };
