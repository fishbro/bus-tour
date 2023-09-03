import styles from "./page.module.css";
import MainLayer from "@/app/modules/main/MainLayer";
import Place from "@/app/modules/place/Place";

export default function Home() {
    return (
        <main className={styles.main}>
            <MainLayer />
            <Place />
        </main>
    );
}
