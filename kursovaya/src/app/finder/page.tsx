'use client';

import { useEffect, useRef } from 'react';
import { FilterState } from '@/src/widgets/institution-filter/types/filters';
import { useUniversalFilter } from '@/src/hooks/useUniversalFilter';
import { useInstitutes } from '@/src/hooks/useInstitutes';
import {FilterPanel} from '@/src/widgets/institution-filter/ui/filter';
import CardList from '@/src/widgets/CardInstitutes/cardList';
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
  // Используем useRef для отслеживания инициализации без лишних рендеров
  const isInitializedRef = useRef(false);

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
    setFilters,
    filteredData,
    resetFilters
  } = useUniversalFilter(institutes);

  // Устанавливаем URL параметры при изменении фильтров
  useEffect(() => {
    if (!isInitializedRef.current || typeof window === 'undefined') return;

    const params = new URLSearchParams();

    if (filters.search) params.set('search', filters.search);
    if (filters.selectedTypes.length > 0) params.set('type', filters.selectedTypes[0]);
    if (filters.selectedCategories.length > 0) params.set('category', filters.selectedCategories[0]);

    const newUrl = params.toString() ? `/finder?${params.toString()}` : '/finder';
    window.history.replaceState({}, '', newUrl);
  }, [filters]);

  // Загружаем фильтры из URL при инициализации
  useEffect(() => {
    if (hasData && !isInitializedRef.current && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);

      const initialFilters: Partial<FilterState> = {
        search: urlParams.get('search') || '',
        selectedTypes: urlParams.get('type') ? [urlParams.get('type')!] : [],
        selectedCategories: urlParams.get('category') ? [urlParams.get('category')!] : []
      };

      setFilters(initialFilters);
      isInitializedRef.current = true;
    }
  }, [hasData, setFilters]);

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

  // Получаем активный фильтр по типу из URL
  const urlParams = new URLSearchParams(window.location.search);
  const activeTypeFilter = urlParams.get('type');

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
                  const newUrl = window.location.pathname;
                  window.history.pushState({}, '', newUrl);
                  window.location.reload();
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Кнопка сброса фильтров */}
          {(filters.search || filters.selectedTypes.length > 0 || filters.selectedCategories.length > 0) && (
            <button
              className={styles.clear_filters_btn}
              onClick={resetFilters}
            >
              Сбросить фильтры
            </button>
          )}
        </div>

        {/* Панель фильтрации */}
        <FilterPanel
          data={institutes}
          onFilterChange={setFilters}
          initialFilters={filters}
        />

        {/* Результаты поиска */}
        {filteredData.length > 0 ? (
          <>
            <CardList list={filteredData} />

            {/* Статистика фильтрации */}
            <div className={styles.filter_stats}>
              <small>
                Найдено {filteredData.length} из {totalCount} учебных заведений
                {filters.search && ` по запросу "${filters.search}"`}
                {filters.selectedTypes.length > 0 && ` типа "${getTypeLabel(filters.selectedTypes[0])}"`}
                {filters.selectedCategories.length > 0 && ` категории "${filters.selectedCategories[0]}"`}
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