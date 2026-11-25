'use client';

import styles from './styles/about.module.scss';

export default function AboutPage() {
  return (
    <div className={styles.about_page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.hero_background}>
          <div className={styles.hero_gradient}></div>
        </div>
        <div className={styles.hero_content}>
          <div className={styles.hero_badge}>
            <span className={styles.badge_icon}>🎓</span>
            <span className={styles.badge_text}>Дипломный проект</span>
          </div>
          <h1 className={styles.hero_title}>
            Global Edu Finder
          </h1>
          <p className={styles.hero_subtitle}>
            Платформа для поиска учебных заведений по всему миру
          </p>
        </div>
      </section>

      {/* Developer Section */}
      <section className={styles.developer_section}>
        <div className={styles.container}>
          <div className={styles.developer_card}>
            <div className={styles.developer_header}>
              <div className={styles.developer_avatar}>
                <span className={styles.avatar_text}>А</span>
              </div>
              <div className={styles.developer_info}>
                <h2 className={styles.developer_name}>Анатолий</h2>
                <p className={styles.developer_status}>Студент 4 курса</p>
                <div className={styles.badge_stack}>
                  <span className={styles.developer_badge}>Разработчик</span>
                  <span className={styles.developer_badge}>Дипломник</span>
                </div>
              </div>
            </div>
            
            <div className={styles.developer_content}>
              <p className={styles.developer_description}>
                Привет! Я автор платформы Global Edu Finder. Это мой дипломный проект, 
                созданный для помощи студентам и абитуриентам в поиске подходящих 
                учебных заведений по всему миру.
              </p>
              
              <div className={styles.tech_stack}>
                <h3 className={styles.tech_title}>Технологии проекта:</h3>
                <div className={styles.tech_tags}>
                  <span className={styles.tech_tag}>Next.js 16</span>
                  <span className={styles.tech_tag}>TypeScript</span>
                  <span className={styles.tech_tag}>React 19</span>
                  <span className={styles.tech_tag}>PostgreSQL</span>
                  <span className={styles.tech_tag}>Prisma ORM</span>
                  <span className={styles.tech_tag}>Tailwind CSS</span>
                  <span className={styles.tech_tag}>NextAuth.js</span>
                  <span className={styles.tech_tag}>Cloudinary</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Info Section */}
      <section className={styles.project_section}>
        <div className={styles.container}>
          <div className={styles.section_header}>
            <h2 className={styles.section_title}>О проекте</h2>
            <p className={styles.section_subtitle}>
              Global Edu Finder — это современное веб-приложение, разработанное 
              как выпускная квалификационная работа
            </p>
          </div>

          <div className={styles.features_grid}>
            <div className={styles.feature_card}>
              <div className={styles.feature_icon}>
                <span className={styles.icon_bg}>🔍</span>
              </div>
              <h3 className={styles.feature_title}>Умный поиск</h3>
              <p className={styles.feature_desc}>
                Продвинутая система фильтрации по типу заведения, категориям, 
                стоимости и локациям
              </p>
            </div>

            <div className={styles.feature_card}>
              <div className={styles.feature_icon}>
                <span className={styles.icon_bg}>⭐</span>
              </div>
              <h3 className={styles.feature_title}>Рейтинги и отзывы</h3>
              <p className={styles.feature_desc}>
                Система оценок и комментариев от реальных пользователей 
                для выбора лучшего учебного заведения
              </p>
            </div>

            <div className={styles.feature_card}>
              <div className={styles.feature_icon}>
                <span className={styles.icon_bg}>🎯</span>
              </div>
              <h3 className={styles.feature_title}>Профориентация</h3>
              <p className={styles.feature_desc}>
                Серия тестов для определения профессиональных предпочтений 
                и подходящих направлений обучения
              </p>
            </div>

            <div className={styles.feature_card}>
              <div className={styles.feature_icon}>
                <span className={styles.icon_bg}>🏢</span>
              </div>
              <h3 className={styles.feature_title}>Для учебных заведений</h3>
              <p className={styles.feature_desc}>
                Компании могут добавлять и управлять информацией 
                о своих образовательных программах
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats_section}>
        <div className={styles.container}>
          <div className={styles.stats_grid}>
            <div className={styles.stat_card}>
              <div className={styles.stat_number}>10+</div>
              <div className={styles.stat_label}>Учебных заведений</div>
            </div>
            <div className={styles.stat_card}>
              <div className={styles.stat_number}>5+</div>
              <div className={styles.stat_label}>Типов заведений</div>
            </div>
            <div className={styles.stat_card}>
              <div className={styles.stat_number}>25+</div>
              <div className={styles.stat_label}>Категорий</div>
            </div>
            <div className={styles.stat_card}>
              <div className={styles.stat_number}>4</div>
              <div className={styles.stat_label}>Года обучения</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta_section}>
        <div className={styles.container}>
          <div className={styles.cta_card}>
            <h2 className={styles.cta_title}>Готовы начать поиск?</h2>
            <p className={styles.cta_subtitle}>
              Присоединяйтесь к тысячам студентов, которые уже нашли 
              своё идеальное учебное заведение
            </p>
            <div className={styles.cta_buttons}>
              <a href="/finder" className={styles.cta_button_primary}>
                <span>Начать поиск</span>
                <span className={styles.button_arrow}>→</span>
              </a>
              <a href="/register" className={styles.cta_button_secondary}>
                Создать аккаунт
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
