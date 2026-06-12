// src/app/profile/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Icon from '@/src/shared/ui/Icon/Icon';
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

// Типы для учебных заведений
interface Institute {
  id: number;
  name: string;
  description: string;
  image?: string;
  banner?: string;
  website?: string;
  types: string;
  location: string;
  city?: string;
  rating: number;
  tuition: string;
  minTuition?: number;
  maxTuition?: number;
  categoryIns: string[];
  createdAt: string;
  updatedAt: string;
}

// Типы для данных компании
interface CompanyData {
  companyName: string;
  inn: string;
  contactPerson: string;
  position: string;
  phone: string;
  department: string;
  legalAddress: string;
}

// Типы для данных образования пользователя
interface EducationData {
  educationLevel: string;
  egeScore: number | null;
  gpa: number | null;
  currentClass: number | null;
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
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewedUserId = searchParams.get('userId');
  
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'results' | 'institutes' | 'education'>('overview');
  const [userType, setUserType] = useState<string>('student');
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [userInstitutes, setUserInstitutes] = useState<Institute[]>([]);
  const [loadingInstitutes, setLoadingInstitutes] = useState(false);
  const [viewedUserProfile, setViewedUserProfile] = useState<{id: number, name: string, email: string, userType: string} | null>(null);
  const [educationData, setEducationData] = useState<EducationData>({
    educationLevel: '',
    egeScore: null,
    gpa: null,
    currentClass: null
  });
  const [savingEducation, setSavingEducation] = useState(false);

  // Используем тесты для отображения
  const tests = CAREER_TESTS;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Загрузка данных пользователя и компаний
  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/auth/me`)
      if (response.ok) {
        const data = await response.json()
        setUserType(data.userType || 'student')
        
        if (data.userType === 'company' && data.company) {
          setCompanyData(data.company)
          setActiveTab('institutes')
          fetchUserInstitutes()
        }
        
        // Загрузка данных образования
        if (data.educationLevel || data.egeScore || data.gpa || data.currentClass) {
          setEducationData({
            educationLevel: data.educationLevel || '',
            egeScore: data.egeScore,
            gpa: data.gpa,
            currentClass: data.currentClass
          })
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных пользователя:', error)
    }
  }

  // Загрузка профиля другого пользователя
  useEffect(() => {
    if (viewedUserId) {
      const fetchViewedUser = async () => {
        try {
          const response = await fetch(`/api/users/${viewedUserId}`);
          if (response.ok) {
            const data = await response.json();
            setViewedUserProfile(data.user);
            if (data.user.userType === 'company') {
              fetchUserInstitutes(viewedUserId);
            }
          }
        } catch (error) {
          console.error('Error fetching viewed user:', error);
        }
      };
      fetchViewedUser();
    }
  }, [viewedUserId]);

  useEffect(() => {
    if (session?.user && !viewedUserId) {
      fetchUserData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, viewedUserId])

  const fetchUserInstitutes = async (targetUserId?: string) => {
    setLoadingInstitutes(true);
    try {
      const url = targetUserId 
        ? `/api/users/${targetUserId}/institutes`
        : '/api/institutes/my';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setUserInstitutes(data.institutes || []);
      }
    } catch (error) {
      console.error('Ошибка при загрузке учебных заведений:', error);
    } finally {
      setLoadingInstitutes(false);
    }
  };

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

  const userTypeLabels = {
    student: 'Студент',
    applicant: 'Абитуриент',
    school: 'Школьник',
    company: 'Компания'
  };

  const isViewingOtherProfile = !!viewedUserId && !!viewedUserProfile;

  const getInstituteTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      university: 'Университет',
      college: 'Колледж',
      institute: 'Институт',
      school: 'Школа',
      academy: 'Академия'
    };
    return types[type] || type;
  };

  const handleDeleteInstitute = async (instituteId: number) => {
    if (!confirm('Вы уверены, что хотите удалить это учебное заведение?')) return;

    try {
      const response = await fetch(`/api/institutes/${instituteId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при удалении');
      }

      setUserInstitutes(userInstitutes.filter(i => i.id !== instituteId));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка при удалении');
    }
  };

  // Сохранение данных образования
  const handleSaveEducation = async () => {
    setSavingEducation(true);
    try {
      const response = await fetch('/api/users/me/education', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(educationData)
      });

      if (!response.ok) {
        throw new Error('Ошибка при сохранении');
      }

      alert('Данные образования успешно сохранены!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка при сохранении');
    } finally {
      setSavingEducation(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return '#48bb78';
    if (rating >= 4.0) return '#38a169';
    if (rating >= 3.5) return '#ed8936';
    return '#e53e3e';
  };

  return (
    <div className={styles.profile_page}>
      <div className={styles.profile_container}>
        {/* Шапка профиля */}
        <div className={styles.profile_header}>
          <div className={styles.user_info}>
            {isViewingOtherProfile ? (
              <button
                className={styles.back_button}
                onClick={() => router.push('/profile')}
              >
                ← Назад
              </button>
            ) : null}
            <div className={styles.avatar}>
              {(isViewingOtherProfile ? viewedUserProfile?.name : session.user?.name)?.charAt(0).toUpperCase() || 
               (isViewingOtherProfile ? viewedUserProfile?.email : session.user?.email)?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.user_details}>
              <h1>
                {isViewingOtherProfile 
                  ? viewedUserProfile?.name || viewedUserProfile?.email?.split('@')[0]
                  : userType === 'company' && companyData 
                    ? companyData.companyName 
                    : session.user?.name || 'Пользователь'}
              </h1>
              <div className={styles.user_meta}>
                <p>{isViewingOtherProfile ? viewedUserProfile?.email : session.user?.email}</p>
                <span className={styles.user_type_badge}>
                  {userTypeLabels[(isViewingOtherProfile ? viewedUserProfile?.userType : userType) as keyof typeof userTypeLabels] || 
                   (isViewingOtherProfile ? viewedUserProfile?.userType : userType)}
                </span>
              </div>
              {userType === 'company' && companyData && (
                <div className={styles.company_info}>
                  <span className={styles.company_inn}>ИНН: {companyData.inn}</span>
                  <span className={styles.company_contact}>{companyData.contactPerson} — {companyData.position}</span>
                </div>
              )}
            </div>
          </div>
          {!isViewingOtherProfile && (
            <button onClick={handleLogout} className={styles.logout_button}>
              Выйти
            </button>
          )}
        </div>

        {/* Навигация по вкладкам */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Обзор
          </button>
          {userType !== 'company' && (
            <>
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
              <button
                className={`${styles.tab} ${activeTab === 'education' ? styles.active : ''}`}
                onClick={() => setActiveTab('education')}
              >
                Уровень образования
              </button>
            </>
          )}
          {userType === 'company' && (
            <button
              className={`${styles.tab} ${activeTab === 'institutes' ? styles.active : ''}`}
              onClick={() => setActiveTab('institutes')}
            >
              Мои учебные заведения
            </button>
          )}
        </div>

        {/* Контент вкладок */}
        <div className={styles.tab_content}>
          {activeTab === 'overview' && (
            <div className={styles.overview_tab}>
              <div className={styles.stats_grid}>
                {userType === 'company' ? (
                  <>
                    <div className={styles.stat_card}>
                      <div className={styles.stat_icon}>
                        <Icon name="building" size={32} />
                      </div>
                      <div className={styles.stat_content}>
                        <h3>{userInstitutes.length}</h3>
                        <p>Мои учебные заведения</p>
                      </div>
                    </div>
                    <div className={styles.stat_card}>
                      <div className={styles.stat_icon}>
                        <Icon name="map-pin" size={32} />
                      </div>
                      <div className={styles.stat_content}>
                        <h3>{new Set(userInstitutes.map(i => i.location)).size}</h3>
                        <p>Города присутствия</p>
                      </div>
                    </div>
                    <div className={styles.stat_card}>
                      <div className={styles.stat_icon}>
                        <Icon name="star-filled" size={32} />
                      </div>
                      <div className={styles.stat_content}>
                        <h3>
                          {(userInstitutes.reduce((sum, i) => sum + i.rating, 0) / (userInstitutes.length || 1)).toFixed(1)}
                        </h3>
                        <p>Средний рейтинг</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.stat_card}>
                      <div className={styles.stat_icon}>
                        <Icon name="trending-up" size={32} />
                      </div>
                      <div className={styles.stat_content}>
                        <h3>{completedTests}/{totalTests}</h3>
                        <p>Пройдено тестов</p>
                      </div>
                    </div>
                    <div className={styles.stat_card}>
                      <div className={styles.stat_icon}>
                        <Icon name="award" size={32} />
                      </div>
                      <div className={styles.stat_content}>
                        <h3>{overallProgress}%</h3>
                        <p>Общий прогресс</p>
                      </div>
                    </div>
                    <div className={styles.stat_card}>
                      <div className={styles.stat_icon}>
                        <Icon name="target" size={32} />
                      </div>
                      <div className={styles.stat_content}>
                        <h3>6</h3>
                        <p>Доступно тестов</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {userType === 'company' ? (
                <div className={styles.welcome_section}>
                  <h2>Добро пожаловать, {companyData?.companyName || 'Компания'}!</h2>
                  <p>
                    Здесь вы можете управлять своими учебными заведениями. 
                    Добавьте информацию о программах обучения, стоимости и требованиях к поступлению.
                  </p>
                  <button
                    className={styles.start_tests_button}
                    onClick={() => router.push('/institutes/create')}
                  >
                    Добавить учебное заведение
                  </button>
                </div>
              ) : (
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
              )}
            </div>
          )}

          {activeTab === 'tests' && userType !== 'company' && (
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

          {activeTab === 'results' && userType !== 'company' && (
            <div className={styles.results_tab}>
              <h2>Ваши результаты</h2>
              {completedTests === 0 ? (
                <div className={styles.no_results}>
                  <div className={styles.no_results_icon}>
                    <Icon name="clipboard" size={48} />
                  </div>
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

          {activeTab === 'education' && userType !== 'company' && (
            <div className={styles.education_tab}>
              <h2>Ваш уровень образования</h2>
              <p className={styles.education_description}>
                Укажите ваш текущий уровень образования, чтобы получать персонализированные рекомендации
                и находить учебные заведения, которые подходят для поступления.
              </p>

              <div className={styles.education_form}>
                {/* Тип образования */}
                <div className={styles.form_section}>
                  <h3>Текущий уровень образования</h3>
                  <div className={styles.education_options}>
                    <label className={`${styles.education_option} ${educationData.educationLevel === 'school-9' ? styles.selected : ''}`}>
                      <input
                        type="radio"
                        name="educationLevel"
                        value="school-9"
                        checked={educationData.educationLevel === 'school-9'}
                        onChange={(e) => setEducationData(prev => ({ ...prev, educationLevel: e.target.value, currentClass: null }))}
                      />
                      <div className={styles.option_content}>
                        <Icon name="target" size={24} />
                        <div>
                          <strong>9 классов</strong>
                          <p>Окончил 9 классов школы</p>
                        </div>
                      </div>
                    </label>

                    <label className={`${styles.education_option} ${educationData.educationLevel === 'school-11' ? styles.selected : ''}`}>
                      <input
                        type="radio"
                        name="educationLevel"
                        value="school-11"
                        checked={educationData.educationLevel === 'school-11'}
                        onChange={(e) => setEducationData(prev => ({ ...prev, educationLevel: e.target.value }))}
                      />
                      <div className={styles.option_content}>
                        <Icon name="award" size={24} />
                        <div>
                          <strong>11 классов</strong>
                          <p>Окончил 11 классов, есть аттестат о полном среднем образовании</p>
                        </div>
                      </div>
                    </label>

                    <label className={`${styles.education_option} ${educationData.educationLevel === 'college' ? styles.selected : ''}`}>
                      <input
                        type="radio"
                        name="educationLevel"
                        value="college"
                        checked={educationData.educationLevel === 'college'}
                        onChange={(e) => setEducationData(prev => ({ ...prev, educationLevel: e.target.value }))}
                      />
                      <div className={styles.option_content}>
                        <Icon name="building" size={24} />
                        <div>
                          <strong>Колледж/Техникум</strong>
                          <p>Учусь или закончил колледж/техникум</p>
                        </div>
                      </div>
                    </label>

                    <label className={`${styles.education_option} ${educationData.educationLevel === 'university-bachelor' ? styles.selected : ''}`}>
                      <input
                        type="radio"
                        name="educationLevel"
                        value="university-bachelor"
                        checked={educationData.educationLevel === 'university-bachelor'}
                        onChange={(e) => setEducationData(prev => ({ ...prev, educationLevel: e.target.value }))}
                      />
                      <div className={styles.option_content}>
                        <Icon name="university" size={24} />
                        <div>
                          <strong>Бакалавриат</strong>
                          <p>Учусь или закончил бакалавриат</p>
                        </div>
                      </div>
                    </label>

                    <label className={`${styles.education_option} ${educationData.educationLevel === 'university-master' ? styles.selected : ''}`}>
                      <input
                        type="radio"
                        name="educationLevel"
                        value="university-master"
                        checked={educationData.educationLevel === 'university-master'}
                        onChange={(e) => setEducationData(prev => ({ ...prev, educationLevel: e.target.value }))}
                      />
                      <div className={styles.option_content}>
                        <Icon name="university" size={24} />
                        <div>
                          <strong>Магистратура</strong>
                          <p>Учусь или закончил магистратуру</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Балл ЕГЭ */}
                {(educationData.educationLevel === 'school-11' || educationData.educationLevel === 'college') && (
                  <div className={styles.form_section}>
                    <h3>Балл ЕГЭ</h3>
                    <p className={styles.form_hint}>Укажите ваш общий балл ЕГЭ или баллы по отдельным предметам</p>
                    <div className={styles.score_input}>
                      <label>Общий балл ЕГЭ (макс. 300)</label>
                      <input
                        type="number"
                        min="0"
                        max="300"
                        value={educationData.egeScore || ''}
                        onChange={(e) => setEducationData(prev => ({ ...prev, egeScore: parseInt(e.target.value) || null }))}
                        placeholder="Например: 240"
                      />
                    </div>
                  </div>
                )}

                {/* Средний балл */}
                {(educationData.educationLevel === 'college' || educationData.educationLevel === 'university-bachelor' || educationData.educationLevel === 'university-master') && (
                  <div className={styles.form_section}>
                    <h3>Средний балл диплома</h3>
                    <p className={styles.form_hint}>Укажите ваш средний балл по диплому (шкала 2.0-5.0)</p>
                    <div className={styles.score_input}>
                      <label>Средний балл (2.0-5.0)</label>
                      <input
                        type="number"
                        min="2.0"
                        max="5.0"
                        step="0.1"
                        value={educationData.gpa || ''}
                        onChange={(e) => setEducationData(prev => ({ ...prev, gpa: parseFloat(e.target.value) || null }))}
                        placeholder="Например: 4.5"
                      />
                    </div>
                  </div>
                )}

                {/* Текущий класс (для школьников) */}
                {educationData.educationLevel === '' && (
                  <div className={styles.form_section}>
                    <h3>Текущий класс</h3>
                    <p className={styles.form_hint}>В каком классе вы сейчас учитесь?</p>
                    <div className={styles.class_selector}>
                      <select
                        value={educationData.currentClass || ''}
                        onChange={(e) => setEducationData(prev => ({ ...prev, currentClass: parseInt(e.target.value) || null }))}
                      >
                        <option value="">Выберите класс</option>
                        {[9, 10, 11].map(cls => (
                          <option key={cls} value={cls}>{cls} класс</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <button
                  className={styles.save_education_button}
                  onClick={handleSaveEducation}
                  disabled={savingEducation}
                >
                  {savingEducation ? 'Сохранение...' : 'Сохранить данные'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'institutes' && userType === 'company' && (
            <div className={styles.institutes_tab}>
              <h2>Мои учебные заведения</h2>
              
              {loadingInstitutes ? (
                <div className={styles.loading_container}>
                  <div className={styles.spinner}></div>
                  <p>Загружаем учебные заведения...</p>
                </div>
              ) : userInstitutes.length === 0 ? (
                <div className={styles.no_results}>
                  <div className={styles.no_results_icon}>
                    <Icon name="building" size={48} />
                  </div>
                  <p>Вы еще не добавили ни одного учебного заведения</p>
                  <button
                    className={styles.go_tests_button}
                    onClick={() => router.push('/institutes/create')}
                  >
                    Добавить учебное заведение
                  </button>
                </div>
              ) : (
                <div className={styles.institutes_grid}>
                  {userInstitutes.map(institute => (
                    <div key={institute.id} className={styles.institute_card}>
                      <div className={styles.institute_header}>
                        <span className={styles.institute_type}>
                          {getInstituteTypeLabel(institute.types)}
                        </span>
                        <span 
                          className={styles.institute_rating}
                          style={{ color: getRatingColor(institute.rating) }}
                        >
                          <Icon name="star-filled" size={16} /> {institute.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className={styles.institute_body}>
                        <h3>{institute.name}</h3>
                        <p>{institute.description}</p>
                        <div className={styles.institute_meta}>
                          <span>
                            <Icon name="map-pin" size={14} /> {institute.location}
                          </span>
                          <span>
                            <Icon name="money" size={14} /> {institute.tuition}
                          </span>
                        </div>
                        <div className={styles.institute_categories}>
                          {institute.categoryIns.slice(0, 3).map((cat, idx) => (
                            <span key={idx} className={styles.category_tag}>
                              {cat}
                            </span>
                          ))}
                        </div>
                        <div className={styles.institute_actions}>
                          {!isViewingOtherProfile && (
                            <>
                              <button 
                                className={styles.edit_button}
                                onClick={() => router.push(`/institutes/edit/${institute.id}`)}
                              >
                                <Icon name="edit" size={16} /> Редактировать
                              </button>
                              <button 
                                className={styles.delete_button}
                                onClick={() => handleDeleteInstitute(institute.id)}
                              >
                                <Icon name="trash" size={16} /> Удалить
                              </button>
                            </>
                          )}
                        </div>
                      </div>
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