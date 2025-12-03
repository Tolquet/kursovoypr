// cardIst.ts
export interface Institutes {
  id: number;
  name: string;
  description: string;
  image: string;
  types: string;
  categoryIns: string[]; 
}

export interface InstitutesList {
  list: Institutes[];
  isLoad?: boolean;
  className?: string;
}

// Добавляем типы для фильтрации
export type InstituteType = 'college' | 'institute' | 'school';

// Утилиты для фильтрации
export interface FilteredInstitutes extends InstitutesList {
  filters?: {
    search?: string;
    types?: InstituteType[];
    categories?: string[];
  };
}