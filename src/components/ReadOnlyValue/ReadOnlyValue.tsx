import styles from './ReadOnlyValue.module.scss';

export type ReadOnlyValueProps = {
  label: string;
  value: string;
};

export const ReadOnlyValue = ({ label, value }: ReadOnlyValueProps) => (
  <p className={styles.readOnly}>
    <span className={styles.label}>{label}</span>
    <span className={styles.separator} aria-hidden="true">
      ·
    </span>
    <span className={styles.value}>{value}</span>
  </p>
);
