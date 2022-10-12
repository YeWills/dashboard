import React from 'react';
import { queryString } from './utils';
import styles from './index.scss';

// 特别注意的是 iframe 如何要在开发环境显示，启动的http协议 与 iframe 的src http协议要一致；
class Iframe extends React.Component {
  getUrl = () => {
    const { currentTab } = this.props;
    const url = decodeURIComponent(currentTab.split('url=')[1]);
    // console.log('原始>>>>>>>>>>>>>>>>', url);
    return url;
  };

  addNoWindow = (pageUrl) => {
    if (!queryString('noWindow', pageUrl)) {
      const url = pageUrl.indexOf('?') > -1 ? `${pageUrl}&noWindow=noWindow` : `${pageUrl}?noWindow=noWindow`;
      // console.log('原始addNoWindow--------------', url);
      return url;
    }
    return pageUrl;
  };

  render() {
    const { currentTab } = this.props;
    if (!currentTab) return <div>嵌入页面地址有误！请输入正确页面地址！</div>;

    return (
      <div className={styles.iframe}>
        <iframe src={this.addNoWindow(this.getUrl())}></iframe>
      </div>
    );
  }
}

export default Iframe;
