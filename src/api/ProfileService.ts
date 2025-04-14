export interface Direccion {
  calle: string;
  numero: string;
  piso: string;
  codigoPostal: string;
  ciudad: string;
  provincia: string;
}

export interface RedSocial {
  nombre: string;
  url: string;
}

export interface Nota {
  titulo: string;
  contenido: string;
  fecha: string;
}

export interface PlanDePago {
  _id: string;
  nombre: string;
  monto: number;
  estado: string;
}

export interface Transaccion {
  _id: string;
  concepto: string;
  monto: number;
  fecha: string;
  estado: string;
}

export interface Profile {
  _id: string;
  nombre: string;
  email: string;
  trainer: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  direccion: Direccion;
  altura: number;
  peso: number;
  condicionesMedicas: string[];
  redesSociales: RedSocial[];
  tags: string[];
  notas: Nota[];
  planesDePago: PlanDePago[];
  transacciones: Transaccion[];
  createdAt: string;
  updatedAt: string;
}

const mockProfileData: Profile = {
  "_id": "65cf8a9b1234567890abcde1",
  "nombre": "Juan García",
  "email": "juan@ejemplo.com",
  "trainer": "65cf8a9b1234567890abcde2",
  "fechaNacimiento": "1990-01-01T00:00:00.000Z",
  "genero": "Masculino",
  "telefono": "+34600000000",
  "direccion": {
    "calle": "Calle Principal",
    "numero": "123",
    "piso": "4A",
    "codigoPostal": "28001",
    "ciudad": "Madrid",
    "provincia": "Madrid"
  },
  "altura": 175,
  "peso": 70,
  "condicionesMedicas": ["Ninguna"],
  "redesSociales": [{
    "nombre": "Instagram",
    "url": "@juangarcia"
  }],
  "tags": ["fitness", "principiante"],
  "notas": [{
    "titulo": "Primera sesión",
    "contenido": "Cliente muy motivado",
    "fecha": "2025-02-16T15:05:59.000Z"
  }],
  "planesDePago": [{
    "_id": "65cf8a9b1234567890abcde3",
    "nombre": "Plan Mensual",
    "monto": 50,
    "estado": "activo"
  }],
  "transacciones": [{
    "_id": "65cf8a9b1234567890abcde4",
    "concepto": "Pago mensual",
    "monto": 50,
    "fecha": "2025-02-01T00:00:00.000Z",
    "estado": "completado"
  }],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-02-16T15:05:59.000Z"
};

export const ProfileService = {
  getCurrentProfile: async (): Promise<Profile> => {
    try {
      console.log('Intentando conectar con la API...');
      const response = await fetch('http://localhost:3000/api/clients/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Añade aquí cualquier header necesario como tokens de autenticación
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Datos del perfil recibidos:', data);
      return data;
    } catch (error) {
      console.error('Error en getCurrentProfile:', error);
      
      // En desarrollo, devolvemos datos mock si la API no está disponible
      if (process.env.NODE_ENV === 'development') {
        console.log('Usando datos mock en desarrollo');
        return mockProfileData;
      }
      
      throw error;
    }
  },

  updateProfile: async (profile: Partial<Profile>): Promise<Profile> => {
    try {
      console.log('Intentando actualizar el perfil...');
      const response = await fetch('http://localhost:3000/api/clients/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Añade aquí cualquier header necesario como tokens de autenticación
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Perfil actualizado:', data);
      return data;
    } catch (error) {
      console.error('Error en updateProfile:', error);
      
      // En desarrollo, simulamos una actualización exitosa
      if (process.env.NODE_ENV === 'development') {
        console.log('Simulando actualización en desarrollo');
        return {
          ...mockProfileData,
          ...profile,
          updatedAt: new Date().toISOString()
        };
      }
      
      throw error;
    }
  }
};