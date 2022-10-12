import React from 'react';
import { NumberPicker } from '@alifd/next';
import styles from './index.module.scss';

class XdNumPicker extends React.Component {
  static defaultProps = {
    style: { width: '100%' },
  };

  constructor(props) {
    super(props);
    const { innerAfter, hasTrigger } = this.props;
    this.className = '';
    if (innerAfter && hasTrigger === false) {
      this.className = styles.afterText;
    }
  }

  render() {
    const { className, ...rest } = this.props;
    return <NumberPicker className={`${this.props.className} ${this.className}`} {...rest} />;
  }
}

export default XdNumPicker;
