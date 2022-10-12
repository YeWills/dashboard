import React from 'react';

const defaultFormat = (val) => {
  return val;
};

class DetailField extends React.Component {
  render() {
    const { format = defaultFormat } = this.props.fieldInfo?.detailProps || {};
    return <div style={{ lineHeight: '32px' }}>{format(this.props.value)}</div>;
  }
}

export default DetailField;

export const isUseDetail = ({ type }) => {
  if (['upload.card', 'select'].includes(type)) return false;
  return true;
};
