// src/app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './styles/login.module.scss';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Перенаправляем авторизованных пользователей на профиль
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/profile');
    }
  }, [status, router]);

  // Показываем загрузку, пока проверяем аутентификацию
  if (status === 'loading') {
    return (
      <div className={styles.login_page}>
        <div className={styles.login_container}>
          <div className={styles.login_header}>
            <p>Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  // Если пользователь уже авторизован, не показываем форму
  if (status === 'authenticated') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('[Login] Attempting login with:', formData.email);
      
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      console.log('[Login] Result:', result);

      if (result?.error) {
        console.error('[Login] Error:', result.error);
        setError(result.error);
      } else if (result?.ok) {
        console.log('[Login] Success, redirecting to profile');
        router.push('/profile');
        router.refresh();
      } else {
        console.error('[Login] Unexpected result:', result);
        setError('Неверный email или пароль');
      }
    } catch (err) {
      console.error('[Login] Exception:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при входе');
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