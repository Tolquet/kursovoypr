import { InstitutesList } from './types/cardIst'
import InstCard from '@/src/shared/ui/instCard/card'

import styles from "./styles/style.module.scss"

export default function CardInstitutes(cards : InstitutesList){

    const{
        list,
        isLoad = false,
    } = cards
    
    if (isLoad){
        return <div>Загрузка...</div>
    }

    if (!list || list.length === 0) {
    return <div>Институты не найдены</div>
    }   

    
    return(
        <ul className={styles.inst_list}>
            {list.map((card) =>(
                <InstCard key={card.id} {...card} />
            ))}
        </ul>
    )
}