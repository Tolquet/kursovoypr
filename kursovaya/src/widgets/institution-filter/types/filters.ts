export interface FilterState {
  search: string;
  selectedTypes: string[];
  selectedCategories: string[];
  selectedCity: string;
  tuitionRange: {
    min: number;
    max: number;
  };
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
    city?: string;
    minTuition?: number;
    maxTuition?: number;
  }>;
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
  currentFilters?: FilterState; // Текущие фильтры для умного подсчета
}