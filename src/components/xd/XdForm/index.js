/* eslint-disable eqeqeq */
import React from 'react';
import { Grid, Form, Field, Button } from '@alifd/next';
import styles from './index.module.scss';
import { getField, defaultBeforeSubmit, defaultWrapper } from './helper';
import Wrap from './Wrap';
import contextHoc from './contextHoc';

const FormItem = Form.Item;
const { Row, Col } = Grid;

const unNomalForms = ['unLabel'];

class XdForm extends React.Component {
  static defaultProps = {
    formType: 'default',
    resetEmpty: false,
    disableSubmit: false,
  };

  constructor(props) {
    super(props);
    const { defaultValue } = props;
    this.field = new Field(this, { values: defaultValue });
    this.defaultValue = defaultValue;
  }

  getCustomProps = () => {
    // store用于存储form的一切其他数据：表单验证消息，表单其他未集成到form的数据
    // action用于处理数据相关的交互，类似dispatch；
    // formAction用于处理事件，类似自定义Event；
    const { store, action, formAction, formType } = this.props;
    return { store, action, formAction, formType };
  };

  onSubmit = (values, ...args) => {
    const { onSubmit, beforeSubmit = defaultBeforeSubmit, config } = this.props;
    const newValues = beforeSubmit(values, config);
    onSubmit && onSubmit(this.field, newValues, ...args);
  };

  onClickReset = () => {
    const values = this.field.getValues();
    // reset 重置 form值后，返回的值应该是 经过计算，可用于查询列表的，其实也是一种查询动作，因此最好执行beforeSubmit 以提供方便;
    const { onReset, beforeSubmit = defaultBeforeSubmit, config } = this.props;
    const newValues = beforeSubmit(values, config);
    onReset && onReset(this.field, newValues);
  };

  onCustomClickReset = () => {
    this.field.reset(); // 重置一组输入控件的值、清空校验，此代码用于当form有校验时，直接field.setValues值，以前的校验并不会消失
    this.field.setValues({ ...this.defaultValue });
    // reset 重置 form值后，返回的值应该是 经过计算，可用于查询列表的，其实也是一种查询动作，因此最好执行beforeSubmit 以提供方便;
    const { onReset, beforeSubmit = defaultBeforeSubmit, config } = this.props;
    const newValues = beforeSubmit(this.defaultValue, config);
    onReset && onReset(this.field, newValues);
  };

  // CustomField 的设计 props 等 要与 getField 内定义的组件 应该一样，二者没有区别，只是一个是统一封装，一个是自定义封装，用得多了，也可以变成统一封装
  // render与getField一样，是一种render props模式，前者属于自定义render，后者属于公共统一的
  // CustomField是一个组件，拥有自己的state，做其他更加复杂逻辑
  // btns 是按钮
  // wrap 是包含多个formItem的情况，也类似表单内field分组
  generateField = (fieldInfo) => {
    const { formAction, formType } = this.props;
    const { render, CustomField, type, btns, childs, name, extraProps } = fieldInfo;
    if (render) {
      return render(fieldInfo, this.field, this.getCustomProps());
    }
    if (CustomField) {
      // 这里的 formStoreField 与 field 是一个，以后逐渐使用 formStoreField 代替 field，写成一样，是为了兼容，二者有一个是多余的
      // 由于历史原因，以前有些组件使用field作为名称，但CustomField 实质上与getField统一定义的组件没有区别，入参应该保持一致
      return (
        <CustomField
          name={name}
          formStoreField={this.field}
          field={this.field}
          {...extraProps}
          {...this.getCustomProps()}
        />
      );
    }
    if (type === 'btns') {
      return btns.map((btn) => {
        return this.getBtn(btn);
      });
    }
    if (type === 'wrap') {
      const { Wrapper = defaultWrapper } = fieldInfo;
      return Wrapper(childs, formType, this.field, this.props.store);
    }
    return getField(fieldInfo, this.field, formAction, formType);
  };

  getColSpan = (col) => {
    const { columns = 1, colSpan, type } = this.props.config;
    if (col?.span) return col?.span;
    if (colSpan) return colSpan;
    if (type === 'singleColumns') return 24;
    return 24 / columns;
  };

  getLableColSpan = (labelCol) => {
    const { type } = this.props.config;
    if (labelCol?.span) return labelCol?.span;
    if (type === 'singleColumns') return 5;
    return 8;
  };

  getWrapperColSpan = (wrapperCol, fieldType) => {
    const { type } = this.props.config;
    if (wrapperCol?.span) return wrapperCol?.span;
    if (fieldType === 'wrap') return 18; // 主要是单列(singleColumns)表单内的wrap类型
    if (type === 'singleColumns') return 11;
    return 16;
  };

  getLabel = (fieldInfo) => {
    const { dynamicshow, label, customvalidate } = fieldInfo;
    if (customvalidate) {
      return (
        <span>
          <span style={{ color: 'red' }}>*</span>
          {label}
        </span>
      );
    }
    if (dynamicshow) {
      return dynamicshow(this.field, this.store);
    }
    if (React.isValidElement(label)) {
      return label;
    }
    return label ? `${label}：` : <span className={styles.hidden} />;
  };

  // 这里对form排列做了处理，正常表单以 8 16 分别定义 labelCol.span wrapperCol.span;
  // 对于单列的表单，如新增表单，一般都是单列的(singleColumns)，我们给他的col定义为24，就是为了给每行的内容留出足够空间，满足自定义组件对空间的设计需求，
  // 然后在默认给field定义为一个合适长度：5 11 分别定义 labelCol.span wrapperCol.span;
  getFormContent = () => {
    const { columns = 1, fields } = this.props.config;
    let splitIndex = 0;
    const content = fields
      .reduce((acc, fieldInfo, index) => {
        const {
          label,
          name,
          type,
          visableStatusGetter = () => true,
          className,
          required,
          render,
          col,
          labelCol,
          wrapperCol,
          deepcustom,
        } = fieldInfo;
        const fieldNode = (
          <Col span={this.getColSpan(col)} className={col?.className} key={name ?? label ?? index}>
            {deepcustom ? (
              render(fieldInfo, this.field, this.getCustomProps())
            ) : (
              <FormItem
                required={required}
                labelAlign="left"
                labelCol={{ span: this.getLableColSpan(labelCol) }}
                wrapperCol={{ span: this.getWrapperColSpan(wrapperCol, type) }}
                label={this.getLabel(fieldInfo)}
                className={`${styles.item} ${className} ${
                  visableStatusGetter(this.field) ? styles.showItem : styles.hiddenItem
                }`}
              >
                {this.generateField(fieldInfo)}
              </FormItem>
            )}
          </Col>
        );

        if (!acc[splitIndex]) acc[splitIndex] = [];
        if (acc[splitIndex].length === columns) {
          splitIndex += 1;
          acc[splitIndex] = [fieldNode];
        } else {
          acc[splitIndex].push(fieldNode);
        }
        return acc;
      }, [])
      .map((rowFields, index) => {
        return <Row key={`row${index}`}>{rowFields}</Row>;
      });
    return content;
  };

  // 目前这种，主要用列表上面的查询表单场景
  getUnLabelBtn = (fieldInfo) => {
    const { btnType, type, label } = fieldInfo;
    const { resetEmpty, customReset } = this.props;
    const realType = type || btnType;
    if (realType === 'submit') {
      return (
        <Form.Submit key="submit" validate type="primary" onClick={this.onSubmit} className={styles.unLableBtn}>
          {label}
        </Form.Submit>
      );
    }
    if (realType === 'reset') {
      // customReset 此reset按钮具有重置时，回到 defaultvalue的能力，但defaultvalue必须定义在 field内
      if (customReset) {
        return (
          <Button key="reset" type="normal" onClick={this.onCustomClickReset} className={styles.unLableBtn}>
            {label}
          </Button>
        );
      }
      return (
        <Form.Reset key="reset" toDefault={!resetEmpty} onClick={this.onClickReset} className={styles.unLableBtn}>
          {label}
        </Form.Reset>
      );
    }
  };

  getUnNomalForm = () => {
    const content = this.props.config.fields.reduce((acc, fieldInfo, index) => {
      const { name, col, type, btns } = fieldInfo;
      // type为btn时，如果配置了btns说明要配置提交和重置两个按钮，否则就是一个按钮
      const itemClassName = `${styles.unLableFormItem} ${index === 0 && styles.unLableFirstItem}`;
      const fieldNode = (
        <Col span={col?.span} className={col?.className} key={name ?? index}>
          {type === 'btn' && btns ? (
            btns.map((item) => {
              return <FormItem className={styles.unLableBtnsItem}>{this.getUnLabelBtn(item)}</FormItem>;
            })
          ) : (
            <FormItem className={itemClassName} wrapperCol={{ span: 24 }}>
              {type === 'btn' ? this.getUnLabelBtn(fieldInfo) : getField(fieldInfo, this.field)}
            </FormItem>
          )}
        </Col>
      );
      return [...acc, fieldNode];
    }, []);
    return <Row>{content}</Row>;
  };

  getBtn = (btn) => {
    const { disableSubmit, resetEmpty, customReset } = this.props;
    if (btn?.type === 'submit') {
      return (
        <Form.Submit
          key="submit"
          validate
          disabled={disableSubmit}
          type="primary"
          className={btn?.className}
          onClick={this.onSubmit}
        >
          {btn.label}
        </Form.Submit>
      );
    }
    if (btn?.type === 'reset') {
      if (customReset) {
        return (
          <Button key="reset" type="normal" onClick={this.onCustomClickReset} className={styles.unLableBtn}>
            {btn.label}
          </Button>
        );
      }
      return (
        <Form.Reset key="reset" toDefault={!resetEmpty} onClick={this.onClickReset}>
          {btn.label}
        </Form.Reset>
      );
    }
    return React.isValidElement(btn) ? btn : '';
  };

  // 发现一个奇怪的现象，form的onchange会比form内每个field的onchange先执行，如果field内的onchange通过field.setvalue重新设置formvalue，
  // 可能form上的onchange不是最新的formvalue，因此这里使用一个定时器来异步获取value，达到最新value的目的
  onFormChange = (...arg) => {
    const { onChange } = this.props;
    const time = setTimeout(() => {
      onChange && onChange(this.field.getValues(), this.field, ...arg);
      clearTimeout(time);
    }, 5);
  };

  render() {
    const { btns, className, onChange } = this.props;
    const { type } = this.props.config;
    // unNomalForms是指不需要label的表单，另外一种是正常的需要label
    const isUnNomalForms = unNomalForms.includes(type);
    // 是否需要在表单单独一行写入提交或取消等按钮，另外一些表单的按钮没有单独一行，需要嵌入表单field内
    const isNeedfootBtn = !isUnNomalForms && btns?.length;
    return (
      <div className={`${styles.formWrap} ${className}`}>
        <Form useLabelForErrorMessage inline onChange={this.onFormChange} className={styles.content} field={this.field}>
          {isUnNomalForms && this.getUnNomalForm()}
          {!isUnNomalForms && this.getFormContent()}
          {isNeedfootBtn && (
            <div className="enform-btn">
              <FormItem labelAlign="left">
                {btns?.map((btn) => {
                  return this.getBtn(btn);
                })}
              </FormItem>
            </div>
          )}
        </Form>
      </div>
    );
  }
}

XdForm.Wrap = Wrap;
XdForm.getField = getField;
XdForm.contextHoc = contextHoc;

export default XdForm;
