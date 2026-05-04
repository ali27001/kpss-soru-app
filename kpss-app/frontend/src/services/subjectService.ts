import api from './api';

export interface Subject {
  id: number;
  name: string;
}

export const getSubjects = async (): Promise<Subject[]> => {
  const response = await api.get<Subject[]>('/subjects');
  return response.data;
};
