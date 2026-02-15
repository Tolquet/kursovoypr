// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './styles/login.module.scss';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (result?.error) {
        setError('Неверный email или пароль');
      } else {
        router.push('/profile');
        router.refresh();
      }
    } catch {
      setError('Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.login_page}>
      <div className={styles.login_container}>
        <div className={styles.login_header}>
          <h1>Вход в систему</h1>
          <p>Добро пожаловать в Global Edu Finder</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.login_form}>
          {error && (
            <div className={styles.error_message}>
              {error}
            </div>
          )}

          <div className={styles.form_group}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className={styles.form_group}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submit_button}
            disabled={loading}
          >
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>

        <div className={styles.login_footer}>
          <p>Нет аккаунта?</p>
          <Link href="/register" className={styles.register_link}>
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
}