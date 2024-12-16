export interface module {
  id:number;
  title: string;
  description: string;
  estimatedTimeMinutes: string;
  topics: string[];
  fileUrl: ModuleFile[];
}
interface ModuleFile {
  name: string;
  size: string;
  type: string;
  file?: File;
}


export interface curriculum {
  id:string;
  createdAt: string;
  title: string;
  description: string;
  specialization: string;
  learningObjectives: string[];
  thumbnailImageUrl: string ;
  modules: module[];
}

export interface content{
  content: curriculum[]
}
