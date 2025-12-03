// src/app/finder/page.tsx
'use client';

import {FilterPanel} from "@/src/widgets/institution-filter/ui/filter";
import CardInstitutes from "@/src/widgets/CardInstitutes/cardList";
import styles from "./styles/style.module.scss"
import { useUniversalFilter } from '@/src/hooks/useUniversalFilter';
import { useSearchParams } from 'next/navigation';
import { useMemo, useEffect } from 'react';

const institution = [
  {id: 1, name:'Учебное заведение 1',description: 'Топовый универ всея руси1',image: "/",categoryIns: ['100балов','гуманитарий','пук пук1'],types: 'college'},
  {id: 2, name:'Учебное заведение 2',description: 'Топовый универ всея руси2',image: "/",categoryIns: ['100балов','гуманитарий','пук пук2'],types: 'institute'},
  {id: 3, name:'Учебное заведение 3',description: 'Топовый универ всея руси3',image: "/",categoryIns: ['100балов','гуманитарий','пук пук3'],types: 'school'},
  {id: 4, name:'Учебное заведение 4',description: 'Топовый универ всея руси4',image: "/",categoryIns: ['100балов','гуманитарий','пук пук4'],types: 'college'},
  {id: 5, name:'Учебное заведение 5',description: 'Топовый универ всея руси5',image: "/", categoryIns: ['100балов','гуманитарий','пук пук5'],types: 'college'},
];

export default function FinderPage() {
  const searchParams = useSearchParams();
  
  // Получаем тип из URL параметров
  const typeFromUrl = searchParams.get('type');
  
  // Создаем начальные фильтры на основе URL
  const initialFilters = useMemo(() => {
    if (typeFromUrl) {
      return {
        selectedTypes: [typeFromUrl],
        search: '',
        selectedCategories: []
      };
    }
    return undefined;
  }, [typeFromUrl]);

  const {
    filters,
    setFilters,
    filteredData,
    resetFilters
  } = useUniversalFilter(institution, initialFilters);

  // Преобразуем данные для FilterPanel
  const filterPanelData = useMemo(() => {
    return institution.map(item => ({
      types: item.types,
      categoryIns: item.categoryIns
    }));
  }, []);

  // Эффект для логирования (для отладки)
  useEffect(() => {
    console.log('Текущие фильтры:', filters);
    console.log('Отфильтровано данных:', filteredData.length);
  }, [filters, filteredData]);

  // Функция для полного сброса фильтров (включая URL параметры)
  const handleClearFilters = () => {
    resetFilters();
    // Если есть параметры в URL, очищаем их
    if (typeFromUrl) {
      window.history.replaceState({}, '', '/finder');
    }
  };

  return (      
    <div className={styles.finder_page}>
      <FilterPanel 
        data={filterPanelData}
        onFilterChange={setFilters}
        initialFilters={filters}
  
      />
      
      <div className="results-content">
        <div className="results-header">
          <h2>Найдено результатов: {filteredData.length} из {institution.length}</h2>
          
          {/* Показываем активный фильтр по типу из URL */}
          {typeFromUrl && (
            <div className="active-type-filter">
              <small>
                Автоматически применен фильтр по типу: <strong>{getTypeLabel(typeFromUrl)}</strong>
                <button 
                  onClick={handleClearFilters}
                  className="remove-filter-btn"
                  type="button"
                >
                  × Убрать фильтр
                </button>
              </small>
            </div>
          )}
          
          {/* Кнопка сброса если есть активные фильтры */}
          {(filters.search || filters.selectedTypes.length > 0 || filters.selectedCategories.length > 0) && (
            <button 
              onClick={handleClearFilters}
              className="clear-filters-btn"
              type="button"
            >
              Сбросить все фильтры
            </button>
          )}
        </div>
        
        {/* Сообщение если ничего не найдено */}
        {filteredData.length === 0 ? (
          <div className="no-results">
            <h3>Ничего не найдено</h3>
            <p>Попробуйте изменить параметры фильтрации</p>
            <button 
              onClick={handleClearFilters}
              className="clear-filters-btn"
              type="button"
            >
              Показать все
            </button>
          </div>
        ) : (
          <>
            <CardInstitutes 
              list={filteredData} 
              className={styles.inst_grid} 
            />
            
            {/* Статистика фильтрации */}
            {filteredData.length < institution.length && (
              <div className="filter-stats">
                <small>
                  Отфильтровано из {institution.length} записей. 
                  {filters.selectedTypes.length > 0 && ` Типы: ${filters.selectedTypes.map(t => getTypeLabel(t)).join(', ')}.`}
                  {filters.selectedCategories.length > 0 && ` Категории: ${filters.selectedCategories.length}.`}
                  {filters.search && ` Поиск: "${filters.search}".`}
                </small>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

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