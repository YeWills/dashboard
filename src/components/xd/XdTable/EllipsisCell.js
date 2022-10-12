import React from 'react';
import styles from './index.module.scss';

const EllipsisCell = ({ text }) => (
  <div title={text} className={styles.ellipsisCell}>
    {text}
  </div>
);

export default EllipsisCell;

export const getEllipsisCell = (name) => (index, position, row) => <EllipsisCell text={row[name]} />;
