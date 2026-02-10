import Image from 'next/image'
import { Institutes } from '@/src/widgets/CardInstitutes/types/cardIst'
import style from './styles/style.module.scss'

const getRatingColor = (rating: number): string => {
  if (rating >= 4.7) return '#2E7D32'; // Зеленый
  if (rating >= 4.4) return '#388E3C'; // Светло-зеленый
  if (rating >= 4.0) return '#F57C00'; // Оранжевый
  return '#D32F2F'; // Красный
};

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

export default function InstCard(props: Institutes) {
    const {
        name,
        description,
        image,
        types,
        categoryIns,
        location,
        rating,
        tuition,
    } = props

    return (
        <li className="card_institute">
            <div className="card_image">
                {image && (
                    <Image
                        src={image}
                        alt={name}
                        width={400}
                        height={200}
                        className="card-image"
                    />
                )}
                <div className="type-badge">
                    <span className="type-icon">{getTypeIcon(types)}</span>
                    <span className="type-text">{types}</span>
                </div>
            </div>

            <div className="card-content">
                <h3 className="card-title">{name}</h3>
                
                <div className="card-meta">
                    <div className="location">
                        <span className="location-icon">📍</span>
                        <span className="location-text">{location}</span>
                    </div>
                    <div className="rating" style={{ color: getRatingColor(rating) }}>
                        <span className="rating-stars">★</span>
                        <span className="rating-value">{rating}</span>
                    </div>
                </div>

                <p className="card-description">{description}</p>

                <div className="tuition-info">
                    <span className="tuition-label">Стоимость:</span>
                    <span className="tuition-value">{tuition}</span>
                </div>

                <div className="card-categories">
                    {categoryIns.slice(0, 3).map((category, index) => (
                        <span key={index} className="category-tag">
                            {category},
                        </span>

        
                    ))}
                    {categoryIns.length > 3 && (
                        <span className="more-categories">
                            +{categoryIns.length - 3}
                        </span>
                    )}
                </div>
            </div>
        </li>
    )
}