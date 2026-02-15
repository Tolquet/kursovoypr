// src/app/profile/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './styles/profile.module.scss';

// Типы для профориентационных тестов
interface CareerTest {
  id: string;
  title: string;
  description: string;
  duration: string;
  questions: number;
  completed: boolean;
  progress: number;
  category: 'personality' | 'skills' | 'interests' | 'aptitude';
}

// Примеры профориентационных тестов
const CAREER_TESTS: CareerTest[] = [
  {
    id: 'mbti',
    title: 'Тип личности (MBTI)',
    description: 'Определите свой психологический тип и узнайте, какие профессии вам подойдут',
    duration: '15-20 минут',
    questions: 60,
    completed: false,
    progress: 0,
    category: 'personality'
  },
  {
    id: 'holland',
    title: 'Тест Холланда',
    description: 'Выявите свои профессиональные интересы: исследовательский, артистический, социальный и др.',
    duration: '10-15 минут',
    questions: 40,
    completed: false,
    progress: 0,
    category: 'interests'
  },
  {
    id: 'skills-assessment',
    title: 'Оценка навыков',
    description: 'Пройдите тестирование для определения ваших сильных сторон и областей развития',
    duration: '20-25 минут',
    questions: 75,
    completed: false,
    progress: 0,
    category: 'skills'
  },
  {
    id: 'career-values',
    title: 'Ценностные ориентации',
    description: 'Узнайте, что для вас важно в работе: карьера, творчество, стабильность или независимость',
    duration: '10-15 минут',
    questions: 35,
    completed: false,
    progress: 0,
    category: 'personality'
  },
  {
    id: 'logical-thinking',
    title: 'Логическое мышление',
    description: 'Оцените уровень своего логического мышления и аналитических способностей',
    duration: '15-20 минут',
    questions: 50,
    completed: false,
    progress: 0,
    category: 'aptitude'
  },
  {
    id: 'creative-potential',
    title: 'Творческий потенциал',
    description: 'Определите уровень креативности и способности к нестандартному мышлению',
    duration: '12-18 минут',
    questions: 45,
    completed: false,
    progress: 0,
    category: 'aptitude'
  }
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'results'>('overview');

  // Используем тесты для отображения
  const tests = CAREER_TESTS;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className={styles.profile_page}>
        <div className={styles.loading_container}>
          <div className={styles.spinner}></div>
          <p>Загружаем профиль...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleStartTest = (testId: string) => {
    router.push(`/tests/${testId}`);
  };

  const completedTests = tests.filter(t => t.completed).length;
  const totalTests = tests.length;
  const overallProgress = Math.round((completedTests / totalTests) * 100);

  const categoryLabels = {
    personality: 'Личность',
    skills: 'Навыки',
    interests: 'Интересы',
    aptitude: 'Способности'
  };

  const categoryColors = {
    personality: '#667eea',
    skills: '#48bb78',
    interests: '#ed8936',
    aptitude: '#e53e3e'
  };

  return (
    <div className={styles.profile_page}>
      <div className={styles.profile_container}>
        {/* Шапка профиля */}
        <div className={styles.profile_header}>
          <div className={styles.user_info}>
            <div className={styles.avatar}>
              {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.user_details}>
              <h1>{session.user?.name || 'Пользователь'}</h1>
              <p>{session.user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logout_button}>
            Выйти
          </button>
        </div>

        {/* Навигация по вкладкам */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Обзор
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'tests' ? styles.active : ''}`}
            onClick={() => setActiveTab('tests')}
          >
            Тесты
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'results' ? styles.active : ''}`}
            onClick={() => setActiveTab('results')}
          >
            Результаты
          </button>
        </div>

        {/* Контент вкладок */}
        <div className={styles.tab_content}>
          {activeTab === 'overview' && (
            <div className={styles.overview_tab}>
              <div className={styles.stats_grid}>
                <div className={styles.stat_card}>
                  <div className={styles.stat_icon}>📊</div>
                  <div className={styles.stat_content}>
                    <h3>{completedTests}/{totalTests}</h3>
                    <p>Пройдено тестов</p>
                  </div>
                </div>
                <div className={styles.stat_card}>
                  <div className={styles.stat_icon}>📈</div>
                  <div className={styles.stat_content}>
                    <h3>{overallProgress}%</h3>
                    <p>Общий прогресс</p>
                  </div>
                </div>
                <div className={styles.stat_card}>
                  <div className={styles.stat_icon}>🎯</div>
                  <div className={styles.stat_content}>
                    <h3>6</h3>
                    <p>Доступно тестов</p>
                  </div>
                </div>
              </div>

              <div className={styles.welcome_section}>
                <h2>Добро пожаловать в центр профориентации!</h2>
                <p>
                  Пройдите тесты для определения своих профессиональных предпочтений,
                  навыков и способностей. Результаты помогут вам найти идеальную образовательную программу.
                </p>
                <button
                  className={styles.start_tests_button}
                  onClick={() => setActiveTab('tests')}
                >
                  Начать тестирование
                </button>
              </div>
            </div>
          )}

          {activeTab === 'tests' && (
            <div className={styles.tests_tab}>
              <h2>Профориентационные тесты</h2>
              <div className={styles.tests_grid}>
                {tests.map(test => (
                  <div key={test.id} className={styles.test_card}>
                    <div
                      className={styles.test_header}
                      style={{ background: `linear-gradient(135deg, ${categoryColors[test.category]}, ${categoryColors[test.category]}dd)` }}
                    >
                      <span className={styles.test_category}>{categoryLabels[test.category]}</span>
                      {test.completed && <span className={styles.completed_badge}>✓ Пройден</span>}
                    </div>
                    <div className={styles.test_body}>
                      <h3>{test.title}</h3>
                      <p>{test.description}</p>
                      <div className={styles.test_meta}>
                        <span>⏱ {test.duration}</span>
                        <span>❓ {test.questions} вопросов</span>
                      </div>
                      {test.progress > 0 && (
                        <div className={styles.progress_bar}>
                          <div
                            className={styles.progress_fill}
                            style={{ width: `${test.progress}%` }}
                          ></div>
                        </div>
                      )}
                      <button
                        className={styles.test_button}
                        onClick={() => handleStartTest(test.id)}
                        disabled={test.completed}
                      >
                        {test.completed ? 'Пройден' : test.progress > 0 ? 'Продолжить' : 'Начать тест'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className={styles.results_tab}>
              <h2>Ваши результаты</h2>
              {completedTests === 0 ? (
                <div className={styles.no_results}>
                  <div className={styles.no_results_icon}>📋</div>
                  <p>Вы еще не прошли ни одного теста</p>
                  <button
                    className={styles.go_tests_button}
                    onClick={() => setActiveTab('tests')}
                  >
                    Перейти к тестам
                  </button>
                </div>
              ) : (
                <div className={styles.results_list}>
                  {tests.filter(t => t.completed).map(test => (
                    <div key={test.id} className={styles.result_item}>
                      <div className={styles.result_header}>
                        <h3>{test.title}</h3>
                        <span className={styles.result_date}>Пройден недавно</span>
                      </div>
                      <div className={styles.result_score}>
                        <span className={styles.score_label}>Результат:</span>
                        <span className={styles.score_value}>85%</span>
                      </div>
                      <button className={styles.view_details_button}>
                        Подробности
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}