import React from 'react';
import styles from '../index.scss';
import { welcomeUrl } from '../../img';

class Welcome extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <img src={welcomeUrl} alt="..." />
          {1 && <h3>欢迎来到</h3>}
        </div>
      </div>
    );
  }
}

export default Welcome;
