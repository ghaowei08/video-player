import axios, { type AxiosResponse } from 'axios';

let token = ''

export function setToken(t: string) {
  token = t
}

export const clientInstance = axios.create({
  baseURL: import.meta.env.VITE_ENV == 'PROD' ? '/api' : 'http://localhost:3001/api',
  timeout: 1000,
  headers: { Authorization: 'Bearer ' + token }
});

export function getData<T>(response: AxiosResponse<T>): T {
  return response.data;
}