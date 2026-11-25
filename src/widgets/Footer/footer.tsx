
import Link from "next/link"
import styles from "./styles/footer.module.scss"
export default function Footer(){
    return(
        <>
        <footer className={styles.footer}>  
            <p>© 2024 Global Edu Finder. All rights reserved.</p>
            <nav className={styles.navbar}>
                <Link href="/about">About Us</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/privacy">Privacy Policy</Link>
            </nav>
        </footer>
    </>
    )
}