//departamento de mensajeria

import api from '../api/axios';

// Definimos qué campos tiene una pista según tu base de datos
export interface Court {
  id: number;
  name: string;
  type: 'padel' | 'tenis';
  surface: string;
  active: boolean;
  opening_time: string;
  closing_time: string;
}

export const getCourts = async (): Promise<Court[]> => {
  const response = await api.get<Court[]>('/courts');
  return response.data;
};