// src/hooks/useUniversalFilter.ts
import { useMemo, useState, useCallback } from 'react';
import { Institutes } from '@/src/widgets/CardInstitutes/types/cardIst';
import { FilterState } from '@/src/widgets/institution-filter/types/filters';

export function useUniversalFilter(data: Institutes[], initialFilters?: Partial<FilterState>) {
  // Вычисляем диапазон цен по умолчанию
  const defaultTuitionRange = useMemo(() => {
    const tuitions = data
      .map(item => item.minTuition)
      .filter((t): t is number => typeof t === 'number' && t > 0);
    
    if (tuitions.length === 0) {
      return { min: 0, max: 1000000 };
    }
    
    return {
      min: Math.min(...tuitions),
      max: Math.max(...tuitions)
    };
  }, [data]);

  // Инициализируем состояние с учетом initialFilters
  const [filters, setFilters] = useState<FilterState>(() => ({
    search: initialFilters?.search || '',
    selectedTypes: initialFilters?.selectedTypes || [],
    selectedCategories: initialFilters?.selectedCategories || [],
    selectedCity: initialFilters?.selectedCity || '',
    tuitionRange: initialFilters?.tuitionRange || defaultTuitionRange
  }));

  // Фильтрация данных
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Фильтр по поиску (расширенный)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.location.toLowerCase().includes(searchLower) ||
          (item.city && item.city.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Фильтр по типам (если выбраны типы)
      if (filters.selectedTypes.length > 0) {
        if (!filters.selectedTypes.includes(item.types)) {
          return false;
        }
      }

      // Фильтр по категориям (если выбраны категории)
      if (filters.selectedCategories.length > 0) {
        const hasMatchingCategory = filters.selectedCategories.some(category =>
          item.categoryIns.includes(category)
        );
        if (!hasMatchingCategory) return false;
      }

      // Фильтр по городу
      if (filters.selectedCity) {
        if (item.city !== filters.selectedCity) {
          return false;
        }
      }

      // Фильтр по стоимости
      if (item.minTuition !== undefined && item.minTuition !== null) {
        if (item.minTuition < filters.tuitionRange.min || item.minTuition > filters.tuitionRange.max) {
          return false;
        }
      }

      return true;
    });
  }, [data, filters]);

  // Сброс фильтров
  const resetFilters = useCallback(() => {
    const resetState: FilterState = {
      search: '',
      selectedTypes: [],
      selectedCategories: [],
      selectedCity: '',
      tuitionRange: defaultTuitionRange
    };
    setFilters(resetState);
  }, [defaultTuitionRange]);

  // Обновление фильтров
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Получение уникальных значений для фильтров
  const availableFilters = useMemo(() => {
    const types = [...new Set(data.map(item => item.types))];
    const categories = [...new Set(data.flatMap(item => item.categoryIns))];
    const locations = [...new Set(data.map(item => item.location))];
    const cities = [...new Set(data.map(item => item.city).filter(Boolean))] as string[];

    return {
      types,
      categories,
      locations,
      cities
    };
  }, [data]);

  return {
    filters,
    setFilters: updateFilters,
    filteredData,
    resetFilters,
    availableFilters
  };
}