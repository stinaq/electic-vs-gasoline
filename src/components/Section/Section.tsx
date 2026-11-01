import type { ReactNode } from 'react';
import styles from './Section.module.scss';

export type SectionProps = {
  heading: string;
  children: ReactNode;
};

export const Section = ({ heading, children }: SectionProps) => (
  <section className={styles.section}>
    <h2 className={styles.heading}>{heading}</h2>
    {children}
  </section>
);
