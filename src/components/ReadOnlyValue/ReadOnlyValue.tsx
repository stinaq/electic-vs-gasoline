import styles from './ReadOnlyValue.module.scss';

export type ReadOnlyValueProps = {
  label: string;
  detail?: string | null;
  value: string;
};

export const ReadOnlyValue = ({ label, detail, value }: ReadOnlyValueProps) => (
  <div className={styles.readOnly}>
    <p className={styles.line}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </p>
    {detail && <p className={styles.detail}>{detail}</p>}
  </div>
);
