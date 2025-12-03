export interface Institutes {
  id: number;
  name: string;
  description: string;
  image: string;
  types: string;
  categoryIns:string[];
  
}

export interface InstitutesList {
  list : Institutes[];
  isLoad? : boolean;
  className? : string;
}

