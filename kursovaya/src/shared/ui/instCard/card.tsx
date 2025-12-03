import Image from 'next/image'
import { Institutes } from '@/src/widgets/CardInstitutes/types/cardIst'


export default function InstCard(props: Institutes) {
    const {
        name,
        description,
        image,
        types,
        categoryIns,
    } = props

    return (

        <li>
            {image && (
                <Image
                    className=""
                    src={image}
                    alt={name}
                    width={300}
                    height={200}
                    style={{ width: 'auto', height: 'auto' }}
                />
            )}

            <h3>{name}</h3>
            <ul>
                {categoryIns.map((category, index) => (
                    <li key={index}>{category}</li>
                ))}
            </ul>
            <p>{description}</p>
        </li>
    )
}