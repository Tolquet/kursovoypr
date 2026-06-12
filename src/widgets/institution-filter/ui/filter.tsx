// src/widgets/institution-filter/ui/filter.tsx
import { useState, useMemo, useCallback } from 'react';
import { FilterPanelProps, FilterState } from '@/src/widgets/institution-filter/types/filters';
import Icon from '@/src/shared/ui/Icon/Icon';
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

// Функция для форматирования цены
const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('ru-RU').format(value);
};

export function FilterPanel({ 
  data, 
  onFilterChange,
  initialFilters,
  currentFilters
}: FilterPanelProps) {
  // Используем currentFilters из пропсов как основной источник истины
  const filters: FilterState = currentFilters || {
    search: initialFilters?.search || '',
    selectedTypes: initialFilters?.selectedTypes || [],
    selectedCategories: initialFilters?.selectedCategories || [],
    selectedCity: initialFilters?.selectedCity || '',
    tuitionRange: initialFilters?.tuitionRange || { min: 0, max: 1000000 },
    selectedEducationLevels: initialFilters?.selectedEducationLevels || []
  };

  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  // Функция для подсчета количества с учетом текущих фильтров
  const getFilteredCount = useCallback((
    itemType: string,
    filterType: 'type' | 'category',
    currentFilters: FilterState
  ): number => {
    return data.filter(item => {
      if (filterType === 'type') {
        if (item.types !== itemType) return false;
      } else {
        if (!item.categoryIns.includes(itemType)) return false;
      }

      if (currentFilters.search) {
        const searchLower = currentFilters.search.toLowerCase();
        const matchesSearch = 
          item.types.toLowerCase().includes(searchLower) ||
          item.categoryIns.some(cat => cat.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      if (currentFilters.selectedTypes.length > 0) {
        if (filterType === 'type') {
          const otherSelectedTypes = currentFilters.selectedTypes.filter(t => t !== itemType);
          if (otherSelectedTypes.length > 0 && !otherSelectedTypes.includes(item.types)) {
            return false;
          }
        } else {
          if (!currentFilters.selectedTypes.includes(item.types)) {
            return false;
          }
        }
      }

      if (currentFilters.selectedCategories.length > 0) {
        if (filterType === 'category') {
          const otherSelectedCategories = currentFilters.selectedCategories.filter(c => c !== itemType);
          if (otherSelectedCategories.length > 0) {
            const hasMatchingCategory = otherSelectedCategories.some(cat =>
              item.categoryIns.includes(cat)
            );
            if (!hasMatchingCategory) return false;
          }
        } else {
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
    const allTypes = data.map(item => item.types);
    const uniqueTypes = [...new Set(allTypes)];
    
    const allCategories = data.flatMap(item => item.categoryIns);
    const uniqueCategories = [...new Set(allCategories)];
    
    const filtersToUse = currentFilters || filters;
    
    const typeOptions = uniqueTypes.map(type => ({
      id: type,
      label: getTypeLabel(type),
      count: getFilteredCount(type, 'type', filtersToUse)
    })).sort((a, b) => b.count - a.count);
    
    const categoryOptions = uniqueCategories.map(category => ({
      id: category,
      label: category,
      count: getFilteredCount(category, 'category', filtersToUse)
    })).sort((a, b) => b.count - a.count);

    return {
      types: typeOptions,
      categories: categoryOptions
    };
  }, [data, currentFilters, filters, getFilteredCount]);

  // Уникальные города
  const cities = useMemo(() => {
    const allCities = data.map(item => item.city).filter(Boolean) as string[];
    return [...new Set(allCities)].sort();
  }, [data]);

  // Диапазон цен
  const tuitionRange = useMemo(() => {
    const allTuitions = data
      .map(item => item.minTuition)
      .filter((t): t is number => typeof t === 'number');
    
    if (allTuitions.length === 0) return { min: 0, max: 1000000 };
    
    return {
      min: Math.min(...allTuitions),
      max: Math.max(...allTuitions)
    };
  }, [data]);

  // Обработчик изменения фильтров
  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    onFilterChange(updated);
  };

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
      selectedCategories: [],
      selectedCity: '',
      tuitionRange: { min: tuitionRange.min, max: tuitionRange.max },
      selectedEducationLevels: []
    };
    onFilterChange(resetFilters);
  };

  const handleCityChange = (city: string) => {
    updateFilters({ selectedCity: city });
  };

  const handleTuitionRangeChange = (type: 'min' | 'max', value: number) => {
    const currentRange = filters.tuitionRange;
    const newRange = { ...currentRange, [type]: value };
    
    if (type === 'min' && value > currentRange.max) {
      newRange.max = value;
    }
    if (type === 'max' && value < currentRange.min) {
      newRange.min = value;
    }
    
    updateFilters({ tuitionRange: newRange });
  };

  const handleSelectAllTypes = () => {
    const allTypeIds = filterOptions.types.map(t => t.id);
    const allSelected = allTypeIds.every(id => filters.selectedTypes.includes(id));
    
    const newTypes = allSelected
      ? filters.selectedTypes.filter(id => !allTypeIds.includes(id))
      : [...filters.selectedTypes, ...allTypeIds.filter(id => !filters.selectedTypes.includes(id))];
    
    updateFilters({ selectedTypes: [...new Set(newTypes)] });
  };

  const handleSelectAllCategories = () => {
    const allCategoryIds = filterOptions.categories.map(c => c.id);
    const allSelected = allCategoryIds.every(id => filters.selectedCategories.includes(id));
  
    const newCategories = allSelected
      ? filters.selectedCategories.filter(id => !allCategoryIds.includes(id))
      : [...filters.selectedCategories, ...allCategoryIds.filter(id => !filters.selectedCategories.includes(id))];
    
    updateFilters({ selectedCategories: [...new Set(newCategories)] });
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdowns(prev => 
      prev.includes(dropdown) 
        ? prev.filter(d => d !== dropdown)
        : [...prev, dropdown]
    );
  };

  const hasActiveFilters = filters.search || 
    filters.selectedTypes.length > 0 || 
    filters.selectedCategories.length > 0 ||
    filters.selectedCity !== '' ||
    filters.tuitionRange.min !== tuitionRange.min ||
    filters.tuitionRange.max !== tuitionRange.max ||
    filters.selectedEducationLevels.length > 0;
  
  // Получить метки для активных тегов
  const getActiveTags = () => {
    const tags: { type: string; label: string }[] = [];
    
    if (filters.selectedTypes.length > 0) {
      filters.selectedTypes.forEach(type => {
        const option = filterOptions.types.find(t => t.id === type);
        if (option) tags.push({ type: 'type', label: option.label });
      });
    }
    
    if (filters.selectedCategories.length > 0) {
      filters.selectedCategories.slice(0, 3).forEach(cat => {
        tags.push({ type: 'category', label: cat });
      });
      if (filters.selectedCategories.length > 3) {
        tags.push({ type: 'category', label: `+${filters.selectedCategories.length - 3}` });
      }
    }
    
    if (filters.selectedCity) {
      tags.push({ type: 'city', label: filters.selectedCity });
    }
    
    return tags;
  };

  const removeTag = (type: string, value: string) => {
    if (type === 'type') {
      updateFilters({ selectedTypes: filters.selectedTypes.filter(t => t !== value) });
    } else if (type === 'category') {
      updateFilters({ selectedCategories: filters.selectedCategories.filter(c => c !== value) });
    } else if (type === 'city') {
      updateFilters({ selectedCity: '' });
    }
  };

  return (
    <div className="filter-panel">
      {/* Search */}
      <div className="filter-section">
        <div className="search-wrapper">
          <Icon name="search" size={18} className="search-icon-svg" />
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={filters.search}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      {/* Filter buttons row */}
      <div className="filter-row">
        <button
          className={`filter-btn ${filters.selectedTypes.length > 0 ? 'active' : ''} ${openDropdowns.includes('types') ? 'opened' : ''}`}
          onClick={() => toggleDropdown('types')}
        >
          <span className="filter-icon"><Icon name="university" size={18} /></span>
          <span>Типы</span>
          {filters.selectedTypes.length > 0 && (
            <span className="filter-count">{filters.selectedTypes.length}</span>
          )}
        </button>

        <button 
          className={`filter-btn ${filters.selectedCategories.length > 0 ? 'active' : ''} ${openDropdowns.includes('categories') ? 'opened' : ''}`}
          onClick={() => toggleDropdown('categories')}
        >
          <span className="filter-icon"><Icon name="award" size={18} /></span>
          <span>Категории</span>
          {filters.selectedCategories.length > 0 && (
            <span className="filter-count">{filters.selectedCategories.length}</span>
          )}
        </button>

        {cities.length > 0 && (
          <button 
            className={`filter-btn ${filters.selectedCity ? 'active' : ''} ${openDropdowns.includes('city') ? 'opened' : ''}`}
            onClick={() => toggleDropdown('city')}
          >
            <span className="filter-icon"><Icon name="building" size={18} /></span>
            <span>Город</span>
          </button>
        )}
          
        <button 
          className={`filter-btn ${
            filters.tuitionRange.min !== tuitionRange.min || 
            filters.tuitionRange.max !== tuitionRange.max ? 'active' : ''
          } ${openDropdowns.includes('price') ? 'opened' : ''}`}
          onClick={() => toggleDropdown('price')}
        >
          <span className="filter-icon"><Icon name="money" size={18} /></span>
          <span>Цена</span>
        </button>

        <button 
          className={`filter-btn ${filters.selectedEducationLevels.length > 0 ? 'active' : ''} ${openDropdowns.includes('education') ? 'opened' : ''}`}
          onClick={() => toggleDropdown('education')}
        >
          <span className="filter-icon"><Icon name="target" size={18} /></span>
          <span>Уровень</span>
          {filters.selectedEducationLevels.length > 0 && (
            <span className="filter-count">{filters.selectedEducationLevels.length}</span>
          )}
        </button>
      </div>

      {/* Dropdown panels */}
      {openDropdowns.length > 0 && (
        <div className="dropdown-panels" onClick={(e) => e.stopPropagation()}>
          {/* Types panel */}
          {openDropdowns.includes('types') && (
            <div className="dropdown-panel">
              <div className="panel-title">
                <span>Типы заведений</span>
                <span className="select-all-link" onClick={handleSelectAllTypes}>
                  {filters.selectedTypes.length === filterOptions.types.length ? 'Снять все' : 'Выбрать все'}
                </span>
              </div>
              <div className="options-grid">
                {filterOptions.types.map(option => (
                  <label 
                    key={option.id} 
                    className={`filter-chip ${option.count === 0 ? 'disabled' : ''} ${
                      filters.selectedTypes.includes(option.id) ? 'selected' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.selectedTypes.includes(option.id)}
                      onChange={() => handleTypeToggle(option.id)}
                      disabled={option.count === 0}
                    />
                    <span className="chip-label">{option.label}</span>
                    <span className="chip-count">({option.count})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Categories panel */}
          {openDropdowns.includes('categories') && (
            <div className="dropdown-panel">
              <div className="panel-title">
                <span>Категории</span>
                <span className="select-all-link" onClick={handleSelectAllCategories}>
                  {filterOptions.categories.every(c => filters.selectedCategories.includes(c.id)) 
                    ? 'Снять все' : 'Выбрать все'}
                </span>
              </div>
              <div className="options-grid">
                {filterOptions.categories.map(option => (
                  <label 
                    key={option.id} 
                    className={`filter-chip ${option.count === 0 ? 'disabled' : ''} ${
                      filters.selectedCategories.includes(option.id) ? 'selected' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.selectedCategories.includes(option.id)}
                      onChange={() => handleCategoryToggle(option.id)}
                      disabled={option.count === 0}
                    />
                    <span className="chip-label">{option.label}</span>
                    <span className="chip-count">({option.count})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* City panel */}
          {openDropdowns.includes('city') && cities.length > 0 && (
            <div className="dropdown-panel">
              <div className="panel-title">
                <span>Выберите город</span>
              </div>
              <select 
                className="city-select"
                value={filters.selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
              >
                <option value="">Все города</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          )}

          {/* Price panel */}
          {openDropdowns.includes('price') && (
            <div className="dropdown-panel">
              <div className="panel-title">
                <span>Стоимость обучения (₽)</span>
              </div>
              <div className="price-inputs">
                <div className="price-field">
                  <label>От</label>
                  <input
                    type="number"
                    value={filters.tuitionRange.min}
                    onChange={(e) => handleTuitionRangeChange('min', Number(e.target.value))}
                    min={tuitionRange.min}
                    max={tuitionRange.max}
                  />
                  <span>₽</span>
                </div>
                <div className="price-field">
                  <label>До</label>
                  <input
                    type="number"
                    value={filters.tuitionRange.max}
                    onChange={(e) => handleTuitionRangeChange('max', Number(e.target.value))}
                    min={tuitionRange.min}
                    max={tuitionRange.max}
                  />
                  <span>₽</span>
                </div>
              </div>
            </div>
          )}

          {/* Education level panel */}
          {openDropdowns.includes('education') && (
            <div className="dropdown-panel">
              <div className="panel-title">
                <span>Уровень поступления</span>
              </div>
              <div className="options-grid">
                <label 
                  className={`filter-chip ${
                    filters.selectedEducationLevels.includes('9class') ? 'selected' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.selectedEducationLevels.includes('9class')}
                    onChange={() => {
                      const newLevels = filters.selectedEducationLevels.includes('9class')
                        ? filters.selectedEducationLevels.filter(l => l !== '9class')
                        : [...filters.selectedEducationLevels, '9class'];
                      updateFilters({ selectedEducationLevels: newLevels });
                    }}
                  />
                  <span className="chip-label">После 9 классов</span>
                </label>

                <label 
                  className={`filter-chip ${
                    filters.selectedEducationLevels.includes('11class') ? 'selected' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.selectedEducationLevels.includes('11class')}
                    onChange={() => {
                      const newLevels = filters.selectedEducationLevels.includes('11class')
                        ? filters.selectedEducationLevels.filter(l => l !== '11class')
                        : [...filters.selectedEducationLevels, '11class'];
                      updateFilters({ selectedEducationLevels: newLevels });
                    }}
                  />
                  <span className="chip-label">После 11 классов</span>
                </label>

                <label 
                  className={`filter-chip ${
                    filters.selectedEducationLevels.includes('ege') ? 'selected' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.selectedEducationLevels.includes('ege')}
                    onChange={() => {
                      const newLevels = filters.selectedEducationLevels.includes('ege')
                        ? filters.selectedEducationLevels.filter(l => l !== 'ege')
                        : [...filters.selectedEducationLevels, 'ege'];
                      updateFilters({ selectedEducationLevels: newLevels });
                    }}
                  />
                  <span className="chip-label">Требуется ЕГЭ</span>
                </label>

                <label 
                  className={`filter-chip ${
                    filters.selectedEducationLevels.includes('gpa') ? 'selected' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.selectedEducationLevels.includes('gpa')}
                    onChange={() => {
                      const newLevels = filters.selectedEducationLevels.includes('gpa')
                        ? filters.selectedEducationLevels.filter(l => l !== 'gpa')
                        : [...filters.selectedEducationLevels, 'gpa'];
                      updateFilters({ selectedEducationLevels: newLevels });
                    }}
                  />
                  <span className="chip-label">Требуется средний балл</span>
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active filters tags */}
      {hasActiveFilters && (
        <div className="active-filters">
          {getActiveTags().map((tag, index) => (
            <span key={index} className="active-tag">
              {tag.label}
              <button 
                className="tag-remove" 
                onClick={() => removeTag(tag.type, tag.type === 'category' && tag.label.startsWith('+') ? '' : tag.label)}
              >
                <Icon name="close" size={14} />
              </button>
            </span>
          ))}
          <button className="reset-all-btn" onClick={handleReset}>
            <Icon name="close" size={14} /> Сбросить все
          </button>
        </div>
      )}
    </div>
  );
}