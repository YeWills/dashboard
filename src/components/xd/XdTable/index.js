import React, { useState, useEffect, useRef } from 'react';
import { Table, Pagination } from '@alifd/next';
import { useStateFromProps } from '@utils/useHooks';
import TextCell from './TextCell';
import defaultHandleParams from './handleParams';
import styles from './index.module.scss';

const defaultGenerateKeysData = (data, keys) => {
  if (!keys || !Array.isArray(keys)) return data;
  if (!data?.length) return data;
  const [keyId, keyNames] = keys;
  return data.map((row) => {
    const newRow = { ...row };
    newRow[keyId] = keyNames.reduce((acc, name) => `${acc}${newRow[name]}`, '');
    return newRow;
  });
};

// primaryKey 可以作为table的keyId， keys当为字符串时，与primaryKey相同，当为数组时，说明table需要通过keys生成keyId(primaryKey)
const XdTable = ({
  isOldNext = false, // next 新版本支持column config配置化，就版本不支持
  pageNumName = 'pageNum',
  pageSizeName = 'pageSize',
  isShowPagination = true,
  getPageNum,
  post,
  keys, // 只有当每条数据的ID是有多个keyName决定时才使用，keys与generateKeysData 配合使用，
  generateKeysData = defaultGenerateKeysData,
  queryParams,
  paramsConfig, // 用于查询表单，查询前转化为接口接受的入参
  handleParams = defaultHandleParams,
  defaultPageSize = 10,
  getLists = (res) => res?.resultList || res?.details || res?.records || [],
  columns,
  datas,
  onLoading,
  onReload,
  pageSizeList,
  refreshKey,
  defaultDatas = [],
  ...rest
}) => {
  const [dataList, setData] = useState(defaultDatas);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [isLoading, setLoading] = useState(false);
  const mounted = useRef(false);

  const forceUpdateKey = useStateFromProps(queryParams, () => {
    // 当queryParams改变时，需要初始化pageNo和PageSize
    setPageNo(1);
    setPageSize(defaultPageSize);
  });
  useEffect(() => {
    if (!post) return;
    setLoading(true);
    const fetchData = async () => {
      const params = {
        ...(paramsConfig ? handleParams(queryParams, paramsConfig) : queryParams),
        [pageNumName]: getPageNum ? getPageNum(pageNum, pageSize) : pageNum,
        [pageSizeName]: pageSize,
      };
      const response = await post(params);
      const resultList = generateKeysData(getLists(response), keys);
      setLoading(false);
      setData(resultList);
      onLoading && onLoading();
      const validtotal = response?.totalSize || response?.totalCount || response?.total || 0;
      setTotal(Number(validtotal));
      if (!mounted.current) {
        // 数据第一次加载
        mounted.current = true;
      } else {
        // 以后每次数据加载都会触发
        onReload && onReload();
      }
    };
    fetchData();
  }, [pageNum, pageSize, forceUpdateKey, refreshKey]);

  const realDataList = datas || dataList;
  return (
    <div className={styles.girdWrap}>
      {isOldNext ? (
        <Table dataSource={realDataList} loading={isLoading} {...rest}>
          {columns.map((item) => (
            <Table.Column key={item.dataIndex} {...item} />
          ))}
        </Table>
      ) : (
        <Table columns={columns} dataSource={realDataList} loading={isLoading} {...rest} />
      )}
      {isShowPagination && (
        <Pagination
          className={styles.page}
          style={{
            display: realDataList?.length ? undefined : 'none',
          }}
          total={total}
          current={pageNum}
          pageSizeList={pageSizeList}
          pageSize={pageSize}
          onChange={(val) => {
            setPageNo(val);
          }}
          pageSizeSelector="dropdown"
          pageSizePosition="end"
          onPageSizeChange={(val) => {
            setPageNo(1); // PageSize 改变，应该重置PageNo
            setPageSize(val);
          }}
          totalRender={(_total) => `总${_total}条/${Math.ceil(_total / pageSize)}页`}
        />
      )}
    </div>
  );
};

XdTable.TextCell = TextCell;

export default XdTable;
