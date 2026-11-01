import type { ReactNode } from 'react';
import styles from './NoteGroup.module.scss';

export type NoteGroupProps = {
  children: ReactNode;
};

export const NoteGroup = ({ children }: NoteGroupProps) => <aside className={styles.group}>{children}</aside>;
