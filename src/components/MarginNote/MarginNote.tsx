import styles from './MarginNote.module.scss';

export type MarginNoteProps = {
  text: string;
};

export const MarginNote = ({ text }: MarginNoteProps) => <p className={styles.note}>{text}</p>;
