import styles from './Checkbox.module.scss';

export type CheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const Checkbox = ({ id, label, checked, onChange }: CheckboxProps) => (
  <label className={styles.checkbox} htmlFor={id}>
    <input
      id={id}
      className={styles.input}
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
    <span className={styles.label}>{label}</span>
  </label>
);
