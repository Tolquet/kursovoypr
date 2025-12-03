// src/hooks/useUniversalFilter.ts
import { useMemo, useState, useCallback } from 'react';
import { Institutes } from '@/src/widgets/CardInstitutes/types/cardIst';
import { FilterState } from '@/src/widgets/institution-filter/types/filters';

export function useUniversalFilter(data: Institutes[], initialFilters?: Partial<FilterState>) {
  // Инициализируем состояние с учетом initialFilters
  const [filters, setFilters] = useState<FilterState>(() => ({
    search: initialFilters?.search || '',
    selectedTypes: initialFilters?.selectedTypes || [],
    selectedCategories: initialFilters?.selectedCategories || []
  }));

  // Фильтрация данных
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Фильтр по поиску
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower);
        
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

      return true;
    });
  }, [data, filters]);

  // Сброс фильтров
  const resetFilters = useCallback(() => {
    const resetState: FilterState = {
      search: '',
      selectedTypes: [],
      selectedCategories: []
    };
    setFilters(resetState);
  }, []);

  // Обновление фильтров
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    filters,
    setFilters: updateFilters,
    filteredData,
    resetFilters
  };
}