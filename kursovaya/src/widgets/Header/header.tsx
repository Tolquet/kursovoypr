'use client';

import Image from "next/image";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from '../Header/styles/header.module.scss';

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleTypeClick = (type: string | null) => {
    if (type) {
      router.push(`/finder?type=${type}`);
    } else {
      router.push('/finder');
    }
  };

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
          <button onClick={() => handleTypeClick('university')} className={styles.nav_link}>University</button>
          <button onClick={() => handleTypeClick('college')} className={styles.nav_link}>College</button>
          <button onClick={() => handleTypeClick('school')} className={styles.nav_link}>School</button>
          <button onClick={() => handleTypeClick(null)} className={styles.nav_link}>Все заведения</button>
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
          
          <a href="tel:+18001234567">+7 (800) 123-4567</a>
        </div>
        <div>
          
          <a href="mailto:support@globaledu.com">support@globaledu.com</a>
        </div>
        <button className={styles.live_chat_button}>Live Chat</button>
        <div>ПОН-ПЯТ С 09.00-18.00</div>
      </div>
    </header>
  );
}