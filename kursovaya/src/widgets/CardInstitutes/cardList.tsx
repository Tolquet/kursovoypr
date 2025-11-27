import { InstitutesList } from './types/cardIst'

import InstCard from '@/src/shared/ui/instCard/card'
export default function CardInstitutes(cards : InstitutesList){

    const{
        list,
        isLoad = false,
        className,
    } = cards
    
    if (isLoad){
        return <div>Загрузка...</div>
    }

    if (!list || list.length === 0) {
    return <div>Институты не найдены</div>
    }   

    
    return(
        <ul className={`card-list ${className}`}>
            {list.map((card) =>(
                <InstCard key={card.id} {...card} />
            ))}
        </ul>
    )
}