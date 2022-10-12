import React from 'react';
import { connect } from 'dva';

import styles from '../index.scss';
import { noauthorityUrl } from '../../img';

class NoAuthority extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <img src={noauthorityUrl} alt="..." />
          <h3>暂无权限</h3>
        </div>
      </div>
    );
  }
}

export default connect()(NoAuthority);
