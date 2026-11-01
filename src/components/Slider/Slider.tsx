import styles from './Slider.module.scss';

export type SliderProps = {
  id: string;
  label: string;
  hint?: string | null;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (value: number) => void;
};

export const Slider = ({ id, label, hint, value, min, max, step, displayValue, onChange }: SliderProps) => (
  <div className={styles.slider}>
    <div className={styles.header}>
      <div className={styles.labelGroup}>
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
        {hint && <p className={styles.hint}>{hint}</p>}
      </div>
      <output className={styles.value} htmlFor={id}>
        {displayValue}
      </output>
    </div>
    <input
      id={id}
      className={styles.input}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      aria-valuetext={displayValue}
      onChange={(event) => onChange(event.target.valueAsNumber)}
    />
  </div>
);
