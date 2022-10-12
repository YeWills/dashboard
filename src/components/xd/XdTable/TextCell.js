import React from 'react';
import { Button } from '@alifd/next';
import useAuthShow from './useAuthShow';
import styles from './index.module.scss';

const defaultVisableSetter = () => true;

const TextCell = ({ data, rowArgs }) => (
  <div className={styles.textCell}>
    {data.map(([text, onClick, visableSetter = defaultVisableSetter, props], index) => {
      const isVisable = visableSetter(...rowArgs);
      if (!isVisable) return null;
      return (
        <Button
          type="primary"
          text
          // eslint-disable-next-line react/no-array-index-key
          key={`cell${index}`}
          className={styles.btnText}
          onClick={() => {
            const btnType = text;
            onClick && onClick(rowArgs, btnType);
          }}
          {...props}
        >
          {text}
        </Button>
      );
    })}
  </div>
);

TextCell.useAuthShow = useAuthShow;
export default TextCell;
