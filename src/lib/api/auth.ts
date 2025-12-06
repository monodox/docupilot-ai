const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8500/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface ResetPasswordData {
  password: string;
  token?: string;
}

export const authAPI = {
  async login(credentials: LoginCredentials) {
    const response = await fetch(`${API_URL}/auth/login.cfm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  async signup(data: SignupData) {
    const response = await fetch(`${API_URL}/auth/signup.cfm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Signup failed');
    return response.json();
  },

  async forgotPassword(email: string) {
    const response = await fetch(`${API_URL}/auth/forgot-password.cfm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  },

  async resetPassword(data: ResetPasswordData) {
    const response = await fetch(`${API_URL}/auth/reset-password.cfm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Reset failed');
    return response.json();
  },
};
