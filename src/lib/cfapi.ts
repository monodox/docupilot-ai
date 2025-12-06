const CF_BASE_URL = process.env.NEXT_PUBLIC_CF_API_URL || 'http://localhost:8500';

export const cfApi = {
  async testConnection() {
    try {
      const response = await fetch(`${CF_BASE_URL}/CFIDE/administrator/index.cfm`, {
        method: 'HEAD',
        mode: 'no-cors'
      });
      return { success: true, status: 'Connected' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async get(endpoint: string) {
    const response = await fetch(`${CF_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },
  
  async post(endpoint: string, data: any) {
    const response = await fetch(`${CF_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  async login(email: string, password: string) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  async signup(email: string, password: string, firstName: string, lastName: string) {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName })
    });
    return response.json();
  },

  async forgotPassword(email: string) {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return response.json();
  },

  async resetPassword(token: string, password: string) {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });
    return response.json();
  },

  async verifyEmail(token: string) {
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    return response.json();
  }
};