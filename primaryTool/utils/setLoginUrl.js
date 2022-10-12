import { request } from './index';

export default async (callback) => {
  const url = await request({ url: '/authcenter/logoutUrl' });
  if (url && Object.keys(url).length > 0) {
    window.conf.loginUrl = url;
    callback && callback();
  }
};
