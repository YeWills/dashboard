// 获取url参数
export const queryString = (name, url) => {
  // 由于 ? 在new RegExp 转义有问题，因此用 [] 包含起来
  const reg = new RegExp(`([?]|&)${name}=([^&]*)(&|$)`, 'i');
  const r = (url || window.location.search).match(reg);
  if (r) {
    return decodeURIComponent(r);
  }
  return '';
};
// 为了兼容iframe做的
export const enHistory = (history, path, search) => {
  const isIframePage = /\/tryq\/iframe/.test(path);
  // 如果是iframe页面，就不需要search
  if (isIframePage) {
    history.push(path);
    return;
  }
  history.push({ pathname: path, search });
};
