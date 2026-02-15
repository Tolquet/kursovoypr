'use client';

import Image from "next/image";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import styles from '../Header/styles/header.module.scss';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link href="/">
            <Image
              className={styles.logo_image}
              src="/"
              alt="Global Edu Logo"
              width={20}
              height={20}
            />
            Global Edu
          </Link>
        </div>
        <div className={styles.header_button}>
          <Link href="/finder?type=university">University</Link>
          <Link href="/finder?type=college">College</Link>
          <Link href="/finder?type=school">School</Link>
          {/* Или общая страница поиска */}
          <Link href="/finder">Все заведения</Link>
        </div>

        <div className={styles.contact}>
          <a href="tel:+79677158899">+7 967 715 88 99</a>
          <a href="mailto:info@globaledu.com">info@globaledu.com</a>
        </div>

        <div className={styles.auth_buttons}>
          {status === 'loading' ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : session ? (
            <div className={styles.user_menu}>
              <Link href="/profile" className={styles.profile_link}>
                <span className={styles.user_name}>
                  {session.user?.name || session.user?.email?.split('@')[0]}
                </span>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login">
                <button className={styles.login_button}>Войти</button>
              </Link>
              <Link href="/register">
                <button className={styles.register_button}>Регистрация</button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className={styles.help}>
        <p>Need help choosing? Contact our educational consultants!</p>
        <div>
          <Image src="/" alt="" width={30} height={30}/>
          <a href="tel:+18001234567">+7 (800) 123-4567</a>
        </div>
        <div>
          <Image src="/" alt="" width={30} height={30}/>
          <a href="mailto:support@globaledu.com">support@globaledu.com</a>
        </div>
        <button className={styles.live_chat_button}>Live Chat</button>
        <div>ПОН-ПЯТ С 09.00-18.00</div>
      </div>
    </header>
  );
}