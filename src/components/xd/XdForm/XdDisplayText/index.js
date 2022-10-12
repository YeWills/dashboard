/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import styles from './style.scss';

const defaultGetter = (res) => res;

class DisplayText extends React.Component {
  static defaultProps = {
    mapsGetter: defaultGetter,
  };

  constructor(props) {
    super(props);
    const { valueMaps } = this.props;
    this.state = {
      valueMaps: valueMaps || undefined,
    };
  }

  componentDidMount() {
    const { post, mapsGetter } = this.props;
    if (!post) return;
    // 枚举值可以直接props设定， 当有post的时候，此post只做一件事情，就是生成新的枚举值
    const fetchData = async () => {
      const res = await post();
      if (res?.errInfo) return;
      this.setState({ valueMaps: mapsGetter(res) });
    };
    fetchData();
  }

  // 当设定props的valueMaps，说明从valueMaps枚举取值
  getValFromMap = () => {
    const { valueMaps } = this.state;
    const { value, multiple } = this.props;
    if (!multiple) {
      return valueMaps[value];
    }
    if (!value || !value?.length) return '';

    return value
      .map((item) => {
        return valueMaps[item];
      })
      .join(',');
  };

  render() {
    const { valueMaps } = this.state;
    const { value, className, txt, getTxt } = this.props;

    return (
      <span className={`${styles.displaySpan} ${className}`}>
        {(getTxt && getTxt(value)) || txt || (valueMaps ? this.getValFromMap() : value)}
      </span>
    );
  }
}

export default DisplayText;
