// src/app/register/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/src/shared/ui/Icon/Icon';
import styles from './styles/register.module.scss';

type UserType = 'student' | 'applicant' | 'school' | 'company';

interface CompanyData {
  contactPerson: string;
  companyName: string;
  inn: string;
  legalAddress: string;
  position: string;
  phone: string;
  department: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userType, setUserType] = useState<UserType>('student');
  
  // Общие поля
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Поля для компаний
  const [companyData, setCompanyData] = useState<CompanyData>({
    contactPerson: '',
    companyName: '',
    inn: '',
    legalAddress: '',
    position: '',
    phone: '',
    department: ''
  });

  // Перенаправляем авторизованных пользователей на профиль
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/profile');
    }
  }, [status, router]);

  // Показываем загрузку, пока проверяем аутентификацию
  if (status === 'loading') {
    return (
      <div className={styles.register_page}>
        <div className={styles.register_container}>
          <div className={styles.register_header}>
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

  // Валидация ИНН (для России 10 или 12 цифр)
  const validateINN = (inn: string): boolean => {
    const innDigits = inn.replace(/\D/g, '');
    return innDigits.length === 10 || innDigits.length === 12;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Базовая валидация
    if (!email || !password) {
      setError('Email и пароль обязательны');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Неверный формат email');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    // Валидация для компаний
    if (userType === 'company') {
      if (!companyData.contactPerson) {
        setError('Укажите контактное лицо');
        return;
      }
      if (!companyData.companyName) {
        setError('Укажите название компании');
        return;
      }
      if (!companyData.inn || !validateINN(companyData.inn)) {
        setError('ИНН должен содержать 10 или 12 цифр');
        return;
      }
      if (!companyData.legalAddress) {
        setError('Укажите юридический адрес');
        return;
      }
      if (!companyData.position) {
        setError('Укажите должность');
        return;
      }
      if (!companyData.phone) {
        setError('Укажите телефон');
        return;
      }
      if (!companyData.department) {
        setError('Укажите название отдела');
        return;
      }
    }

    setIsLoading(true);

    try {
      const payload: Record<string, unknown> = {
        email,
        name: name || email.split('@')[0],
        password,
        userType
      }

      // Добавляем данные компании, если пользователь - юрлицо
      if (userType === 'company') {
        payload.companyData = companyData
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при регистрации')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при регистрации'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompanyDataChange = (field: keyof CompanyData, value: string) => {
    setCompanyData((prev: CompanyData) => ({ ...prev, [field]: value }));
  };

  if (success) {
    return (
      <div className={styles.register_page}>
        <div className={styles.register_container}>
          <div className={styles.register_header}>
            <h1>Регистрация успешна!</h1>
            <p>Вы будете перенаправлены на страницу входа...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.register_page}>
      <div className={styles.register_container}>
        <div className={styles.register_header}>
          <h1>Регистрация</h1>
          <p>Создайте аккаунт для доступа ко всем возможностям</p>
        </div>

        {error && <div className={styles.error_message}>{error}</div>}

        <form onSubmit={handleRegister} className={styles.register_form}>
          {/* Выбор типа пользователя */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Кто вы?</label>
            <div className={styles.user_type_selector}>
              <label className={styles.user_type_option}>
                <input
                  type="radio"
                  name="userType"
                  value="student"
                  checked={userType === 'student'}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                />
                <span className={styles.user_type_card}>
                  <span className={styles.user_type_icon}>
                    <Icon name="university" size={32} />
                  </span>
                  <span className={styles.user_type_title}>Студент</span>
                  <span className={styles.user_type_desc}>Учащийся учебного заведения</span>
                </span>
              </label>

              <label className={styles.user_type_option}>
                <input
                  type="radio"
                  name="userType"
                  value="applicant"
                  checked={userType === 'applicant'}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                />
                <span className={styles.user_type_card}>
                  <span className={styles.user_type_icon}>
                    <Icon name="user-check" size={32} />
                  </span>
                  <span className={styles.user_type_title}>Абитуриент</span>
                  <span className={styles.user_type_desc}>Поступающий в учебное заведение</span>
                </span>
              </label>

              <label className={styles.user_type_option}>
                <input
                  type="radio"
                  name="userType"
                  value="school"
                  checked={userType === 'school'}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                />
                <span className={styles.user_type_card}>
                  <span className={styles.user_type_icon}>
                    <Icon name="school" size={32} />
                  </span>
                  <span className={styles.user_type_title}>Школьник</span>
                  <span className={styles.user_type_desc}>Учащийся школы</span>
                </span>
              </label>

              <label className={styles.user_type_option}>
                <input
                  type="radio"
                  name="userType"
                  value="company"
                  checked={userType === 'company'}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                />
                <span className={styles.user_type_card}>
                  <span className={styles.user_type_icon}>
                    <Icon name="building" size={32} />
                  </span>
                  <span className={styles.user_type_title}>Компания</span>
                  <span className={styles.user_type_desc}>Юридическое лицо / Организация</span>
                </span>
              </label>
            </div>
          </div>

          {/* Общие поля */}
          <div className={styles.form_section}>
            <h3 className={styles.form_section_title}>Основные данные</h3>
            
            <div className={styles.form_row}>
              <div className={styles.form_group}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className={styles.form_group}>
                <label htmlFor="name">Имя</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ваше имя"
                />
              </div>
            </div>

            <div className={styles.form_row}>
              <div className={styles.form_group}>
                <label htmlFor="password">Пароль *</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 6 символов"
                  required
                />
              </div>

              <div className={styles.form_group}>
                <label htmlFor="confirmPassword">Повторите пароль *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторите пароль"
                  required
                />
              </div>
            </div>
          </div>

          {/* Поля для компаний */}
          {userType === 'company' && (
            <div className={`${styles.form_section} ${styles.company_section}`}>
              <h3 className={styles.form_section_title}>Данные компании</h3>
              
              <div className={styles.form_row}>
                <div className={styles.form_group}>
                  <label htmlFor="contactPerson">Контактное лицо *</label>
                  <input
                    type="text"
                    id="contactPerson"
                    value={companyData.contactPerson}
                    onChange={(e) => handleCompanyDataChange('contactPerson', e.target.value)}
                    placeholder="Иван Иванов"
                    required
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="companyName">Название компании *</label>
                  <input
                    type="text"
                    id="companyName"
                    value={companyData.companyName}
                    onChange={(e) => handleCompanyDataChange('companyName', e.target.value)}
                    placeholder="ООО &quot;Название&quot;"
                    required
                  />
                </div>
              </div>

              <div className={styles.form_row}>
                <div className={styles.form_group}>
                  <label htmlFor="inn">ИНН *</label>
                  <input
                    type="text"
                    id="inn"
                    value={companyData.inn}
                    onChange={(e) => handleCompanyDataChange('inn', e.target.value.replace(/\D/g, ''))}
                    placeholder="10 или 12 цифр"
                    maxLength={12}
                    required
                  />
                  <span className={styles.form_hint}>ИНН должен содержать 10 или 12 цифр</span>
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="position">Должность *</label>
                  <input
                    type="text"
                    id="position"
                    value={companyData.position}
                    onChange={(e) => handleCompanyDataChange('position', e.target.value)}
                    placeholder="Генеральный директор"
                    required
                  />
                </div>
              </div>

              <div className={styles.form_group}>
                <label htmlFor="legalAddress">Юридический адрес *</label>
                <textarea
                  id="legalAddress"
                  value={companyData.legalAddress}
                  onChange={(e) => handleCompanyDataChange('legalAddress', e.target.value)}
                  placeholder="Полный юридический адрес компании"
                  rows={2}
                  required
                />
              </div>

              <div className={styles.form_row}>
                <div className={styles.form_group}>
                  <label htmlFor="phone">Телефон *</label>
                  <input
                    type="tel"
                    id="phone"
                    value={companyData.phone}
                    onChange={(e) => handleCompanyDataChange('phone', e.target.value)}
                    placeholder="+7 (999) 000-00-00"
                    required
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="department">Название отдела *</label>
                  <input
                    type="text"
                    id="department"
                    value={companyData.department}
                    onChange={(e) => handleCompanyDataChange('department', e.target.value)}
                    placeholder="Отдел закупок"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={styles.submit_button}
            disabled={isLoading}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className={styles.register_footer}>
          <p>Уже есть аккаунт?</p>
          <Link href="/login" className={styles.login_link}>
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}