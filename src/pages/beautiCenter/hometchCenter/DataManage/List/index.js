import React from 'react';
import { connect } from 'dva';
import KeepAlive from '@components/KeepAlive';
import { Loading } from '@alifd/next';
import XdTable from '@components/xd/XdTable';
import XdForm from '@components/xd/XdForm';
import columns from './const/column.config';
import { queryItemSaleStatusInfoPost } from './const/serve';
import formConfig from './const/queryform.config';
import styles from './list.scss';

const getDefautFormValue = () => {
  return {};
};

class pageList extends React.Component {
  constructor(props) {
    super(props);
    this.keyId = 'kzSkuCode';
    this.state = {
      queryparams: { ...getDefautFormValue() },
      loading: false,
      tableRefreshKey: 0,
      currentRow: undefined,
      isShowStateDlg: false,
      isShowImportPage: false,
      rowSelection: this.initRowSelection([]),
    };

    this.columns = [...columns];
  }

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
    this.setState({
      rowSelection: this.initRowSelection([]),
    });
  };

  onSearch = (field, values) => {
    this.setState({ queryparams: { ...values } });
  };

  render() {
    const { loading, queryparams, rowSelection, isShowImportPage, tableRefreshKey } = this.state;

    return (
      <Loading visible={loading} style={{ width: '100%' }} tip="加载中...">
        <div className={`${styles.container} ${isShowImportPage ? styles.displayNone : ''}`}>
          <XdForm
            config={formConfig}
            resetEmpty
            defaultValue={queryparams}
            className={styles.form}
            btns={formConfig.btns}
            onSubmit={this.onSearch}
            onReset={this.onSearch}
          />

          <div className={styles.body}>
            <XdTable
              post={queryItemSaleStatusInfoPost}
              pageSizeList={[10, 50, 100]}
              onReload={this.onReload}
              fixedHeader
              refreshKey={tableRefreshKey}
              primaryKey={this.keyId}
              maxBodyHeight={440}
              queryParams={queryparams}
              columns={this.columns}
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
