'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Icon from '@/src/shared/ui/Icon/Icon';
import styles from './styles/edit.module.scss';

type UserType = 'student' | 'applicant' | 'school' | 'company';

interface FormData {
  name: string;
  description: string;
  types: string;
  location: string;
  city: string;
  tuition: string;
  minTuition: string;
  maxTuition: string;
  categoryIns: string[];
  image: string;
  banner: string;
  website: string;
}

interface Institute {
  id: number;
  name: string;
  description: string;
  image?: string;
  banner?: string;
  website?: string;
  types: string;
  location: string;
  city?: string;
  rating: number;
  tuition: string;
  minTuition?: number;
  maxTuition?: number;
  categoryIns: string[];
  ownerId?: number;
  createdAt: string;
  updatedAt: string;
}

const instituteTypes = [
  { value: 'university', label: 'Университет', icon: 'university' as const },
  { value: 'college', label: 'Колледж', icon: 'college' as const },
  { value: 'institute', label: 'Институт', icon: 'institute' as const },
  { value: 'school', label: 'Школа', icon: 'school' as const },
  { value: 'academy', label: 'Академия', icon: 'academy' as const }
];

const categories = [
  'исследовательский', 'государственный', 'частный', 'технический',
  'гуманитарный', 'экономический', 'математический', 'творческий',
  'it-специальности', 'инженерный', 'финансы', 'бизнес',
  'психология', 'социальный', 'научный', 'практико-ориентированный',
  'искусство', 'балет', 'элитный', 'олимпиадный',
  'ядерная-физика', 'управленческий', 'менеджмент', 'администрирование', 'торговля'
];

export default function EditInstitutePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const instituteId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    types: 'university',
    location: '',
    city: '',
    tuition: '',
    minTuition: '',
    maxTuition: '',
    categoryIns: [],
    image: '',
    banner: '',
    website: ''
  });

  // Загрузка данных института
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (instituteId && status === 'authenticated') {
      fetchInstitute();
    }
  }, [instituteId, status, router]);

  const fetchInstitute = async () => {
    try {
      const response = await fetch(`/api/institutes/${instituteId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при загрузке');
      }

      const institute: Institute = data.institute;
      
      // Заполняем форму данными
      setFormData({
        name: institute.name,
        description: institute.description,
        types: institute.types,
        location: institute.location,
        city: institute.city || '',
        tuition: institute.tuition,
        minTuition: institute.minTuition?.toString() || '',
        maxTuition: institute.maxTuition?.toString() || '',
        categoryIns: institute.categoryIns,
        image: institute.image || '',
        banner: institute.banner || '',
        website: institute.website || ''
      });
    } catch (err) {
      console.error('Error fetching institute:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке данных');
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIns: prev.categoryIns.includes(category)
        ? prev.categoryIns.filter(c => c !== category)
        : [...prev.categoryIns, category]
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const isCloudinaryConfigured = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && 
                                     process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME !== 'your-cloud-name';

      if (!isCloudinaryConfigured) {
        const placeholderUrl = type === 'image' 
          ? 'https://via.placeholder.com/800x400/667eea/ffffff?text=Institute+Image'
          : 'https://via.placeholder.com/1200x300/764ba2/ffffff?text=Banner';
        
        setFormData(prev => ({ 
          ...prev, 
          [type === 'image' ? 'image' : 'banner']: placeholderUrl 
        }));
      } else {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'globaledu';
        formDataUpload.append('upload_preset', uploadPreset);

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        if (!cloudName) {
          throw new Error('Cloudinary cloud name не настроен');
        }

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formDataUpload
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `Ошибка загрузки: ${response.status}`);
        }

        const data = await response.json();
        
        if (type === 'image') {
          setFormData(prev => ({ ...prev, image: data.secure_url }));
        } else {
          setFormData(prev => ({ ...prev, banner: data.secure_url }));
        }
      }
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки изображения';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name) {
      setError('Укажите название');
      return;
    }
    if (!formData.description) {
      setError('Укажите описание');
      return;
    }
    if (!formData.location) {
      setError('Укажите адрес');
      return;
    }
    if (formData.categoryIns.length === 0) {
      setError('Выберите хотя бы одну категорию');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        types: formData.types,
        location: formData.location,
        city: formData.city,
        tuition: formData.tuition,
        minTuition: formData.minTuition ? parseFloat(formData.minTuition) : null,
        maxTuition: formData.maxTuition ? parseFloat(formData.maxTuition) : null,
        categoryIns: formData.categoryIns,
        image: formData.image || null,
        banner: formData.banner || null,
        website: formData.website || null
      };

      const response = await fetch(`/api/institutes/${instituteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при обновлении');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при обновлении';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isFetching) {
    return (
      <div className={styles.edit_page}>
        <div className={styles.edit_container}>
          <div className={styles.loading_container}>
            <div className={styles.spinner}></div>
            <p>Загрузка данных...</p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.edit_page}>
        <div className={styles.edit_container}>
          <div className={styles.success_message}>
            <h1>✅ Учебное заведение обновлено!</h1>
            <p>Вы будете перенаправлены в профиль...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.edit_page}>
      <div className={styles.edit_container}>
        <div className={styles.edit_header}>
          <h1>Редактировать учебное заведение</h1>
          <p>Измените информацию о заведении</p>
        </div>

        {error && <div className={styles.error_message}>{error}</div>}

        <form onSubmit={handleUpdate} className={styles.edit_form}>
          {/* Секция изображений */}
          <div className={styles.form_section}>
            <h3 className={styles.section_title}>Изображения</h3>
            
            <div className={styles.images_grid}>
              {/* Главное изображение */}
              <div className={styles.image_upload_card}>
                <div className={styles.image_preview}>
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className={styles.preview_image} />
                  ) : (
                    <div className={styles.placeholder}>
                      <Icon name="camera" size={48} />
                      <p>Главное изображение</p>
                    </div>
                  )}
                </div>
                <div className={styles.image_actions}>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'image')}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className={styles.upload_button}
                    disabled={uploading}
                  >
                    {uploading ? 'Загрузка...' : 'Загрузить новое'}
                  </button>
                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className={styles.remove_button}
                    >
                      Удалить
                    </button>
                  )}
                </div>
              </div>

              {/* Баннер */}
              <div className={styles.image_upload_card}>
                <div className={styles.image_preview}>
                  {formData.banner ? (
                    <img src={formData.banner} alt="Banner" className={styles.preview_banner} />
                  ) : (
                    <div className={styles.placeholder}>
                      <Icon name="palette" size={48} />
                      <p>Баннер (опционально)</p>
                    </div>
                  )}
                </div>
                <div className={styles.image_actions}>
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'banner')}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className={styles.upload_button}
                    disabled={uploading}
                  >
                    {uploading ? 'Загрузка...' : 'Загрузить новый'}
                  </button>
                  {formData.banner && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, banner: '' }))}
                      className={styles.remove_button}
                    >
                      Удалить
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Основная информация */}
          <div className={styles.form_section}>
            <h3 className={styles.section_title}>Основная информация</h3>
            
            <div className={styles.form_group}>
              <label htmlFor="name">Название *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Например: Московский государственный университет"
                required
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="description">Описание *</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Подробное описание учебного заведения, программ обучения, преимуществ..."
                rows={6}
                required
              />
            </div>

            <div className={styles.form_row}>
              <div className={styles.form_group}>
                <label htmlFor="types">Тип заведения *</label>
                <select
                  id="types"
                  value={formData.types}
                  onChange={(e) => handleInputChange('types', e.target.value)}
                  required
                >
                  {instituteTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.form_group}>
                <label htmlFor="city">Город</label>
                <input
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Москва"
                />
              </div>
            </div>

            <div className={styles.form_group}>
              <label htmlFor="location">Адрес *</label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="г. Москва, ул. Примерная, д. 1"
                required
              />
            </div>
          </div>

          {/* Стоимость обучения */}
          <div className={styles.form_section}>
            <h3 className={styles.section_title}>Стоимость обучения</h3>
            
            <div className={styles.form_row}>
              <div className={styles.form_group}>
                <label htmlFor="tuition">Стоимость (общая)</label>
                <input
                  type="text"
                  id="tuition"
                  value={formData.tuition}
                  onChange={(e) => handleInputChange('tuition', e.target.value)}
                  placeholder="от 100 000 до 300 000 ₽/год"
                />
              </div>

              <div className={styles.form_group}>
                <label htmlFor="website">Ссылка на сайт</label>
                <input
                  type="url"
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://example.edu.ru"
                />
                <span className={styles.form_hint}>Опционально: ссылка на официальный сайт учебного заведения</span>
              </div>
            </div>

            <div className={styles.form_row}>
              <div className={styles.form_group}>
                <label htmlFor="minTuition">Минимальная стоимость (₽)</label>
                <input
                  type="number"
                  id="minTuition"
                  value={formData.minTuition}
                  onChange={(e) => handleInputChange('minTuition', e.target.value)}
                  placeholder="100000"
                />
              </div>

              <div className={styles.form_group}>
                <label htmlFor="maxTuition">Максимальная стоимость (₽)</label>
                <input
                  type="number"
                  id="maxTuition"
                  value={formData.maxTuition}
                  onChange={(e) => handleInputChange('maxTuition', e.target.value)}
                  placeholder="300000"
                />
              </div>
            </div>
          </div>

          {/* Категории */}
          <div className={styles.form_section}>
            <h3 className={styles.section_title}>Категории *</h3>
            <div className={styles.categories_grid}>
              {categories.map(category => (
                <label
                  key={category}
                  className={`${styles.category_checkbox} ${
                    formData.categoryIns.includes(category) ? styles.selected : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.categoryIns.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  <span className={styles.category_label}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.form_actions}>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles.cancel_button}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.submit_button}
              disabled={isLoading || uploading}
            >
              {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

