import { Message } from '@alifd/next';

/* eslint-disable no-underscore-dangle */
export const findColumn = (columns, key) => columns.find((column) => column.dataIndex === key);

export const isObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]';

export const tablePostHelper =
  ({ instance, unRefresh = true, tableKey = 'tableRefreshKey', loadingKey = 'loading' }) =>
  (
    post,
    params,
    {
      error,
      success,
      errAssert = (res) => !!res?.code || !res || (typeof res === 'object' && _.isEmpty(res)),
      unRefresh: postUnRefresh = undefined,
      unLoading = undefined,
    } = {},
  ) => {
    const _this = instance;
    const postPromise = new Promise((resolve, reject) => {
      !unLoading && _this.setState({ [loadingKey]: true });
      post(params)
        .then((data) => {
          _this.setState({ [loadingKey]: false });
          const isResponseErr = errAssert(data);
          if (isResponseErr) {
            reject(data);
            error && error(data);
            return;
          }
          const fn = async () => {
            // 一般resolve用于setState数据，刷新需等待所有数据好了后再刷新
            await resolve(data);
            success && success(data);
            !(postUnRefresh ?? unRefresh) && _this.setState({ [tableKey]: _this.state[tableKey] + 1 });
          };
          fn();
        })
        .catch((err) => {
          console.log('err...', err);
          reject(err);
          _this.setState({ [loadingKey]: false });
        });
    });
    return postPromise;
  };

// 必须要定义第二个参数 catch，不然当reject的时候，按照promise的机制会报异常；
tablePostHelper.event = (success, error = (e) => console.log('err:', e)) => {
  return [
    (data) => {
      return success && success(data);
    },
    (err) => {
      error(err);
    },
  ];
};

// 用于数字或字符串比较
export const isEqual = (a, b) => {
  if ([a, b].includes(undefined) || [a, b].includes(null)) return false;
  return String(a) === String(b);
};

export const handleFormConfig = (formConfig, items) => {
  const { fields } = formConfig;
  items.forEach((item) => {
    const [name, opts, key = 'extraProps'] = item;
    const targetField = fields.find((field) => field.name === name);
    if (!targetField) return;
    let newOpts = opts;
    // 禁用状态下默认去掉组件hasClear，你仍然可通过opts进行覆盖
    if (Object.keys(opts).includes('disabled')) {
      newOpts = { hasClear: false, ...newOpts };
    }
    if (targetField[key]) {
      targetField[key] = { ...targetField[key], ...newOpts };
    } else {
      targetField[key] = { ...newOpts };
    }
  });
  console.log(formConfig);
  return formConfig;
};

// 合并数组，避免undefined无法被迭代的异常[...undefined]
export const concat = (...args) =>
  args.reduce((acc, value) => {
    if (typeof value === 'number') {
      return [...acc, value];
    }
    if (value) {
      return [...acc, ...value];
    }
    return acc;
  }, []);

export const toFixed = (num, precision = 2) => {
  // eslint-disable-next-line no-restricted-globals
  const value = isNaN(num) ? 0 : Number(num);
  return Number(value.toFixed(precision));
};

// 整数转小数，比如 分转元的计算，解决js计算失真
export const toDecimal = (num, leng = 2) => {
  const unit = Math.pow(10, leng);
  if (num === 0) return 0;
  return num ? Number((num / unit).toFixed(leng)) : undefined;
};

export const downFile = (url) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = 'title';
  link.click();
  // document.body.removeChild(link);
};

// 导出使用 钉钉通知， 请求前 提示开始操作
export const exportMsgStartTip = () => {
  return new Promise((resolve) => {
    Message.show({
      type: 'success',
      content: '开始处理导出请求!',
    });
    const time = setTimeout(() => {
      // 为了不让两次Message提示 重叠，因此延迟时间 做后续操作
      resolve();
      clearTimeout(time);
    }, 800);
  });
};
const msgTip = () => {
  Message.show({
    type: 'success',
    content: '下载链接将发送至钉钉!',
  });
};
// 导出使用 钉钉通知， 请求好后 提示操作结果
export const exportMsgWithAssert = (data, isSuccess = (res) => res instanceof Array && res.length !== 0) => {
  if (isSuccess(data)) {
    msgTip();
  }
};
// 导出使用 钉钉通知， 请求好后 提示操作结果
export const exportMsg = () => {
  msgTip();
};
