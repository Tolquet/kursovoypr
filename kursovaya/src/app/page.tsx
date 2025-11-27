import Image from "next/image";
import Link from "next/link";
import styles from "@/src/app/styles/home.module.scss"
import HomeInfo from "../shared/ui/homeInfoBlock/infoBlock";

export default function Home() {
  return (
    <>
      <section className={styles.section}>
        <div className={styles.textsec}>
          <h1>Найди своё будущее во всем мире</h1>
          <p>Discover top-tier universities, colleges, and schools globally. Explore programs, scholarships, and admission requirements to kickstart your international education journey with confidence.</p>
          <form action="">
            <input type="text" />
            <input type="submit" placeholder="search" />
          </form>
        </div>
        <div><Image src="/" alt="" width={560} height={373} /></div>
      </section>

      <section className={styles.sectionfirst}>
        <h2>Почему выбрать Global Edu Finder? </h2>
        <div>
          <ul className={`${styles.section} ${styles.info}`}>
            <HomeInfo  />
          </ul>

        </div>
      </section>

      <section className={styles.section}>
        <h2>Ready to Start Your Global Education Journey?</h2>
        <Link href="/finder">Explore All Programs <svg></svg></Link>
      </section>
    </>
  );
}
