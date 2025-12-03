import FilterPanel from "@/src/widgets/institution-filter/ui/filter";
import CardInstitutes from "@/src/widgets/CardInstitutes/cardList";
import styles from "./styles/style.module.scss"

const institution = [
  {id: 1, name:'Жопожрунчик1',description: 'Топовый универ всея руси1',image: "/",categoryIns: ['100балов','гуманитарий','пук пук1'],types: 'college'},
  {id: 2, name:'Жопожрунчик2',description: 'Топовый универ всея руси2',image: "/",categoryIns: ['100балов','гуманитарий','пук пук2'],types: 'institute'},
  {id: 3, name:'Жопожрунчик3',description: 'Топовый универ всея руси3',image: "/",categoryIns: ['100балов','гуманитарий','пук пук3'],types: 'school'},
  {id: 4, name:'Жопожрунчик4',description: 'Топовый универ всея руси4',image: "/",categoryIns: ['100балов','гуманитарий','пук пук4'],types: 'college'},
  {id: 5, name:'Жопожрунчик5',description: 'Топовый универ всея руси5',image: "/", categoryIns: ['100балов','гуманитарий','пук пук5'],types: 'college'},
]

export default function FinderPage() {

  return (      
    <>
      <div className="finder-page">
        <FilterPanel />
        <div className="results-content">
          <h2>Найдено результатов: {institution.length}</h2>
          <CardInstitutes list={institution} className={styles.inst_grid} />
        </div>
      </div>
    </>
  );
}