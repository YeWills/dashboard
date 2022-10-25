/* eslint-disable no-restricted-globals */
/* eslint-disable global-require */
import 'core-js';
import 'regenerator-runtime/runtime';
import { setLoginUrl } from '@primaryTool';
import dva from 'dva';
import { createBrowserHistory as createHistory } from 'history';
import dvaLoading from 'dva-loading';
import moment from 'moment';
import sdk from './utils/sdk';
import router from './router';
import '@alifd/next/dist/next.css';
import './index.scss';
import '@alifd/theme-3892/dist/next.css';

sdk({ appkey: 342566 });

moment.locale('zh-cn');
const createApp = function () {
  const app = dva({
    history: createHistory(),
  });
  app.use(dvaLoading());

  require('./models').default.forEach((key) => {
    app.model(key.default);
  });

  require('./models/beautiCenter').default.forEach((key) => {
    app.model(key.default);
  });

  // setLoginUrl(() => {
  app.router(router);
  app.start('#root');
  // });
};
if (location.search.includes('from=fws')) {
  window.IFRAME_FWS = true;
  createApp();
} else {
  createApp();
}
