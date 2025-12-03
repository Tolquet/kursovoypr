import Image from 'next/image'
import { Institutes } from '@/src/widgets/CardInstitutes/types/cardIst'

import styles from "./styles/style.module.scss"


export default function InstCard(props: Institutes) {
    const {
        name,
        description,
        image,
        types,
        categoryIns,
    } = props

    return (

        <li className={styles.card_body}>
            {image && (
                <Image
                    className={styles.card_img}
                    src={image}
                    alt={name}
                    width={300}
                    height={200}
                    style={{ width: 'auto', height: 'auto' }}
                />
            )}

            <h3 className={styles.card_name}>{name}</h3>
            <ul className={styles.card_list_category}>
                <span className={styles.card_type}>
                    {types}
                </span>
                {categoryIns.map((category, index) => (
                    <li className={styles.card_category} key={index}>{category}</li>
                ))}
            </ul>
            <p className={styles.card_description}>{description}</p>
        </li>
    )
}