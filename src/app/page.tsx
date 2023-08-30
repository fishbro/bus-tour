import styles from './page.module.css'
import MainLayer from "@/app/modules/main/MainLayer";

export default function Home() {
  return (
    <main className={styles.main}>
      <MainLayer />
    </main>
  )
}
