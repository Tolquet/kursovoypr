'use client';

import { useEffect, useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/src/shared/ui/Icon/Icon';
import styles from './styles/instituteModal.module.scss';

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
  createdAt: string;
  updatedAt: string;
}

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  userId: number;
  user: {
    name: string;
    userType: string;
  };
}

interface InstituteModalProps {
  institute: Institute;
  onCloseAction: () => void;
}

const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'university': 'Университет',
    'college': 'Колледж',
    'institute': 'Институт',
    'school': 'Школа',
    'academy': 'Академия'
  };
  return labels[type] || type;
};

const getTypeIcon = (type: string) => {
  const icons: Record<string, 'university' | 'college' | 'institute' | 'school' | 'academy'> = {
    'university': 'university',
    'college': 'college',
    'institute': 'institute',
    'school': 'school',
    'academy': 'academy'
  };
  return <Icon name={icons[type] || 'building'} size={20} />;
};

const getCategoryLabel = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const getRatingColor = (rating: number): string => {
  if (rating >= 4.7) return '#2E7D32';
  if (rating >= 4.4) return '#388E3C';
  if (rating >= 4.0) return '#F57C00';
  return '#D32F2F';
};

const formatPrice = (value: number | undefined): string => {
  if (value === undefined || value === null) return 'По запросу';
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
};

export default function InstituteModal({ institute, onCloseAction }: InstituteModalProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Получение ID текущего пользователя
  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch('/api/auth/me');
          if (res.ok) {
            const data = await res.json();
            setCurrentUserId(data.user?.id);
          }
        } catch (err) {
          console.error('Error fetching user:', err);
        }
      }
    };
    fetchUser();
  }, [session]);

  // Загрузка отзывов
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?instituteId=${institute.id}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
        }
      } catch (err) {
        console.error('Error loading reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [institute.id]);

  // Закрытие по ESC
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCloseAction();
    }
  }, [onCloseAction]);

  // Закрытие по клику на оверлей
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      onCloseAction();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  const handleSubmitReview = async () => {
    if (newRating === 0) {
      setError('Выберите оценку');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instituteId: institute.id,
          rating: newRating,
          comment: newComment || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при отправке отзыва');
      }

      setSuccess(true);
      setReviews([data.review, ...reviews]);
      setNewRating(0);
      setNewComment('');
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при отправке');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) return;

    try {
      const response = await fetch(`/api/reviews?reviewId=${reviewId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при удалении');
      }

      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка при удалении');
    }
  };

  const handleStarClick = (rating: number) => {
    setNewRating(rating);
    setError('');
  };

  const renderStars = () => {
    return (
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${styles.star} ${star <= newRating ? styles.active : ''}`}
            onClick={() => handleStarClick(star)}
          >
            <Icon name="star-filled" size={28} />
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.modal_overlay} onClick={handleOverlayClick}>
      <div className={styles.modal_content}>
        <button className={styles.close_button} onClick={onCloseAction}>
          <Icon name="close" size={24} />
        </button>

        {/* Баннер */}
        {institute.banner && (
          <div className={styles.banner_section}>
            <img src={institute.banner} alt={institute.name} className={styles.banner_image} />
          </div>
        )}

        <div className={styles.modal_body}>
          {/* Заголовок */}
          <div className={styles.modal_header}>
            <div className={styles.type_badge}>
              <span className={styles.typeIcon}>{getTypeIcon(institute.types)}</span>
              <span className={styles.typeText}>{getTypeLabel(institute.types)}</span>
            </div>
            
            <h1 className={styles.modal_title}>{institute.name}</h1>

            <div className={styles.modal_meta}>
              <div className={styles.location_badge}>
                <span className={styles.locationIcon}>
                  <Icon name="map-pin" size={16} />
                </span>
                <span className={styles.locationText}>{institute.location}</span>
              </div>

              <div 
                className={styles.rating_badge}
                style={{ color: getRatingColor(institute.rating) }}
              >
                <span className={styles.ratingStars}>
                  <Icon name="star-filled" size={16} />
                </span>
                <span className={styles.ratingValue}>{institute.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Изображение */}
          {institute.image && (
            <div className={styles.main_image_section}>
              <Image
                src={institute.image}
                alt={institute.name}
                width={800}
                height={400}
                className={styles.main_image}
                priority
              />
            </div>
          )}

          {/* Описание */}
          <div className={styles.description_section}>
            <h2 className={styles.section_title}>Описание</h2>
            <p className={styles.description_text}>{institute.description}</p>
          </div>

          {/* Информация */}
          <div className={styles.info_grid}>
            <div className={styles.info_card}>
              <div className={styles.info_icon}>
                <Icon name="map-pin" size={28} />
              </div>
              <div className={styles.info_content}>
                <h3>Локация</h3>
                <p>{institute.location}</p>
                {institute.city && <small>{institute.city}</small>}
              </div>
            </div>

            <div className={styles.info_card}>
              <div className={styles.info_icon}>
                <Icon name="star-filled" size={28} />
              </div>
              <div className={styles.info_content}>
                <h3>Локальный рейтинг</h3>
                <p style={{ color: getRatingColor(institute.rating) }}>
                  {institute.rating.toFixed(1)} из 5
                </p>
              </div>
            </div>

            <div className={styles.info_card}>
              <div className={styles.info_icon}>
                <Icon name="money" size={28} />
              </div>
              <div className={styles.info_content}>
                <h3>Стоимость</h3>
                {institute.minTuition && institute.maxTuition ? (
                  <p>от {formatPrice(institute.minTuition)} до {formatPrice(institute.maxTuition)}/год</p>
                ) : (
                  <p>{institute.tuition || 'По запросу'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Категории */}
          {institute.categoryIns && institute.categoryIns.length > 0 && (
            <div className={styles.categories_section}>
              <h2 className={styles.section_title}>Направления обучения</h2>
              <div className={styles.categories_tags}>
                {institute.categoryIns.map((category, index) => (
                  <span key={index} className={styles.category_tag}>
                    {getCategoryLabel(category)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Отзывы */}
          <div className={styles.reviews_section}>
            <h2 className={styles.section_title}>Отзывы и оценки</h2>
            
            {loading ? (
              <p className={styles.loading_text}>Загрузка отзывов...</p>
            ) : reviews.length === 0 ? (
              <p className={styles.no_reviews}>Пока нет отзывов. Будьте первым!</p>
            ) : (
              <div className={styles.reviews_list}>
                {reviews.map(review => {
                  const isOwner = currentUserId === review.userId;
                  
                  return (
                    <div key={review.id} className={styles.review_item}>
                      <div className={styles.review_header}>
                        <div className={styles.review_user}>
                          <Link 
                            href={`/profile?userId=${review.userId}`}
                            className={styles.user_avatar_link}
                          >
                            <span className={styles.user_avatar}>
                              {review.user.name.charAt(0).toUpperCase()}
                            </span>
                          </Link>
                          <div className={styles.user_info}>
                            <Link 
                              href={`/profile?userId=${review.userId}`}
                              className={styles.user_name_link}
                            >
                              <span className={styles.user_name}>{review.user.name}</span>
                            </Link>
                            <span className={styles.user_type}>{review.user.userType}</span>
                          </div>
                        </div>
                        <div className={styles.review_actions}>
                          <div className={styles.review_rating}>
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Icon key={i} name="star-filled" size={16} />
                            ))}
                          </div>
                          {isOwner && (
                            <button
                              className={styles.delete_review_button}
                              onClick={() => handleDeleteReview(review.id)}
                              title="Удалить отзыв"
                            >
                              <Icon name="trash" size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                      {review.comment && (
                        <p className={styles.review_comment}>{review.comment}</p>
                      )}
                      <small className={styles.review_date}>
                        {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                      </small>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Форма добавления отзыва */}
            <div className={styles.add_review}>
              <h3>Оставить отзыв</h3>
              
              {error && (
                <div className={styles.error_message}>
                  {error}
                </div>
              )}
              
              {success && (
                <div className={styles.success_message}>
                  Отзыв успешно добавлен!
                </div>
              )}

              <div className={styles.rating_input}>
                <label>Ваша оценка:</label>
                {renderStars()}
                <span className={styles.rating_value}>
                  {newRating > 0 ? `${newRating} из 5` : 'Выберите оценку'}
                </span>
              </div>

              <div className={styles.comment_input}>
                <label>Комментарий (опционально):</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Поделитесь своим опытом..."
                  rows={4}
                />
              </div>

              <button
                className={styles.submit_review_button}
                onClick={handleSubmitReview}
                disabled={submitting || newRating === 0}
              >
                {submitting ? 'Отправка...' : 'Отправить отзыв'}
              </button>
            </div>
          </div>

          {/* Действия */}
          <div className={styles.modal_actions}>
            {institute.website && (
              <a 
                href={institute.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.primary_button}
                style={{ textDecoration: 'none' }}
              >
                <Icon name="globe" size={20} /> Подробнее на сайте
              </a>
            )}
            <button className={styles.secondary_button} onClick={onCloseAction}>
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
