import { API } from './api';
// import api from './api';


interface LoginPayload {
  email: string;
  password: string;
}

export async function login({ email, password }: LoginPayload) {
  const response = await API.post('/auth/login', {
    email,
    password,
  });
  
  if (response.data.csrfToken) {
    localStorage.setItem('csrfToken', response.data.csrfToken);
  }
  return response.data;
}

export async function register ({ email, password }: LoginPayload) {
  const response = await API.post('/auth/register', {
    email,
    password,
  });
  return response.data;

}