import styles from './Summary.module.scss';

export type SummaryProps = {
  text: string;
};

export const Summary = ({ text }: SummaryProps) => (
  <p className={styles.summary} aria-live="polite">
    {text}
  </p>
);
