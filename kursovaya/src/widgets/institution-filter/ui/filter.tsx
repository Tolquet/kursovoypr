// src/widgets/institution-filter/ui/filter.tsx
import { useState, useMemo, useCallback } from 'react';
import { FilterPanelProps, FilterState } from '@/src/widgets/institution-filter/types/filters';
import "../styles/filter.scss"

// Функция для преобразования типа в читаемый формат
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

export function FilterPanel({ 
  data, 
  onFilterChange,
  initialFilters,
  currentFilters
}: FilterPanelProps) {
  // Состояние фильтров с учетом initialFilters через useMemo
  const initialFilterState = useMemo((): FilterState => ({
    search: initialFilters?.search || '',
    selectedTypes: initialFilters?.selectedTypes || [],
    selectedCategories: initialFilters?.selectedCategories || []
  }), [initialFilters]);

  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isTypesOpen, setIsTypesOpen] = useState(true); // Типы открыты по умолчанию

  // Функция для подсчета количества с учетом текущих фильтров
  const getFilteredCount = useCallback((
    itemType: string,
    filterType: 'type' | 'category',
    currentFilters: FilterState
  ): number => {
    return data.filter(item => {
      // Проверяем соответствие текущему типу/категории
      if (filterType === 'type') {
        if (item.types !== itemType) return false;
      } else {
        if (!item.categoryIns.includes(itemType)) return false;
      }

      // Применяем текущие фильтры поиска
      if (currentFilters.search) {
        const searchLower = currentFilters.search.toLowerCase();
        const matchesSearch = 
          item.types.toLowerCase().includes(searchLower) ||
          item.categoryIns.some(cat => cat.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Применяем текущие фильтры по типам (не включая текущий тип)
      if (currentFilters.selectedTypes.length > 0) {
        if (filterType === 'type') {
          // Если мы считаем для типа, проверяем другие выбранные типы
          const otherSelectedTypes = currentFilters.selectedTypes.filter(t => t !== itemType);
          if (otherSelectedTypes.length > 0 && !otherSelectedTypes.includes(item.types)) {
            return false;
          }
        } else {
          // Если мы считаем для категории, проверяем все выбранные типы
          if (!currentFilters.selectedTypes.includes(item.types)) {
            return false;
          }
        }
      }

      // Применяем текущие фильтры по категориям (не включая текущую категорию)
      if (currentFilters.selectedCategories.length > 0) {
        if (filterType === 'category') {
          // Если мы считаем для категории, проверяем другие выбранные категории
          const otherSelectedCategories = currentFilters.selectedCategories.filter(c => c !== itemType);
          if (otherSelectedCategories.length > 0) {
            const hasMatchingCategory = otherSelectedCategories.some(cat =>
              item.categoryIns.includes(cat)
            );
            if (!hasMatchingCategory) return false;
          }
        } else {
          // Если мы считаем для типа, проверяем все выбранные категории
          const hasMatchingCategory = currentFilters.selectedCategories.some(cat =>
            item.categoryIns.includes(cat)
          );
          if (!hasMatchingCategory) return false;
        }
      }

      return true;
    }).length;
  }, [data]);

  // Автоматически собираем все уникальные типы и категории из данных
  const filterOptions = useMemo(() => {
    // Собираем все уникальные типы
    const allTypes = data.map(item => item.types);
    const uniqueTypes = [...new Set(allTypes)];
    
    // Собираем все уникальные категории
    const allCategories = data.flatMap(item => item.categoryIns);
    const uniqueCategories = [...new Set(allCategories)];
    
    // Используем текущие фильтры для умного подсчета
    const filtersToUse = currentFilters || filters;
    
    // Считаем количество для каждого типа с учетом текущих фильтров
    const typeOptions = uniqueTypes.map(type => ({
      id: type,
      label: getTypeLabel(type),
      count: getFilteredCount(type, 'type', filtersToUse)
    })).sort((a, b) => b.count - a.count); // Сортируем по количеству
    
    // Считаем количество для каждой категории с учетом текущих фильтров
    const categoryOptions = uniqueCategories.map(category => ({
      id: category,
      label: category,
      count: getFilteredCount(category, 'category', filtersToUse)
    })).sort((a, b) => b.count - a.count); // Сортируем по количеству

    return {
      types: typeOptions,
      categories: categoryOptions
    };
  }, [data, currentFilters, filters, getFilteredCount]);

  // Доступные категории (с количеством > 0)
  const availableCategories = useMemo(() => 
    filterOptions.categories.filter(option => option.count > 0),
    [filterOptions.categories]
  );

  // Обработчик изменения фильтров
  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  // Обработчики событий
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ search: e.target.value });
  };

  const handleTypeToggle = (typeId: string) => {
    const newTypes = filters.selectedTypes.includes(typeId)
      ? filters.selectedTypes.filter(t => t !== typeId)
      : [...filters.selectedTypes, typeId];
    
    updateFilters({ selectedTypes: newTypes });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.selectedCategories.includes(categoryId)
      ? filters.selectedCategories.filter(c => c !== categoryId)
      : [...filters.selectedCategories, categoryId];
    
    updateFilters({ selectedCategories: newCategories });
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      search: '',
      selectedTypes: [],
      selectedCategories: []
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const handleSelectAllCategories = () => {
    const allCategoryIds = availableCategories.map(c => c.id);
    const allSelected = allCategoryIds.every(id => 
      filters.selectedCategories.includes(id)
    );
    
    const newCategories = allSelected
      ? filters.selectedCategories.filter(id => !allCategoryIds.includes(id))
      : [...filters.selectedCategories, ...allCategoryIds.filter(id => 
          !filters.selectedCategories.includes(id)
        )];
    
    updateFilters({ selectedCategories: [...new Set(newCategories)] });
  };

  const handleSelectAllTypes = () => {
    const allTypeIds = filterOptions.types.map(t => t.id);
    const allSelected = allTypeIds.every(id => 
      filters.selectedTypes.includes(id)
    );
    
    const newTypes = allSelected
      ? filters.selectedTypes.filter(id => !allTypeIds.includes(id))
      : [...filters.selectedTypes, ...allTypeIds.filter(id => 
          !filters.selectedTypes.includes(id)
        )];
    
    updateFilters({ selectedTypes: [...new Set(newTypes)] });
  };

  const getCategoriesDropdownTitle = () => {
    if (filters.selectedCategories.length === 0) {
      return 'Категории';
    }
    
    const selectedLabels = filterOptions.categories
      .filter(option => filters.selectedCategories.includes(option.id))
      .map(option => option.label);
    
    if (selectedLabels.length <= 2) {
      return `Категории: ${selectedLabels.join(', ')}`;
    }
    
    return `Категории (${selectedLabels.length} выбрано)`;
  };

  const getTypesDropdownTitle = () => {
    if (filters.selectedTypes.length === 0) {
      return 'Типы учебных заведений';
    }
    
    const selectedLabels = filterOptions.types
      .filter(option => filters.selectedTypes.includes(option.id))
      .map(option => option.label);
    
    if (selectedLabels.length <= 2) {
      return `Типы: ${selectedLabels.join(', ')}`;
    }
    
    return `Типы (${selectedLabels.length} выбрано)`;
  };

  
  const areAllCategoriesSelected = availableCategories.length > 0 && 
    availableCategories.every(cat => filters.selectedCategories.includes(cat.id));

  return (
    <div className="filter-panel">
      {/* Поиск */}
      <div className="filter-section">
        <div className="filter-header">
          <h3>Поиск</h3>
        </div>
        <input
          type="text"
          placeholder="Поиск по названию или описанию..."
          value={filters.search}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      {/* Фильтр по типу */}
      <div className='dropdown-filters'>
        <div className="dropdown-filter-section">
          <button
            className="dropdown-header"
            onClick={() => setIsTypesOpen(!isTypesOpen)}
            aria-expanded={isTypesOpen}
          >
            <div className="header-content">
              <h3>{getTypesDropdownTitle()}</h3>
              <span className="dropdown-icon">
                {isTypesOpen ? '▲' : '▼'}
              </span>
            </div>
            {filters.selectedTypes.length > 0 && (
              <span className="selected-badge">
                {filters.selectedTypes.length}
              </span>
            )}
          </button>
          {isTypesOpen && (
            <div className="dropdown-content">
              {/* Кнопка "Выбрать все" для типов */}
              <div className="dropdown-actions">
                <button
                  onClick={handleSelectAllTypes}
                  className="select-all-btn"
                  type="button"
                >
                  {filters.selectedTypes.length === filterOptions.types.length
                    ? 'Снять все'
                    : 'Выбрать все'}
                </button>
              </div>
        
              {/* Список типов */}
              <div className="options-list">
                {filterOptions.types.map(option => (
                  <div key={option.id} className={`filter-option ${option.count === 0 ? 'disabled' : ''}`}>
                    <input
                      type="checkbox"
                      id={`type-${option.id}`}
                      checked={filters.selectedTypes.includes(option.id)}
                      onChange={() => handleTypeToggle(option.id)}
                      disabled={option.count === 0}
                    />
                    <label htmlFor={`type-${option.id}`}>
                      <span className="option-label">{option.label}</span>
                      <span className="option-count">({option.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Фильтр по категориям */}
        <div className="dropdown-filter-section">
          <button
            className="dropdown-header"
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            aria-expanded={isCategoriesOpen}
          >
            <div className="header-content">
              <h3>{getCategoriesDropdownTitle()}</h3>
              <span className="dropdown-icon">
                {isCategoriesOpen ? '▲' : '▼'}
              </span>
            </div>
            {filters.selectedCategories.length > 0 && (
              <span className="selected-badge">
                {filters.selectedCategories.length}
              </span>
            )}
          </button>
          {isCategoriesOpen && (
            <div className="dropdown-content">
              {/* Кнопка "Выбрать все" для категорий */}
              <div className="dropdown-actions">
                <button
                  onClick={handleSelectAllCategories}
                  className="select-all-btn"
                  type="button"
                >
                  {areAllCategoriesSelected
                    ? 'Снять все'
                    : 'Выбрать все'}
                </button>
              </div>
        
              {/* Список категорий */}
              <div className="options-list">
                {filterOptions.categories.map(option => (
                  <div key={option.id} className={`filter-option ${option.count === 0 ? 'disabled' : ''}`}>
                    <input
                      type="checkbox"
                      id={`category-${option.id}`}
                      checked={filters.selectedCategories.includes(option.id)}
                      onChange={() => handleCategoryToggle(option.id)}
                      disabled={option.count === 0}
                    />
                    <label htmlFor={`category-${option.id}`}>
                      <span className="option-label">{option.label}</span>
                      <span className="option-count">({option.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Сброс фильтров */}
      {(filters.search || 
        filters.selectedTypes.length > 0 || 
        filters.selectedCategories.length > 0) && (
        <div className="filter-actions">
          <button 
            onClick={handleReset}
            className="reset-btn"
            type="button"
          >
            Сбросить все фильтры
          </button>
          
          {/* Информация о выбранных фильтрах */}
          <div className="selected-filters-info">
            <small>
              Выбрано: 
              {filters.selectedTypes.length > 0 && ` типов: ${filters.selectedTypes.length}`}
              {filters.selectedCategories.length > 0 && ` категорий: ${filters.selectedCategories.length}`}
              {filters.search && ` поиск: "${filters.search}"`}
            </small>
          </div>
        </div>
      )}
    </div>
  );
}