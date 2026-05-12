import { Institutes, InstitutesList } from './types/cardIst'
import InstCard from '@/src/shared/ui/instCard/card'
import { useState } from 'react';
import InstituteModal from '@/src/shared/ui/instituteModal/instituteModal'
import styles from "./styles/style.module.scss"

export default function CardInstitutes(cards : InstitutesList){

    const{
        list,
        isLoad = false,
    } = cards
    
    const [selectedInstitute, setSelectedInstitute] = useState<Institutes | null>(null);
    
    if (isLoad){
        return <div>Загрузка...</div>
    }

    if (!list || list.length === 0) {
    return <div>Институты не найдены</div>
    }   

    
    return(
        <>
        <ul className={styles.inst_list}>
            {list.map((card) =>(
                <InstCard 
                    key={card.id} 
                    {...card} 
                    onOpenModal={setSelectedInstitute}
                />
            ))}
        </ul>
        
        {selectedInstitute && (
            <InstituteModal
                institute={{
                    ...selectedInstitute,
                    createdAt: selectedInstitute.createdAt || '',
                    updatedAt: selectedInstitute.updatedAt || ''
                }}
                onCloseAction={() => setSelectedInstitute(null)}
            />
        )}
        </>
    )
}