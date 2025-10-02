import Image from "next/image";
import styles from "@/styles/Portrait.module.css";

export default function Portrait() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.circle}></div>
      <Image
        src="/images/michael-portrait.jpg"
        alt="Michael Atee"
        width={220}
        height={220}
        className={styles.image}
        priority
      />
    </div>
  );
}

