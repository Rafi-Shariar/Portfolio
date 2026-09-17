export interface ICreateSkill {
  name: string;
  category : string
}

export interface IUpdateSkill {
    id : string,
    payload : ICreateSkill
}

export interface ISkill {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ICreateSkill {
  name: string;
  category: string;
}