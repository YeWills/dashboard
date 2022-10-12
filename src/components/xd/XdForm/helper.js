import React from 'react';
import { Input, DatePicker, Radio, Grid, Form } from '@alifd/next';
import XdSelect from './XdSelect';
import XdCheckbox from './XdCheckbox';
import DetailField, { isUseDetail } from './getDetailField';
import XdCascaderSelect from './XdCascaderSelect';
import XdNumPicker from './XdNumPicker';
import styles from './index.module.scss';

const FormItem = Form.Item;

const { Row, Col } = Grid;

const style = { width: '100%' };
// todo xdForm 需要改进地方：
// 在extraProps定义defaultvalue 或value时，如何让外层也拿到值，比如 查询表单，在extraProps定义value时，页面第一次post时就需要拿到此value；
//  目前此场景方案是，如果页面第一次就要拿到 定义的value值时，将此值不通过extraProps定义，而通过 form的defaultValue 或 field.setValues注入；

// value要在这一层单独列出来，不能写到Xd自定义Field内部组件，因为Form会对Form.item下的第一层child 的 value关键字 收集，
// 此优先级最高，重置this.field的formvalue
// 因此在extraProps内传递 value defaultValue 时，必须在第一层传递一次用于设置this.field，也需要传递给 Xd自定义Field内部组件 自身 用于渲染
// 目前已知这样的props 有 value defaultValue
const nextFieldCommonProps = (extraProps) => {
  const props = ['defaultValue', 'value'].reduce((acc, propsKey) => {
    // 为了兼容value这个特殊props，若传就是完全受控组件，因此 除非定义，否则不传
    if (Object.entries(extraProps || {}).some(([extraKey]) => extraKey === propsKey)) {
      acc[propsKey] = extraProps?.[propsKey];
    }
    return acc;
  }, {});
  return props;
};

// field 的props定义在extraProps上；非extraProps，用于自定义组件的自定义需求，如重组select options；
export const getField = (fieldInfo, formStoreField, formAction, formType) => {
  const { type, name, placeholder, disabled, options, extraProps, hasClear = true } = fieldInfo;
  const commonProps = { name, placeholder, disabled, hasClear };
  const commonUnClearProps = { name, placeholder, disabled };

  if (formType === 'detailForm' && isUseDetail(fieldInfo)) {
    return <DetailField name={name} fieldInfo={fieldInfo} formStoreField={formStoreField} formAction={formAction} />;
  }

  switch (type) {
    case 'select': {
      return (
        <XdSelect
          style={style}
          {...fieldInfo}
          formAction={formAction}
          formType={formType}
          {...nextFieldCommonProps(extraProps)}
        />
      );
    }
    case 'textArea': {
      const { hasClear, ...moreProps } = commonProps;
      return <Input.TextArea {...moreProps} {...extraProps} />;
    }

    case 'rangePicker': {
      // __formRreshKey 用于管理整个form指定field刷新重载
      const { onChange, disabledDate, ...moreProps } = extraProps || {};
      const __formRreshKey = formStoreField.getValue('__formRreshKey');
      const { disabledDateGetter } = fieldInfo;
      const validDisabledDate = disabledDateGetter ? disabledDateGetter(formStoreField) : disabledDate;
      return (
        <DatePicker.RangePicker
          style={style}
          {...commonProps}
          {...moreProps}
          key={(__formRreshKey && __formRreshKey[name]) || '0'}
          disabledDate={validDisabledDate}
          onChange={(val) => {
            onChange && onChange(val, formStoreField);
          }}
        />
      );
    }
    case 'cascaderSelect': {
      return (
        <XdCascaderSelect
          style={style}
          {...fieldInfo}
          formAction={formAction}
          formStoreField={formStoreField}
          {...nextFieldCommonProps(extraProps)}
        />
      );
    }
    case 'checkbox': {
      return (
        <XdCheckbox
          style={style}
          {...fieldInfo}
          formAction={formAction}
          formType={formType}
          formStoreField={formStoreField}
          {...nextFieldCommonProps(extraProps)}
        />
      );
    }
    case 'radio': {
      const { label, name, required, type, ...rest } = fieldInfo;
      const { disabled, ...moreProps } = extraProps || {};
      const validDisable = typeof disabled === 'function' ? disabled(formStoreField, formType) : disabled;
      return (
        <Radio.Group direction="ver" {...commonUnClearProps} {...rest} {...moreProps} disabled={validDisable}>
          {options.map(({ value, label }) => {
            return (
              <Radio key={value} value={value}>
                {label}
              </Radio>
            );
          })}
        </Radio.Group>
      );
    }
    case 'numberPicker': {
      const { disabled, ...moreProps } = extraProps || {};
      const validDisable = typeof disabled === 'function' ? disabled(formStoreField, formType) : disabled;
      return <XdNumPicker {...commonProps} {...moreProps} disabled={validDisable} />;
    }
    case 'blank': {
      return <div />;
    }
    default:
      return <Input trim {...commonProps} {...extraProps} />;
  }
};

export const setConfig = ({ config, name, value, attr }) => {
  config.forEach((card) => {
    const target = card.childrens.find((cell) => {
      return cell.name === name;
    });
    if (target) {
      target[attr] = value;
    }
  });
};
// 待优化，如何 给 非 rangePicker 的names 也处理入参
export const defaultBeforeSubmit = (values, config) => {
  let rangeDateFields = config.fields.reduce((acc, field) => {
    if (field.type === 'rangePicker') {
      const { name, names } = field;
      return [...acc, [name, names]];
    }
    return acc;
  }, []);

  rangeDateFields = [...rangeDateFields, ...(config.rangeDateFields || [])];

  let newFormValues = { ...values };
  rangeDateFields.forEach((rangeDate) => {
    const [dateFormName, [startName, endName, dateFormat]] = rangeDate;
    // eslint-disable-next-line no-prototype-builtins
    if (newFormValues.hasOwnProperty([dateFormName])) {
      const dateValue = newFormValues[dateFormName];

      if (!dateValue) return;
      const getDate = (date, format = 'YYYY-MM-DD', timeType) => {
        if (typeof format === 'function') {
          return format(date, timeType);
        }
        if (typeof date === 'string') {
          return date;
        }
        if (!date) return date;
        return date?.format && date.format(format);
      };
      newFormValues = {
        ...newFormValues,
        [dateFormName]: undefined,
        [startName]: getDate(dateValue[0], dateFormat, 'start'),
        [endName]: getDate(dateValue[1], dateFormat, 'end'),
      };
    }
  });

  return newFormValues;
};

const getLabel = (fieldInfo, field, store) => {
  const { dynamicshow, label } = fieldInfo;
  if (dynamicshow) {
    return dynamicshow(field, store);
  }
  return label ? `${label}：` : <span className={styles.hidden} />;
};

const getWrapper = ({ fieldInfo, index, formType, field, store }) => {
  const { col, label, labelCol, wrapperCol, name, required, className } = fieldInfo;
  const key = name || label || index;
  return (
    <Row key={key}>
      <Col span={col?.span || 16} className={col?.className}>
        <FormItem
          required={required}
          labelAlign="left"
          labelCol={{ span: labelCol?.span || 5 }}
          wrapperCol={{ span: wrapperCol?.span || 18 }}
          label={getLabel(fieldInfo, field, store)}
          className={`${styles.item} ${className}`}
        >
          {getField(fieldInfo, undefined, undefined, formType)}
        </FormItem>
      </Col>
    </Row>
  );
};

export const defaultWrapper = (childs, formType, field, store) => {
  return (
    <>
      {childs.map((childFieldInfo, index) => {
        return getWrapper({
          fieldInfo: childFieldInfo,
          index,
          formType,
          field,
          store,
        });
      })}
    </>
  );
};
