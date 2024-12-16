export interface module {
  id: number;
  title: string;
  description: string;
  estimatedTimeMinutes: string;
  estimatedTime?: number;
  topics: string[];
  moduleFile: moduleFile[];
  fileUrl: string ;
}


export interface moduleFile {
  name: string;
  size: string;
  type: string;
  file?: File | string;
}



export interface curriculum {
  id: string;
  createdAt: string;
  createdBy?: string;
  title: string;
  description: string;
  specialization: string;
  
  learningObjectives: string[];
  thumbnailImage: string | File | null;
  thumbnailImageUrl?: string;
  modules: module[];
}

export interface content{
  content: curriculum[]
}
