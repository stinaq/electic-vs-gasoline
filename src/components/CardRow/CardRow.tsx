import type { ReactNode } from 'react';
import styles from './CardRow.module.scss';

export type CardRowProps = {
  children: ReactNode;
};

export const CardRow = ({ children }: CardRowProps) => <div className={styles.row}>{children}</div>;
