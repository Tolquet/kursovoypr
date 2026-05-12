import Image from "next/image"
import styles from "./styles/style.module.scss"        

export default function HomeInfo() {
    return(
    <>
        <li className={styles.li}>
            <Image src="/images/" alt="img" width={30} height={30} />
            <h3>Access to Top Institutions</h3>
            <p>Explore a curated list of world-renowned universities and colleges.</p>
        </li>
        <li className={styles.li}>
            <Image src="/images/pngtree-cute-watercolor-panda-isolated-png-image_11514954.png" alt="img" width={30} height={30} />
            <h3>Personalized Recommendations</h3>
            <p>Get tailored program suggestions based on your profile and goals.</p>
        </li>
        <li className={styles.li}>
            <Image src="/images/pngtree-cute-watercolor-panda-isolated-png-image_11514954.png" alt="img" width={30} height={30} />
            <h3>Scholarship Opportunities</h3>
            <p>Discover various funding options to support your international studies.</p>
        </li>
        <li className={styles.li}>
            <Image src="/images/pngtree-cute-watercolor-panda-isolated-png-image_11514954.png" alt="img" width={30} height={30} />
            <h3>Worldwide Network</h3>
            <p>Connect with a global community of students and alumni.</p>
        </li>
    </>
    )
}