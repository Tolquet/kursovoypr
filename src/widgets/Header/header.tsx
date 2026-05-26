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
              src="https://res.cloudinary.com/dffpkcdq7/image/upload/v1779127750/%D0%BB%D0%BE%D0%B3%D0%BE%D1%82%D0%B8%D0%BF%D1%87%D0%B8%D0%BA_edu.png"
              alt="Global Edu Logo"
              width={200}
              height={70}
              priority
    
            />
          </Link>
        </div>
        <div className={styles.header_button}>
          <button onClick={() => handleTypeClick('university')} className={styles.nav_link}>Университеты</button>
          <button onClick={() => handleTypeClick('college')} className={styles.nav_link}>Колледжи</button>
          <button onClick={() => handleTypeClick('school')} className={styles.nav_link}>Школы</button>
          <button onClick={() => handleTypeClick(null)} className={styles.nav_link}>Все заведения</button>
        </div>

        <div className={styles.contact}>
          <a href="tel:+79677158899">+7 967 715 88 99</a>
          <a href="mailto:anatoly.shv05@mail.ru">anatoly.shv05@mail.ru</a>
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
        <p>Нужна помощь в выборе? Свяжитесь с нашими консультантами!</p>
        <div>
          <a href="tel:+79677158899">+7(967)-715-88-99</a>
        </div>
        <div>
          
          <a href="mailto:anatoly.shv05@mail.ru">anatoly.shv05@mail.ru</a>
        </div>
        <button className={styles.live_chat_button}>Live Chat</button>
        <div>ПОН-ПЯТ С 09.00-18.00</div>
      </div>
    </header>
  );
}