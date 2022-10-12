import React from 'react';

import { Tab } from '@alifd/next';
import { Link } from 'dva/router';

const TopTab = ({ datas, currentValue, onCloseTab }) => {
  return (
    <Tab shape="wrapped" activeKey={currentValue} onClose={onCloseTab} className="custom-tab" animation={false}>
      {datas.map((pane) => {
        const { label, path, search } = pane;
        // search || '' 避免undefined
        return (
          <Tab.Item
            title={<Link to={`${path}${search || ''}`}>{label}</Link>}
            key={path}
            closeable={datas.length > 1}
          />
        );
      })}
    </Tab>
  );
};

export default TopTab;
