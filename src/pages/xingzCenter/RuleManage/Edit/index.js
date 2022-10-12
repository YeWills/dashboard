import React from 'react';
import { connect } from 'dva';
import { Loading } from '@alifd/next';

import styles from './index.module.scss';

const EditComp = ({ history }) => {
  const goBack = () => {
    history.push({ pathname: '/tryq/xingzCenter/RuleManage/List' });
  };
  return (
    <Loading visible={false} style={{ width: '100%' }} tip="加载中...">
      <div className={styles.contract_rule_manage_main}>新增 编辑</div>
      <div onClick={goBack}>返回</div>
    </Loading>
  );
};
const Edit = connect()(EditComp);
export default Edit;
