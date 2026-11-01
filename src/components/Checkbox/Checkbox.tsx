import styles from './Checkbox.module.scss';

export type CheckboxProps = {
  id: string;
  label: string;
  hint?: string | null;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const Checkbox = ({ id, label, hint, checked, onChange }: CheckboxProps) => (
  <div className={styles.field}>
    <label className={styles.checkbox} htmlFor={id}>
      <input
        id={id}
        className={styles.input}
        type="checkbox"
        checked={checked}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={styles.label}>{label}</span>
    </label>
    {hint && (
      <p id={`${id}-hint`} className={styles.hint}>
        {hint}
      </p>
    )}
  </div>
);
