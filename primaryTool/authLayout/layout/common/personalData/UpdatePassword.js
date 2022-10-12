import React from 'react';
import { connect } from 'dva';
import { Form, Field, Message } from '@alifd/next';
import md5 from 'md5';
import Title from '../title';
import { request } from '../../../../utils';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    fixedSpan: 8,
  },
  wrapperCol: {
    span: 14,
  },
};

class UpdatePassword extends React.Component {
  field = new Field(this);

  handleSubmit = () => {
    this.field.validate(async (error) => {
      if (error) return;
      const res = await request({
        url: '/updateuserPwd',
        params: {
          pwd: md5(12345),
        },
      });
      if (typeof res === 'boolean' && res) {
        Message.show({ type: 'success', content: '密码修改成功' });
        this.goBack();
      }
    });
  };

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <div style={{ padding: '12px' }}>
        <Title title="修改密码" hasBorder></Title>
        <Form field={this.field} style={{ width: '600px', margin: '40px auto 0' }} {...formItemLayout}>
          <FormItem label=" ">
            <Form.Submit style={{ margin: '0 16px 0 65px' }} type="primary" onClick={this.handleSubmit}>
              提交
            </Form.Submit>
            <Form.Submit style={{ margin: '0 16px' }} onClick={this.goBack}>
              返回
            </Form.Submit>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = ({ GlobalState, PersonalData }) => {
  return {
    GlobalState,
    PersonalData,
  };
};

export default connect(mapStateToProps)(UpdatePassword);
