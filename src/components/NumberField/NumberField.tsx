import styles from './NumberField.module.scss';

export type NumberFieldProps = {
  id: string;
  label: string;
  value: string;
  unit: string;
  error: string | null;
  onChange: (value: string) => void;
  onBlur: () => void;
};

export const NumberField = ({ id, label, value, unit, error, onChange, onBlur }: NumberFieldProps) => (
  <div className={styles.field}>
    <label className={styles.label} htmlFor={id}>
      {label}
    </label>
    <div className={styles.inputRow}>
      <input
        id={id}
        className={error ? styles.inputInvalid : styles.input}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
      />
      <span className={styles.unit}>{unit}</span>
    </div>
    {error && (
      <p id={`${id}-error`} className={styles.error} role="alert">
        {error}
      </p>
    )}
  </div>
);
