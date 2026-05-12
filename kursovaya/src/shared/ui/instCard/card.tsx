import Image from 'next/image'
import { useCallback } from 'react';
import { Institutes } from '@/src/widgets/CardInstitutes/types/cardIst'
import styles from './styles/style.module.scss'

interface InstCardProps extends Institutes {
  onOpenModal?: (institute: Institutes | null) => void;
}

// Функция для получения цвета рейтинга
const getRatingColor = (rating: number): string => {
  if (rating >= 4.7) return '#2E7D32'; // Зеленый
  if (rating >= 4.4) return '#388E3C'; // Светло-зеленый
  if (rating >= 4.0) return '#F57C00'; // Оранжевый
  return '#D32F2F'; // Красный
};

// Функция для получения иконки типа учреждения
const getTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    'university': '🎓',
    'college': '🏫',
    'institute': '🏛️',
    'school': '🏫',
    'academy': '🎨'
  };
  return icons[type] || '🏢';
};

// Функция для форматирования цены
const formatPrice = (value: number | undefined): string => {
  if (value === undefined || value === null) return 'По запросу';
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
};

// Функция для получения типа учреждения на русском
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

export default function InstCard(props: InstCardProps) {
    const {
        name,
        description,
        image,
        types,
        categoryIns,
        location,
        rating,
        tuition,
        city,
        minTuition,
        maxTuition,
        onOpenModal,
    } = props

    // Формируем строку стоимости
    const tuitionDisplay = minTuition && maxTuition 
      ? `от ${formatPrice(minTuition)} до ${formatPrice(maxTuition)}`
      : tuition || 'По запросу';

    const handleCardClick = useCallback(() => {
        onOpenModal?.(props);
    }, [onOpenModal, props]);

    return (
        <li className={styles.card_institute}>
            <div 
                className={styles.card_image} 
                onClick={handleCardClick} 
                style={{ cursor: 'pointer' }}
            >
                {image && (
                    <Image
                        src={image}
                        alt={name}
                        width={400}
                        height={200}
                        className={styles.cardImage}
                    />
                )}
                <div className={styles.typeBadge}>
                    <span className={styles.typeIcon}>{getTypeIcon(types)}</span>
                    <span className={styles.typeText}>{getTypeLabel(types)}</span>
                </div>
                {city && (
                    <div className={styles.cityBadge}>
                        <span className={styles.cityIcon}>🏙️</span>
                        <span className={styles.cityText}>{city}</span>
                    </div>
                )}
            </div>

            <div 
                className={styles.cardContent} 
                onClick={handleCardClick}
                style={{ cursor: 'pointer' }}
            >
                <h3 className={styles.cardTitle}>{name}</h3>
                
                <div className={styles.cardMeta}>
                    <div className={styles.location}>
                        <span className={styles.locationIcon}>📍</span>
                        <span className={styles.locationText}>{location}</span>
                    </div>
                    <div className={styles.rating} style={{ color: getRatingColor(rating) }}>
                        <span className={styles.ratingStars}>★</span>
                        <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
                    </div>
                </div>

                <p className={styles.cardDescription}>{description}</p>

                <div className={styles.tuitionInfo}>
                    <span className={styles.tuitionLabel}>Стоимость обучения:</span>
                    <span className={styles.tuitionValue}>{tuitionDisplay}</span>
                </div>

                <div className={styles.cardCategories}>
                    {categoryIns.slice(0, 4).map((category, index) => (
                        <span key={index} className={styles.categoryTag}>
                            {category}
                        </span>
                    ))}
                    {categoryIns.length > 4 && (
                        <span className={styles.moreCategories}>
                            +{categoryIns.length - 4}
                        </span>
                    )}
                </div>
            </div>
        </li>
    )
}
