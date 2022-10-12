const getTimeValue = (val, format = 'YYYY-MM-DD') => {
  if (!val) {
    return undefined;
  }
  if (typeof val === 'string') {
    return val;
  }
  return val.format(format);
};

const getNewParams = ({ paramsName, paramsValue, nameConfig, allParams }) => {
  let newParams = { ...allParams };
  //   addOrigin 当有names，是否还要将原来的name加入到allParams
  const { type, format, names, addOrigin, setValue, deepSetValue } = nameConfig;
  // 快捷设置值
  if (setValue) {
    newParams[paramsName] = setValue({ paramsName, paramsValue, nameConfig, newParams });
    return newParams;
  }
  // 深入自定义快捷设置值
  if (deepSetValue) {
    return deepSetValue({ paramsName, paramsValue, nameConfig, newParams });
  }
  switch (type) {
    case 'rangePicker': {
      const [startTimeName, endTimeName] = names;
      if (Array.isArray(paramsValue)) {
        const [startValue, endValue] = paramsValue;
        if (addOrigin) {
          newParams = { ...newParams, [paramsName]: paramsValue };
        }
        return {
          ...newParams,
          [startTimeName]: getTimeValue(startValue, format),
          [endTimeName]: getTimeValue(endValue, format),
        };
      }
      return newParams;
    }
    default: {
      return newParams;
    }
  }
};

// 用于查询表单，查询前转化为接口接受的入参
const handleParams = (queryParams, paramsConfig) => {
  return Object.entries(queryParams).reduce((acc, [paramsName, paramsValue]) => {
    const nameConfig = paramsConfig[paramsName];
    if (nameConfig) {
      return getNewParams({ paramsName, paramsValue, nameConfig, allParams: acc });
    }
    acc[paramsName] = paramsValue;
    return acc;
  }, {});
};

export default handleParams;
