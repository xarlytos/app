export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  nombre: string;
  rol: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

const API_URL = "https://fitofficecrm-7d2801a52c4c.herokuapp.com/api/auth/login/cliente";

export const AuthService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el inicio de sesión');
      }

      const data: LoginResponse = await response.json();
      
      // Store authentication data for later use
      // In NativeScript, we would typically use application-settings
      return data;
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      throw error;
    }
  }
};