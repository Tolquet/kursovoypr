import FilterPanel from "@/src/widgets/institution-filter/ui/filter";
import CardInstitutes from "@/src/widgets/CardInstitutes/cardList";
import styles from "./styles/style.module.scss"

const institution = [
  {id: 1,name:'Жопожрунчик',description: 'Топовый универ всея руси',image: "/",categoryIns: ['Универ','100балов','гуманитарий','пук пук']},
  {id: 2, name:'Жопожрунчик',description: 'Топовый универ всея руси',image: "/",categoryIns: ['Универ','100балов','гуманитарий','пук пук']},
  {id: 3,name:'Жопожрунчик',description: 'Топовый универ всея руси',image: "/",categoryIns: ['Универ','100балов','гуманитарий','пук пук'],},
  {id: 4,name:'Жопожрунчик',description: 'Топовый универ всея руси',image: "/",categoryIns: ['Универ','100балов','гуманитарий','пук пук']},
  { id: 5, name:'Жопожрунчик',description: 'Топовый универ всея руси',image: "/", categoryIns: ['Универ','100балов','гуманитарий','пук пук'],},
]

export default function FinderPage() {

  return (      
    <>
      <div className="finder-page">
        <aside className="filters-sidebar">
         
        </aside>

        <main className="results-content">
          <h2>Найдено результатов: {institution.length}</h2>
          <CardInstitutes list={institution} className={styles.inst_grid} />
        </main>
      </div>
    </>
  );
}