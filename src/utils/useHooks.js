// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';

// 当props改变的时候，会生成新的state，但可能新state与旧的state相同，依赖于此的hooks(如effect)不触发；
// 但仍然想触发此hooks，因此定义了一个forceUpdateKey
// 此hooks的作用有俩：通过props生成新的state（通过callback）； 触发一次hooks；
export const useStateFromProps = (props, callback) => {
  const [forceUpdateKey, forceUpdate] = useState(0);
  const [preProps, setPreProps] = useState(props);

  if (preProps !== props) {
    setPreProps(props);
    forceUpdate((pre) => pre + 1);
    callback && callback();
  }
  return forceUpdateKey;
};

// 用于一般请求处理，对外暴露一个用于刷新的key，可以选择使用或不使用
// unRefresh 不启用刷新功能
// errHandle 需要自己处理错误回调时，调用时需要加catch，否则将启用默认的错误处理方式，
//                    因为不处理，当请求数据触发reject时，promise如果不用catch进行捕获，会报错，因此必须默认写一个catch

export const usePost = ({
  oriLoading = false,
  oriRefreshKey = 0,
  unRefresh = true,
  // errHandle = false
} = {}) => {
  const [loading, setLoading] = useState(oriLoading);
  const [refreshKey, setRefresh] = useState(oriRefreshKey);

  const postHandler = (
    post,
    params,
    {
      errAssert = (res) => !!res?.code || !res || (typeof res === 'object' && _.isEmpty(res)),
      unRefresh: postUnRefresh = undefined,
      unLoading = undefined,
    } = {},
  ) => {
    const postPromise = new Promise((resolve, reject) => {
      !unLoading && setLoading(true);
      post(params)
        .then((data) => {
          setLoading(false);
          const isResponseErr = errAssert(data);
          if (isResponseErr) {
            reject(data);
            return;
          }
          const fn = async () => {
            // 一般resolve用于setState数据，刷新需等待所有数据好了后再刷新
            await resolve(data);
            !(postUnRefresh ?? unRefresh) && setRefresh((pre) => pre + 1);
          };
          fn();
        })
        .catch((err) => {
          console.log('err...', err);
          reject(err);
          setLoading(false);
        });
    });
    return postPromise;
    // postUseDefaultErr的优先级最高，
    // if (postUseDefaultErr ?? errHandle) {
    //   return postPromise;
    // }
    // return postPromise.catch(err => {
    //   console.log('err...', err);
    // });
  };

  return [postHandler, loading, refreshKey, setLoading, setRefresh];
};

// 必须要定义第二个参数 catch，不然当reject的时候，按照promise的机制会报异常；
usePost.event = (success, error = (e) => console.log('err:', e)) => {
  return [
    (data) => {
      return success && success(data);
    },
    (err) => {
      error(err);
    },
  ];
};

// 当res为空，说明返回数据没有info；或者 返回{} [] 都说明返回异常；
usePost.errAssert = (res) => !res || (typeof res === 'object' && _.isEmpty(res));
