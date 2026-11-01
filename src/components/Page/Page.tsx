import type { ReactNode } from 'react';
import styles from './Page.module.scss';

export type PageProps = {
  title: string;
  children: ReactNode;
};

export const Page = ({ title, children }: PageProps) => (
  <main className={styles.page}>
    <h1 className={styles.title}>{title}</h1>
    {children}
  </main>
);
