// eslint-disable-next-line no-unused-vars
import React from 'react';
import Select from './Select';

// next的Form Item源码中对select 做了ref，因此要做一层ref转发
// 不过使用ref转发会带来form无法嵌入select组件的问题，此问题需要进一步看一下，暂时先忽略ref的使用；
// 看了下next Form 组件源码，框架层面没有使用ref做逻辑操作，只要业务层面不显示定义ref使用，是不会有问题的。

// export default React.forwardRef((props, ref) => {
//   return <Select {...props} forwardedRef={ref} />;
// });

export default Select;
