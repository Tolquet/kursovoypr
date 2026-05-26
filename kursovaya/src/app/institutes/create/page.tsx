'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/src/shared/ui/Icon/Icon';
import styles from './styles/create.module.scss';

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

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  instituteName: string;
  onSubmitPayment: (paymentData: PaymentData) => Promise<void>;
}

interface PaymentData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  paymentMethod: 'card' | 'sbp' | 'yandex';
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

// Модальное окно оплаты
function PaymentModal({ isOpen, onClose, instituteName, onSubmitPayment }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sbp' | 'yandex'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(value);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiryDate(value);
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value.replace(/\D/g, '').slice(0, 3));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
        setError('Введите корректный номер карты');
        return;
      }
      if (!cardName) {
        setError('Введите имя владельца карты');
        return;
      }
      if (!expiryDate || expiryDate.length !== 5) {
        setError('Введите корректную дату истечения (MM/YY)');
        return;
      }
      if (!cvv || cvv.length !== 3) {
        setError('Введите CVV код');
        return;
      }
    }

    setIsProcessing(true);

    try {
      await onSubmitPayment({
        cardNumber,
        cardName,
        expiryDate,
        cvv,
        paymentMethod
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка оплаты');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.payment_modal_overlay}>
      <div className={styles.payment_modal}>
        <div className={styles.payment_modal_header}>
          <h2>Оплата публикации</h2>
          <button onClick={onClose} className={styles.payment_close_button}>
            <Icon name="close" size={24} />
          </button>
        </div>

        <div className={styles.payment_modal_body}>
          <div className={styles.payment_summary}>
            <p className={styles.payment_summary_text}>
              Публикация учебного заведения: <strong>{instituteName || 'Новое заведение'}</strong>
            </p>
            <p className={styles.payment_price}>
              5 000 ₽ <span className={styles.payment_price_note}>/ заведение</span>
            </p>
          </div>

          <div className={styles.payment_methods}>
            <h3>Способ оплаты</h3>
            <div className={styles.payment_method_options}>
              <button
                type="button"
                className={`${styles.payment_method_card} ${paymentMethod === 'card' ? styles.active : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <Icon name="money" size={24} />
                <span>Банковская карта</span>
              </button>
              <button
                type="button"
                className={`${styles.payment_method_card} ${paymentMethod === 'sbp' ? styles.active : ''}`}
                onClick={() => setPaymentMethod('sbp')}
              >
                <span style={{ fontSize: '24px' }}>📱</span>
                <span>СБП</span>
              </button>
              <button
                type="button"
                className={`${styles.payment_method_card} ${paymentMethod === 'yandex' ? styles.active : ''}`}
                onClick={() => setPaymentMethod('yandex')}
              >
                <span style={{ fontSize: '24px' }}>💳</span>
                <span>Yandex Pay</span>
              </button>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <form onSubmit={handleSubmit} className={styles.payment_form}>
              <div className={styles.form_group}>
                <label>Номер карты</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                />
              </div>

              <div className={styles.form_group}>
                <label>Имя владельца</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  placeholder="IVAN IVANOV"
                  maxLength={25}
                />
              </div>

              <div className={styles.form_row}>
                <div className={styles.form_group}>
                  <label>Срок действия</label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>

                <div className={styles.form_group}>
                  <label>CVV/CVC</label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={handleCVVChange}
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>

              {error && <div className={styles.payment_error}>{error}</div>}

              <button
                type="submit"
                className={styles.payment_submit_button}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className={styles.spinner}></span>
                    Обработка...
                  </>
                ) : (
                  <>
                    <span>Оплатить 5 000 ₽</span>
                    <Icon name="check" size={20} />
                  </>
                )}
              </button>
            </form>
          )}

          {paymentMethod === 'sbp' && (
            <div className={styles.sbp_section}>
              <div className={styles.sbp_qr}>
                <div className={styles.sbp_qr_placeholder}>
                  <span style={{ fontSize: '48px' }}>📱</span>
                </div>
                <p>Отсканируйте QR-код через приложение вашего банка</p>
              </div>
              <button
                type="button"
                className={styles.payment_submit_button}
                onClick={async () => {
                  setIsProcessing(true);
                  await onSubmitPayment({ paymentMethod: 'sbp', cardNumber: '', cardName: '', expiryDate: '', cvv: '' });
                  setIsProcessing(false);
                }}
                disabled={isProcessing}
              >
                {isProcessing ? 'Обработка...' : 'Я оплатил'}
              </button>
            </div>
          )}

          {paymentMethod === 'yandex' && (
            <div className={styles.yandex_section}>
              <div className={styles.yandex_info}>
                <span style={{ fontSize: '48px' }}>💳</span>
                <p>Перейдите в Yandex Pay для завершения оплаты</p>
              </div>
              <button
                type="button"
                className={styles.payment_submit_button}
                onClick={async () => {
                  setIsProcessing(true);
                  await onSubmitPayment({ paymentMethod: 'yandex', cardNumber: '', cardName: '', expiryDate: '', cvv: '' });
                  setIsProcessing(false);
                }}
                disabled={isProcessing}
              >
                {isProcessing ? 'Обработка...' : 'Перейти к оплате'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreateInstitutePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userType, setUserType] = useState<UserType>('student');
  const [uploading, setUploading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Ссылки на Input для загрузки файлов
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

  // Перенаправляем неавторизованных пользователей
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
  }, [status, router]);
    
  // Загрузка типа пользователя
  useEffect(() => {
    if (session?.user) {
      fetch('/api/auth/me')
        .then(res => res.json())
        .then(data => {
          setUserType(data.userType || 'student');
        })
        .catch(() => {
          // Если ошибка, всё равно оставляем страницу - API проверит права
        });
    }
  }, [session]);

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

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    // Проверка размера (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Временное решение: используем placeholder вместо Cloudinary
      // Для production настройте Cloudinary (см. CLOUDINARY_SETUP.md)
      const isCloudinaryConfigured = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && 
                                     process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME !== 'your-cloud-name';

      if (!isCloudinaryConfigured) {
        // Используем placeholder изображение
        const placeholderUrl = type === 'image' 
          ? 'https://via.placeholder.com/800x400/667eea/ffffff?text=Institute+Image'
          : 'https://via.placeholder.com/1200x300/764ba2/ffffff?text=Banner';
        
        setFormData(prev => ({ 
          ...prev, 
          [type === 'image' ? 'image' : 'banner']: placeholderUrl 
        }));
        
        console.log('Cloudinary не настроен. Используется placeholder изображение.');
      } else {
        // Создаем FormData для отправки файла
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        
        // Используем upload_preset из переменной окружения или дефолтное значение
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'globaledu';
        formDataUpload.append('upload_preset', uploadPreset);

        // Получаем cloud name из переменной окружения
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        if (!cloudName) {
          throw new Error('Cloudinary cloud name не настроен. Проверьте переменные окружения.');
        }

        // Загружаем на Cloudinary
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formDataUpload
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `Ошибка загрузки файла: ${response.status}`);
        }

        const data = await response.json();
        
        // Сохраняем URL изображения
        if (type === 'image') {
          setFormData(prev => ({ ...prev, image: data.secure_url }));
        } else {
          setFormData(prev => ({ ...prev, banner: data.secure_url }));
        }
      }
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки изображения. Проверьте настройки Cloudinary.';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handlePaymentSubmit = async (paymentData: PaymentData) => {
    // Здесь будет интеграция с платежной системой
    // Для демо-режима просто имитируем успешную оплату
    console.log('Payment data:', paymentData);
    
    // Имитация задержки обработки
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // После успешной оплаты создаем заведение
    await handleCreateWithoutPayment();
  };

  const handleCreateWithoutPayment = async () => {
    setError('');

    // Валидация
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
        city: formData.city || formData.location.split(',')[0],
        tuition: formData.tuition,
        minTuition: formData.minTuition ? parseFloat(formData.minTuition) : null,
        maxTuition: formData.maxTuition ? parseFloat(formData.maxTuition) : null,
        categoryIns: formData.categoryIns,
        image: formData.image || null,
        banner: formData.banner || null,
        website: formData.website || null
      };

      const response = await fetch('/api/institutes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при создании');
      }

      setSuccess(true);
      setShowPaymentModal(false);
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при создании';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    // Открываем модальное окно оплаты вместо прямой отправки
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
    setShowPaymentModal(true);
  };

  // Показываем загрузку
  if (status === 'loading') {
    return (
      <div className={styles.create_page}>
        <div className={styles.create_container}>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  // Показываем форму (API проверит права доступа)

  if (success) {
    return (
      <div className={styles.create_page}>
        <div className={styles.create_container}>
          <div className={styles.success_message}>
            <h1>Учебное заведение создано!</h1>
            <p>Вы будете перенаправлены в профиль...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.create_page}>
      <div className={styles.create_container}>
        <div className={styles.create_header}>
          <h1>Добавить учебное заведение</h1>
          <p>Заполните форму для публикации информации о заведении</p>
        </div>

        {error && <div className={styles.error_message}>{error}</div>}

        <form onSubmit={handleCreate} className={styles.create_form}>
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
                    {uploading ? 'Загрузка...' : 'Загрузить'}
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
                    {uploading ? 'Загрузка...' : 'Загрузить баннер'}
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
              {isLoading ? 'Обработка...' : 'Перейти к оплате'}
            </button>
          </div>
        </form>

        {/* Модальное окно оплаты */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          instituteName={formData.name}
          onSubmitPayment={handlePaymentSubmit}
        />
      </div>
    </div>
  );
}
