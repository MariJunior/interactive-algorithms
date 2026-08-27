import styles from "./Slider.module.css";

interface SliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  /** Подпись справа от лейбла (например, «400 ms») */
  valueLabel?: string;
  onChange: (value: number) => void;
}

/** Универсальный range-слайдер без бизнес-логики */
export default function Slider({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  valueLabel,
  onChange,
}: SliderProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
        {valueLabel !== undefined && <span className={styles.value}>{valueLabel}</span>}
      </div>
      <input
        id={id}
        className={styles.input}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
