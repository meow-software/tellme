import { AnonymousAPI } from './api';

interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

export async function login({ usernameOrEmail, password }: LoginPayload) {
  const response = await AnonymousAPI.post('/auth/login', {
    usernameOrEmail,
    password,
  });

  if (response.data.data.csrfToken) {
    localStorage.setItem('csrfToken', response.data.data.csrfToken);
  }
  return response.data;
}

export async function register({ email, username, password }: RegisterPayload) {
  const response = await AnonymousAPI.post('/auth/register', {
    email,
    username,
    password,
  });
  return response.data;

}