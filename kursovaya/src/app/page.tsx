'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import styles from "./styles/home.module.scss";

interface Institute {
  id: number;
  name: string;
  description: string;
  image?: string;
  location: string;
  city?: string;
  rating: number;
  tuition: string;
  minTuition?: number;
  maxTuition?: number;
  types: string;
  categoryIns: string[];
}

export default function Home() {
  const [topInstitutes, setTopInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopInstitutes = async () => {
      try {
        const response = await fetch('/api/institutes');
        if (response.ok) {
          const data = await response.json();
          // Проверяем структуру ответа - может быть объект с institutes или прямой массив
          const institutesArray = Array.isArray(data) ? data : (data.institutes || data.data || []);
          // Сортируем по рейтингу и берем топ-3
          const sorted = [...institutesArray].sort((a: Institute, b: Institute) => b.rating - a.rating).slice(0, 3);
          setTopInstitutes(sorted);
        }
      } catch (error) {
        console.error('Error fetching institutes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopInstitutes();
  }, []);

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'university': '🎓',
      'college': '🏫',
      'institute': '🏛️',
      'school': '🏫',
      'academy': '🎨'
    };
    return icons[type.toLowerCase()] || '🎓';
  };
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div 
            className={styles.heroImage}
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80")' }}
          ></div>
        </div>
        
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>
            Найди своё будущее во всём мире
          </h2>
          <p className={styles.heroSubtitle}>
            Откройте для себя лучшие университеты, колледжи и школы по всему миру. Изучите программы, стипендии и требования к поступлению.
          </p>
          
          {/* Search Component */}
          <form action="/finder" className={styles.searchForm}>
            <div className={styles.searchInputWrapper}>
              <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                name="search"
                className={styles.searchInput}
                placeholder="Университет, город или направление..." 
                type="text"
              />
            </div>
            <button type="submit" className={styles.searchButton}>
              <span>Найти</span>
              <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </form>
          
          <div className={styles.heroFeatures}>
            <span className={styles.feature}>
              <svg className={styles.checkIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Верифицированные университеты
            </span>
            <span className={styles.feature}>
              <svg className={styles.checkIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              10,000+ программ обучения
            </span>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className={styles.destinations}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>
                Популярные направления
              </h3>
              <p className={styles.sectionSubtitle}>Исследуйте самые востребованные места для обучения.</p>
            </div>
            <Link href="/finder" className={styles.viewAllLink}>
              Смотреть все <span style={{ marginLeft: '4px' }}>→</span>
            </Link>
          </div>
          
          <div className={styles.destinationsGrid}>
            {/* Card 1 - Москва */}
            <div className={styles.destinationCard}>
              <div 
                className={styles.cardImage}
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1513326738677-b964603b136d?w=600&q=80")' }}
              ></div>
              <div className={styles.cardOverlay}></div>
              <div className={styles.cardContent}>
                <p className={styles.cardCountry}>Россия</p>
                <h4 className={styles.cardCity}>Москва</h4>
                <div className={styles.cardMeta}>
                  <svg className={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                  25 Топ университетов
                </div>
              </div>
            </div>
            
            {/* Card 2 - Санкт-Петербург */}
            <div className={styles.destinationCard}>
              <div 
                className={styles.cardImage}
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=600&q=80")' }}
              ></div>
              <div className={styles.cardOverlay}></div>
              <div className={styles.cardContent}>
                <p className={styles.cardCountry}>Россия</p>
                <h4 className={styles.cardCity}>Санкт-Петербург</h4>
                <div className={styles.cardMeta}>
                  <svg className={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                  18 Топ университетов
                </div>
              </div>
            </div>
            
            {/* Card 3 - Казань */}
            <div className={styles.destinationCard}>
              <div 
                className={styles.cardImage}
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1585494156145-1c60a4fe952b?w=600&q=80")' }}
              ></div>
              <div className={styles.cardOverlay}></div>
              <div className={styles.cardContent}>
                <p className={styles.cardCountry}>Россия</p>
                <h4 className={styles.cardCity}>Казань</h4>
                <div className={styles.cardMeta}>
                  <svg className={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                  10 Топ университетов
                </div>
              </div>
            </div>
            
            {/* Card 4 - Новосибирск */}
            <div className={styles.destinationCard}>
              <div 
                className={styles.cardImage}
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1595791802529-0d856dd2a72c?w=600&q=80")' }}
              ></div>
              <div className={styles.cardOverlay}></div>
              <div className={styles.cardContent}>
                <p className={styles.cardCountry}>Россия</p>
                <h4 className={styles.cardCity}>Новосибирск</h4>
                <div className={styles.cardMeta}>
                  <svg className={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                  12 Топ университетов
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Universities */}
      <section className={styles.featured}>
        <div className={styles.featuredContainer}>
          <div className={styles.featuredHeader}>
            <h3 className={styles.featuredTitle}>
              Рекомендуемые учебные заведения
            </h3>
            <p className={styles.featuredSubtitle}>
              Тщательно отобранные ведущие институты, известные академическим превосходством и глобальными возможностями.
            </p>
          </div>
          
          <div className={styles.universitiesGrid}>
            {loading ? (
              // Loading skeleton
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className={styles.universityCard} style={{ animation: 'pulse 2s infinite' }}>
                    <div 
                      className={styles.cardImage}
                      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=600&q=80")', background: '#e5e7eb' }}
                    ></div>
                    <div className={styles.cardBody}>
                      <div style={{ height: '20px', background: '#e5e7eb', borderRadius: '4px', marginBottom: '8px' }}></div>
                      <div style={{ height: '16px', background: '#e5e7eb', borderRadius: '4px', width: '70%' }}></div>
                    </div>
                  </div>
                ))}
              </>
            ) : topInstitutes.length > 0 ? (
              topInstitutes.map((institute, index) => (
                <div 
                  key={institute.id} 
                  className={styles.universityCard}
                  style={{ animation: `slideUp 0.6s ease-out ${index * 0.2}s both` }}
                >
                  <div 
                    className={styles.cardImage}
                    style={{ 
                      backgroundImage: institute.image ? `url("${institute.image}")` : 'url("https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=600&q=80")' 
                    }}
                  >
                    <span className={styles.rating}>
                      <svg className={styles.starIcon} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {institute.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardInfo}>
                        <h4 className={styles.cardName}>{institute.name}</h4>
                        <p className={styles.cardLocation}>
                          <svg className={styles.locationIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {institute.city || institute.location}, Россия
                        </p>
                      </div>
                      <div className={styles.cardIcon}>
                        <span style={{ fontSize: '18px' }}>{getTypeIcon(institute.types)}</span>
                      </div>
                    </div>
                    <div className={styles.cardTags}>
                      {institute.categoryIns.slice(0, 3).map((category, idx) => (
                        <span key={idx} className={styles.tag}>
                          {category}
                        </span>
                      ))}
                    </div>
                    <div className={styles.cardFooter}>
                      <span className={styles.price}>
                        {institute.tuition} 
                        <span className={styles.priceNote}> / год</span>
                      </span>
                      <Link href="/finder" className={styles.detailsLink}>Подробнее →</Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Учебные заведения не найдены
              </p>
            )}
          </div>
          
          <div className={styles.viewAllButton}>
            <Link href="/finder" className={styles.button}>
              Смотреть все учебные заведения
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={styles.whyUs}>
        <div className={styles.container}>
          <div className={styles.whyUsGrid}>
            <div className={styles.whyUsContent}>
              <span className={styles.sectionLabel}>Наши преимущества</span>
              <h3 className={styles.whyUsTitle}>
                Мы помогаем найти идеальное образование
              </h3>
              <p className={styles.whyUsDesc}>
                Мы не просто перечисляем учебные заведения — мы предоставляем комплексную экосистему, чтобы вы нашли идеальное соответствие для своего будущего.
              </p>
              
              <div className={styles.featuresList}>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className={styles.featureText}>
                    <h4 className={styles.featureTitle}>Глобальный охват</h4>
                    <p className={styles.featureDesc}>Доступ к данным более 1000 верифицированных учебных заведений.</p>
                  </div>
                </div>
                
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className={styles.featureText}>
                    <h4 className={styles.featureTitle}>Стипендии и гранты</h4>
                    <p className={styles.featureDesc}>Персонализированные инструменты для поиска финансирования.</p>
                  </div>
                </div>
                
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className={styles.featureText}>
                    <h4 className={styles.featureTitle}>Проверенные отзывы</h4>
                    <p className={styles.featureDesc}>Честные отзывы от реальных студентов и выпускников.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.whyUsImage}>
              <div className={styles.imageWrapper}>
                <div 
                  className={styles.image}
                  style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80")' }}
                ></div>
              </div>
              <div className={styles.decoration1}></div>
              <div className={styles.decoration2}></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaPattern}></div>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>
                Готовы начать свой путь к образованию?
              </h2>
              <p className={styles.ctaSubtitle}>
                Присоединяйтесь к тысячам студентов, которые нашли свою мечту с Global Edu Finder.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/register" className={styles.ctaButtonPrimary}>
                  Зарегистрироваться
                </Link>
                <Link href="/finder" className={styles.ctaButtonSecondary}>
                  Найти программу
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
