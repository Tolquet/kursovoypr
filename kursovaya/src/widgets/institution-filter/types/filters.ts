export interface FilterState {
  search: string;
  selectedTypes: string[];
  selectedCategories: string[];
}

export interface FilterOptions {
  types: FilterOption[];
  categories: FilterOption[];
}

export interface FilterOption {
  id: string;
  label: string;
  count: number;
}

export interface FilterPanelProps {
  data: Array<{
    types: string;
    categoryIns: string[];
  }>;
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
  currentFilters?: FilterState; // Текущие фильтры для умного подсчета
}