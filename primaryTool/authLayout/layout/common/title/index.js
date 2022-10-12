/**
 * props{
 *  title(string) 标题名字
 *  hasBorder(boolean)  是否有底部边框
 *  button(string)  按钮内容 (有此属性按钮显示，没有不显示)
 *  icon(string)  按钮图标
 *  handleEvent(event)  按钮点击事件
 * }
 */

import React from 'react';
import { connect } from 'dva';
import { Button, Icon } from '@alifd/next';
import styles from './index.scss';

class Title extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getButton = ({ button, icon, handleEvent }) => {
    return (
      <Button className={styles.btn} type="normal" onClick={handleEvent}>
        <Icon type={icon} />
        {button}
      </Button>
    );
  };

  render() {
    const { title, hasBorder, button } = { ...this.props };

    return (
      <div className={`${styles.title} ${!hasBorder ? null : styles.hasBorder}`}>
        {!button && <h3>{title}</h3>}
        {button && this.getButton({ ...this.props })}
      </div>
    );
  }
}

export default connect()(Title);
