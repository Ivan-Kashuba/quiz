import { AuthProvider } from 'react-admin';
import { LocalStorageKey } from '@/shared/lib/localstorage';

export const authProvider: AuthProvider = {
  async getIdentity() {
    return Promise.resolve({
      fullName: 'Admin',
      id: '0',
      avatar:
        'https://cdn.vectorstock.com/i/500p/52/38/avatar-icon-vector-11835238.jpg',
    });
  },
  async logout() {
    localStorage.removeItem(LocalStorageKey.accessToken);
    return Promise.resolve();
  },
  async login() {
    return Promise.resolve();
  },
  async checkAuth() {
    return localStorage.getItem(LocalStorageKey.accessToken)
      ? Promise.resolve()
      : Promise.reject();
  },
  async checkError() {
    return Promise.resolve();
  },
};
