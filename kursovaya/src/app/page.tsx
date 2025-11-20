import Image from "next/image";
import Link from "next/link";
import styles from "@/src/app/styles/home.module.scss"

export default function Home() {
  return (
    <>
      <section className={styles.sectionfirst}>
        <div>
          <h1>Find Your Future. Anywhere in the World.</h1>
          <p>Discover top-tier universities, colleges, and schools globally. Explore programs, scholarships, and admission requirements to kickstart your international education journey with confidence.</p>
          <form action="">
            <input type="text" />
            <input type="submit" placeholder="search" />
          </form>
        </div>
        <div><Image src="/image.png" alt="img" width={560} height={373} /></div>
      </section>

      <section>
        <h2>Why Choose Global Edu Finder? </h2>
        <div>
          <ul>
            <li>
              <Image src="/" alt="img" width={30} height={30}/>
              <h3>Access to Top Institutions</h3>
              <p>Explore a curated list of world-renowned universities and colleges.</p>
            </li>
            <li>
              <Image src="/" alt="img" width={30} height={30}/>
              <h3>Personalized Recommendations</h3> 
              <p>Get tailored program suggestions based on your profile and goals.</p>
            </li>
            <li>
              <Image src="/" alt="img" width={30} height={30}/>
              <h3>Scholarship Opportunities</h3>
              <p>Discover various funding options to support your international studies.</p>
            </li>
            <li>
              <Image src="/" alt="img" width={30} height={30}/>
              <h3>Worldwide Network</h3>
              <p>Connect with a global community of students and alumni.</p>
            </li>
          </ul>

        </div>
      </section>

      <section>
        <h2>Ready to Start Your Global Education Journey?</h2>
        <Link href="/finder">Explore All Programs <svg></svg></Link>
      </section>
    </>
  );
}
