import React from 'react';
import { checkButton } from '@utils/common';

const Authority = ({ children, buttonKey, menuBtnList }) => {
  const isShow = checkButton(buttonKey, menuBtnList || []);
  return <>{isShow && children}</>;
};

export default Authority;

export const getAuthorityPriceStatus = (buttonKey, menuBtnList) => {
  return checkButton(buttonKey, menuBtnList || []);
};
