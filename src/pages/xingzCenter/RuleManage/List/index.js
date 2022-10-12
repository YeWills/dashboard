import React from 'react';
import request from '@utils/request';
import { connect } from 'dva';

import { Loading, Tab, Form, Grid, Input, Button, Field } from '@alifd/next';
import XdTable from '@components/xd/XdTable';
import KeepAlive from '@components/KeepAlive';
import columns from './const/column.config';

import styles from './list.scss';

// 签约规则管理列表
export const signRuleFacadePost = (params) => {
  return request({
    url: '/authcenter/tableListPost',
    params,
  });
};

const FormItem = Form.Item;
const { Row, Col } = Grid;

const initvalues = { ruleStatus: '1', thirdType: '1', sourceChannel: '1' };

class pageList extends React.Component {
  constructor(props) {
    super(props);
    this.keyId = 'id';

    this.field = new Field(this, { values: { ...initvalues } });
    this.state = {
      queryparams: { ...initvalues },
      loading: false,
      // statusMap: {},
      belongBizManagerMap: {},
      belongBizTypeMaps: {},
      channelMaps: {},
      tableRefreshKey: 0,
      rowSelection: this.initRowSelection([]),
    };
  }

  goAddEditPage = (biztype, id) => {
    const { history } = this.props;
    const { belongBizTypeMaps } = this.state;
    const idstr = id ? `&id=${id}` : '';
    history.push({
      pathname: '/tryq/xingzCenter/RuleManage/Edit',
      search: `?biztype=${biztype}&biztypestr=${belongBizTypeMaps[biztype]}${idstr}`,
    });
  };

  clickAdd = () => {
    this.goAddEditPage(this.field.getValue('belongBizType'));
  };

  initRowSelection = (selectedRowKeys) => {
    return {
      onChange: this.onChange,
      selectedRowKeys,
    };
  };

  onChange = (ids) => {
    // ids 可能包含了当前分页列表数据中没有的， records只显示当前分页数据 是否选中的情况，因此要以ids为准
    const { rowSelection } = this.state;
    rowSelection.selectedRowKeys = ids;
    this.setState({ rowSelection });
  };

  onReload = () => {
    // 每次页面重新 加载，将重置 复选框为初始状态
    this.setState({
      rowSelection: this.initRowSelection([]),
    });
  };

  onSubmit = (values, err) => {
    if (err) return;
    const { queryparams } = this.state;
    this.setState({ queryparams: { ...queryparams, ...values } });
  };

  render() {
    const { loading, queryparams, rowSelection, tableRefreshKey } = this.state;

    return (
      <Loading visible={loading} style={{ width: '100%' }} tip="加载中...">
        <div className={styles.container}>
          <div>
            <Tab
              activeKey={queryparams.ruleStatus}
              onChange={(val) => {
                this.setState({ queryparams: { ...queryparams, ruleStatus: val } });
              }}
            >
              <Tab.Item title="启用中" key="1" />
              <Tab.Item title="停用中" key="0" />
            </Tab>
          </div>
          <Form inline className={styles.queryForm} field={this.field}>
            <Row className={styles.formRow}>
              <Col span={8}>
                <FormItem
                  labelAlign="left"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label="人："
                  className={styles.fieldItem}
                >
                  <Input name="createPerson" placeholder="请输入" />
                </FormItem>
              </Col>
            </Row>
            <Row className={styles.btnWrap}>
              <div>
                <FormItem>
                  <Form.Reset key="reset" toDefault onClick={this.onCustomClickReset} className={styles.resetBtn}>
                    重置
                  </Form.Reset>
                </FormItem>
                <FormItem>
                  <Form.Submit key="submit" validate type="primary" className={styles.queryBtn} onClick={this.onSubmit}>
                    搜索
                  </Form.Submit>
                </FormItem>
              </div>
            </Row>
          </Form>
          <div className={styles.btns}>
            <Button type="normal" className={styles.actionBtn} onClick={this.clickAdd}>
              创建
            </Button>
          </div>
          <div className={styles.body}>
            <XdTable
              post={signRuleFacadePost}
              pageSizeList={[10, 50, 100]}
              onReload={this.onReload}
              pageNumName="pageNo"
              fixedHeader
              refreshKey={tableRefreshKey}
              primaryKey={this.keyId}
              maxBodyHeight={440}
              queryParams={queryparams}
              columns={columns}
              rowSelection={rowSelection}
            />
          </div>
        </div>
      </Loading>
    );
  }
}

const mapStateToProps = ({ GlobalState }) => {
  return {
    GlobalState,
  };
};

export default connect(mapStateToProps)(KeepAlive(pageList));
