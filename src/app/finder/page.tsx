'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import { FilterState } from '@/src/widgets/institution-filter/types/filters';
import { useUniversalFilter } from '@/src/hooks/useUniversalFilter';
import { useInstitutes } from '@/src/hooks/useInstitutes';
import {FilterPanel} from '@/src/widgets/institution-filter/ui/filter';
import CardList from '@/src/widgets/CardInstitutes/cardList';
import { ExportMenu } from '@/src/shared/ui/exportMenu/exportMenu';
import Link from 'next/link';
import styles from './styles/style.module.scss';

// Вспомогательная функция для преобразования типа в читаемый формат
const getTypeLabel = (type: string): string => {
  const typeLabels: Record<string, string> = {
    'college': 'Колледж',
    'institute': 'Институт',
    'school': 'Школа',
    'university': 'Университет',
    'academy': 'Академия'
  };
  return typeLabels[type] || type;
};

export default function FinderPage() {
  const { data: session, status } = useSession();
  const [userType, setUserType] = useState<string>('student');
  
  // Используем useState для отслеживания URL параметров
  const [urlParams, setUrlParams] = useState('');
  
  // Используем useRef для отслеживания инициализации без лишних рендеров
  const isInitializedRef = useRef(false);
  const lastUrlRef = useRef('');

  // Загрузка типа пользователя
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/auth/me')
        .then(res => res.json())
        .then(data => {
          setUserType(data.userType || 'student');
        })
        .catch(() => setUserType('student'));
    }
  }, [status]);

  // Получаем данные из API
  const {
    institutes,
    totalCount,
    isLoading,
    error,
    refresh,
    hasData
  } = useInstitutes();

  // Инициализируем фильтры после получения данных
  const {
    filters,
    setFilters: updateFilters,
    filteredData,
    resetFilters
  } = useUniversalFilter(institutes);

  // Мемоизированный обработчик фильтров
  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    updateFilters(newFilters);
  }, [updateFilters]);

  // Функция для получения фильтров из URL
  const getFiltersFromUrl = useCallback((): Partial<FilterState> => {
    if (typeof window === 'undefined') return {};
    
    const urlParams = new URLSearchParams(window.location.search);
    const currentType = urlParams.get('type');

    return {
      search: urlParams.get('search') || '',
      selectedTypes: currentType ? [currentType] : [],
      selectedCategories: urlParams.get('category') ? [urlParams.get('category')!] : []
    };
  }, []);

  // Устанавливаем URL параметры при изменении фильтров
  useEffect(() => {
    if (!isInitializedRef.current || typeof window === 'undefined') return;

    const params = new URLSearchParams();

    if (filters.search) params.set('search', filters.search);
    if (filters.selectedTypes.length > 0) params.set('type', filters.selectedTypes[0]);
    if (filters.selectedCategories.length > 0) params.set('category', filters.selectedCategories[0]);

    const newUrl = params.toString() ? `/finder?${params.toString()}` : '/finder';
    
    // Обновляем URL только если он изменился
    if (window.location.href !== `${window.location.origin}${newUrl}`) {
      window.history.replaceState({}, '', newUrl);
      lastUrlRef.current = newUrl;
    }
  }, [filters]);

  // Слушаем изменения URL параметров напрямую
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkUrlParams = () => {
      const currentParams = window.location.search;
      if (currentParams !== urlParams) {
        setUrlParams(currentParams);
        
        if (hasData && isInitializedRef.current) {
          const urlFilters = getFiltersFromUrl();
          updateFilters(urlFilters);
          lastUrlRef.current = window.location.href;
        }
      }
    };

    // Проверяем при загрузке
    checkUrlParams();

    // Используем setInterval для проверки изменений
    const urlCheckInterval = setInterval(checkUrlParams, 100);

    return () => {
      clearInterval(urlCheckInterval);
    };
  }, [urlParams, hasData, getFiltersFromUrl, updateFilters]);

  // Инициализация при первом рендере
  useEffect(() => {
    if (hasData && !isInitializedRef.current && typeof window !== 'undefined') {
      const urlFilters = getFiltersFromUrl();
      updateFilters(urlFilters);
      isInitializedRef.current = true;
      lastUrlRef.current = window.location.href;
    }
  }, [hasData, getFiltersFromUrl, updateFilters]);

  // Состояние загрузки
  if (isLoading && !hasData) {
    return (
      <div className={styles.finder_page}>
        <div className={styles.results_content}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: '#7f8c8d' }}>Загружаем учебные заведения...</p>
          </div>
        </div>
      </div>
    );
  }

  // Состояние ошибки
  if (error && !hasData) {
    return (
      <div className={styles.finder_page}>
        <div className={styles.results_content}>
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: '#e74c3c'
          }}>
            <h3>Ошибка загрузки данных</h3>
            <p>{error}</p>
            <button
              onClick={refresh}
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Получаем активный фильтр по типу из URL (только на клиенте)
  const activeTypeFilter = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search).get('type')
    : null;

  return (
    <div className={styles.finder_page}>
      <div className={styles.results_content}>
        <div className={styles.results_header}>
          <h2>
            {activeTypeFilter
              ? `${getTypeLabel(activeTypeFilter)} (${filteredData.length})`
              : `Все учебные заведения (${filteredData.length})`
            }
          </h2>

          {/* Активный фильтр по типу */}
          {activeTypeFilter && (
            <div className={styles.active_type_filter}>
              <small>Фильтр:</small>
              <strong>{getTypeLabel(activeTypeFilter)}</strong>
              <button
                className={styles.remove_filter_btn}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const newUrl = window.location.pathname;
                    window.history.pushState({}, '', newUrl);
                    window.location.reload();
                  }
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Панель фильтрации */}
        <FilterPanel
          data={institutes}
          onFilterChange={handleFilterChange}
          initialFilters={filters}
          currentFilters={filters}
        />

        {/* Кнопка создания для компаний */}
        {userType === 'company' && (
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <Link href="/institutes/create">
              <button
                style={{
                  background: 'linear-gradient(135deg, #48bb78, #38a169)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(72, 187, 120, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(72, 187, 120, 0.3)';
                }}
              >
                <span>➕</span>
                <span>Добавить учебное заведение</span>
              </button>
            </Link>
          </div>
        )}

        {/* Результаты поиска */}
        {filteredData.length > 0 ? (
          <>
            {/* Меню экспорта */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <ExportMenu 
                data={filteredData.map(item => ({
                  name: item.name,
                  description: item.description,
                  types: item.types,
                  location: item.location,
                  rating: item.rating,
                  tuition: item.tuition,
                  categories: item.categoryIns
                }))}
                filename="educational-institutions"
              />
            </div>

            <CardList list={filteredData} />

            {/* Статистика фильтрации */}
            <div className={styles.filter_stats}>
              <small>
                Найдено {filteredData.length} из {totalCount} учебных заведений
                {filters.search && ` по запросу "${filters.search}"`}
                {filters.selectedTypes.length > 0 && ` типа "${getTypeLabel(filters.selectedTypes[0])}"`}
                {filters.selectedCategories.length > 0 && ` категории "${filters.selectedCategories[0]}"`}
                {filters.selectedCity && ` в городе "${filters.selectedCity}"`}
              </small>
            </div>
          </>
        ) : (
          <div className={styles.no_results}>
            <h3>Ничего не найдено</h3>
            <p>Попробуйте изменить параметры поиска или сбросить фильтры</p>
            <button
              className={styles.clear_filters_btn}
              onClick={resetFilters}
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  );
}