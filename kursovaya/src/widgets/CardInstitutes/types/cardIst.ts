// cardIst.ts
export interface Institutes {
  id: number;
  name: string;
  description: string;
  image: string;
  types: string;
  categoryIns: string[]; 
  location: string;
  rating: number;
  tuition: string;
}

export interface InstitutesList {
  list: Institutes[];
  isLoad?: boolean;
  className?: string;
}

// Добавляем типы для фильтрации
export type InstituteType = 'college' | 'institute' | 'school' | 'university' | 'academy';

// Категории для фильтрации
export const CATEGORIES = {
  'исследовательский': 'Исследовательские программы',
  'государственный': 'Государственные учреждения',
  'частный': 'Частные учреждения',
  'технический': 'Технические направления',
  'гуманитарный': 'Гуманитарные науки',
  'экономический': 'Экономические специальности',
  'математический': 'Математика и физика',
  'творческий': 'Творческие специальности',
  'медицинский': 'Медицинские направления',
  'it-специальности': 'IT и компьютерные науки',
  'инженерный': 'Инженерные специальности',
  'финансы': 'Финансы и банковское дело',
  'бизнес': 'Бизнес и предпринимательство',
  'психология': 'Психология',
  'социальный': 'Социальные науки',
  'научный': 'Научная деятельность',
  'практико-ориентированный': 'Практико-ориентированное обучение',
  'искусство': 'Искусство и культура',
  'балет': 'Балет и хореография',
  'элитный': 'Элитные программы',
  'олимпиадный': 'Олимпиадная подготовка',
  'ядерная-физика': 'Ядерная физика',
  'управленческий': 'Управление',
  'менеджмент': 'Менеджмент',
  'администрирование': 'Администрирование',
  'торговля': 'Торговля и логистика'
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

// Утилиты для фильтрации
export interface FilteredInstitutes extends InstitutesList {
  filters?: {
    search?: string;
    types?: InstituteType[];
    categories?: CategoryKey[];
    location?: string;
    rating?: number;
  };
}