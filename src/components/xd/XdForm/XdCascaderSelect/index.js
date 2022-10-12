import React from 'react';
import { CascaderSelect } from '@alifd/next';

const defaultSetValues = (names, field, validValue, value, info, pathInfo) => {
  if (!value) {
    // 比如省市区 将省市的信息存在form内
    field.setValues({
      [names[0]]: undefined,
      [names[1]]: undefined,
    });
    return;
  }
  // 比如省市区 将省市的信息存在form内
  field.setValues({
    [names[0]]: pathInfo.selectedPath[0].value,
    [names[1]]: pathInfo.selectedPath[1].value,
  });
};

class XdCascaderSelect extends React.Component {
  static defaultProps = {
    optsGetter: (t) => t,
    setValues: defaultSetValues,
    getValues: (val) => val,
  };

  constructor(props) {
    super(props);
    this.state = {
      stateOpts: [],
      refresh: 0,
    };
  }

  componentDidMount() {
    const { post, formAction, name, optsGetter } = this.props;
    if (!post) return;
    const fetchData = async () => {
      const res = await post();
      if (res?.errInfo) return;
      formAction && formAction(name, res);
      this.setState({ stateOpts: optsGetter(res) });
      this.setState({ refresh: this.state.refresh + 1 });
    };
    fetchData();
  }

  render() {
    const { stateOpts, refresh } = this.state;

    const {
      name,
      placeholder,
      disabled,
      extraProps,
      options: propsOpts,
      style,
      forwardedRef,
      label,
      optsGetter,
      onChange,
      post,
      names,
      setValues,
      hasClear = true,
      formStoreField,
      getValues,
      formAction,
      ...rest
    } = this.props;

    const options = propsOpts || stateOpts;
    const commonProps = { name, placeholder, disabled, hasClear };

    return (
      <CascaderSelect
        style={style}
        key={refresh}
        dataSource={options}
        {...commonProps}
        {...extraProps}
        {...rest}
        onChange={(value, ...more) => {
          const validValue = getValues(value, ...more);
          onChange && onChange(validValue, formStoreField);
          if (names) {
            // 比如省市区 将省市的信息存在form内
            setValues(names, formStoreField, validValue, value, ...more);
          }
        }}
      />
    );
  }
}

export default XdCascaderSelect;
