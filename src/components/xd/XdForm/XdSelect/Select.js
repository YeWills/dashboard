import React from 'react';
import { isEqual } from '@utils';
import { Select } from '@alifd/next';

const defaultGetter = (res) => {
  if (!res) return [];
  return Object.entries(res).reduce((acc, item) => {
    const [value, label] = item;
    return [...acc, { value, label }];
  }, []);
};

class XdSelect extends React.Component {
  static defaultProps = {
    optsGetter: defaultGetter,
  };

  constructor(props) {
    super(props);
    this.state = {
      stateOpts: [],
    };
  }

  componentDidMount() {
    const { post, formAction, name, optsGetter, getParams } = this.props;
    if (!post) return;
    const fetchData = async () => {
      const params = typeof getParams === 'function' ? getParams() : getParams;
      const res = await post(params);
      if (res?.errInfo) return;
      formAction && formAction(name, res, optsGetter(res));
      this.setState({ stateOpts: optsGetter(res) });
    };
    fetchData();
  }

  render() {
    const { stateOpts } = this.state;

    const {
      name,
      placeholder,
      disabled,
      extraProps,
      options: propsOpts,
      style,
      getParams,
      label,
      optsGetter,
      onChange,
      post,
      hasClear = true,
      form,
      formAction,
      formType,
      ...rest
    } = this.props;

    const options = propsOpts || stateOpts;
    const commonProps = { name, placeholder, disabled, hasClear };

    if (formType === 'detailForm') {
      const opt = options.find((item) => isEqual(item.value, rest.value));
      return <div style={{ lineHeight: '32px' }}>{opt?.label || ''}</div>;
    }

    return (
      <Select
        style={style}
        {...rest}
        {...commonProps}
        {...extraProps}
        onChange={(value) => {
          onChange && onChange(value, form);
        }}
      >
        {options.map((item) => (
          <Select.Option key={item.value} value={item.value}>
            {item.label}
          </Select.Option>
        ))}
      </Select>
    );
  }
}

export default XdSelect;
