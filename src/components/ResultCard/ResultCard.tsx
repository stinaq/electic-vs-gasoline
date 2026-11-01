import styles from './ResultCard.module.scss';

export type ResultCardProps = {
  title: string;
  cost: string;
  highlighted: boolean;
};

export const ResultCard = ({ title, cost, highlighted }: ResultCardProps) => (
  <div className={highlighted ? styles.highlighted : styles.card}>
    <h3 className={styles.title}>{title}</h3>
    <p className={styles.cost}>
      <span className={styles.stroke}>{cost}</span>
    </p>
  </div>
);
