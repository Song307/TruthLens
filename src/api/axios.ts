import axios, { type AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  // Phase 3-5에서 발급받은 ngrok 주소를 입력
  baseURL: 'https://enjoyment-march-humvee.ngrok-free.dev',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;