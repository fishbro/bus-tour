import styles from "./page.module.css";
import Viewer from "@/app/modules/viewer/Viewer";

export default function Home() {
    return (
        <main className={styles.main}>
            <Viewer />
        </main>
    );
}
