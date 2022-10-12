import React from 'react';
import { Checkbox } from '@alifd/next';

const defaultGetter = (res) => {
  return Object.entries(res).reduce((acc, item) => {
    const [value, label] = item;
    return [...acc, { value, label }];
  }, []);
};

class XdCheckbox extends React.Component {
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
    const { post, formAction, name, optsGetter, formStoreField } = this.props;
    if (!post) return;
    const fetchData = async () => {
      const res = await post();
      if (res?.errInfo) return;
      formAction && formAction(name, res, { optsGetter, formStoreField });
      this.setState({ stateOpts: optsGetter(res) });
    };
    fetchData();
  }

  render() {
    const { stateOpts } = this.state;

    const {
      name,
      type,
      getOpts,
      required,
      placeholder,
      disabled,
      extraProps,
      options: propsOpts,
      label,
      onChange,
      hasClear,
      post,
      form,
      optsGetter,
      formAction,
      formType,
      ...rest
    } = this.props;

    const commonUnClearProps = { name, placeholder, disabled };

    if (formType === 'detailForm') {
      //
    }

    let realOpts = propsOpts || stateOpts;
    if (getOpts) {
      realOpts = getOpts();
    }

    return (
      <Checkbox.Group
        direction="hoz"
        {...commonUnClearProps}
        {...rest}
        {...extraProps}
        onChange={(value) => {
          onChange && onChange(value, form);
        }}
      >
        {realOpts.map(({ value, label }) => {
          return (
            <Checkbox key={value} value={value}>
              {label}
            </Checkbox>
          );
        })}
      </Checkbox.Group>
    );
  }
}

export default XdCheckbox;
