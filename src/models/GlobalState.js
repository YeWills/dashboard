export default {
  namespace: 'GlobalState',
  state: {
    userId: '',
    userMsg: '',
    superAdmin: false,
    checkTicketFlag: false,

    weight: null,

    ledgerId: '',
    ledgerCode: '',
    ledgerName: '',
    ledgerChange: false,

    systemList: [],
    systemSelected: {},

    companyName: '',
    companyId: null,

    pageSizeList: [10, 50, 100], // 默认分页列表可选长度

    menuBtnList: [],
    menuConfig: [],
    allMenuList: [],
    renderFlag: false,
    param: {},
  },
  subscriptions: {},
  effects: {
    *saveData(action, { put, call }) {
      console.log(action);
      const param = JSON.parse(JSON.stringify(action.data));
      const obj = {};
      obj[param.url] = param.data;
      yield put({ type: 'save', payload: obj });
    },
  },
  reducers: {
    save(state, { payload }) {
      // console.log({ ...state, ...payload });
      return { ...state, ...payload };
    },
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
