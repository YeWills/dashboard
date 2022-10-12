/* eslint-disable no-unused-vars */
import React, { useMemo } from 'react';
import { getAuthorityPriceStatus } from '@components/Authority';

const getAuthority = (buttonKey, menuBtnList) => {
  return getAuthorityPriceStatus(buttonKey, menuBtnList);
};

const defaultFn = () => true;
const useAuthShow = (menuBtnList, btnKey, fn = defaultFn) => {
  const authority = useMemo(() => {
    return getAuthority(btnKey, menuBtnList);
  }, [menuBtnList, btnKey]);

  return authority ? fn : () => false;
};

export default useAuthShow;
