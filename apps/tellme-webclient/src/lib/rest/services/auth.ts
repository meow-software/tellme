import { API } from '@/lib';
import { access } from 'fs';

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
  const response = await API.post('/auth/login', {
    usernameOrEmail,
    password,
  });

  if (response.data.data.csrfToken) {
    localStorage.setItem('csrfToken', response.data.data.csrfToken);
  }
  return response.data;
}

export async function register({ email, username, password }: RegisterPayload) {
  const response = await API.post('/auth/register', {
    email,
    username,
    password,
  });
  return response.data;

}

export async function me(){
  return {
    email : "test@est",
    username : "test",
    id: "8777877"
  }
}
export async function logout() {}
export async function refresh() {
  return {
    accessXCsrfToken: "jhijo",
    refreshXCsrfToken: "jhijo"
  }
}

export const authService = {
  me: me,
  login: login,
  logout: logout,
  refresh: refresh,
}