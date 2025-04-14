export interface Achievement {
    _id: string;
    nombre: string;
    descripcion: string;
    icono: string;
    criterios: string;
    puntos: number;
    estado: 'desbloqueado' | 'en_progreso' | 'bloqueado';
    progreso: number;
    fechaDesbloqueo: string | null;
    trainer: string;
    createdAt: string;
    updatedAt: string;
}

const mockAchievements: Achievement[] = [
    {
        "_id": "65cf8a9b1234567890abcde1",
        "nombre": "Primera Clase",
        "descripcion": "Completa tu primera clase con un cliente",
        "icono": "first-class.png",
        "criterios": "Realizar una sesión de entrenamiento completa",
        "puntos": 100,
        "estado": "desbloqueado",
        "progreso": 100,
        "fechaDesbloqueo": "2025-02-15T10:30:00.000Z",
        "trainer": "65cf8a9b1234567890abcdef",
        "createdAt": "2025-02-01T08:00:00.000Z",
        "updatedAt": "2025-02-15T10:30:00.000Z"
    },
    {
        "_id": "65cf8a9b1234567890abcde2",
        "nombre": "Maestro del Fitness",
        "descripcion": "Completa 100 sesiones de entrenamiento",
        "icono": "fitness-master.png",
        "criterios": "Alcanzar 100 sesiones completadas",
        "puntos": 500,
        "estado": "en_progreso",
        "progreso": 45,
        "fechaDesbloqueo": null,
        "trainer": "65cf8a9b1234567890abcdef",
        "createdAt": "2025-02-01T08:00:00.000Z",
        "updatedAt": "2025-02-16T14:58:33.000Z"
    },
    {
        "_id": "65cf8a9b1234567890abcde3",
        "nombre": "Nutrición Experta",
        "descripcion": "Crea 50 planes nutricionales personalizados",
        "icono": "nutrition-expert.png",
        "criterios": "Crear 50 planes de nutrición",
        "puntos": 300,
        "estado": "bloqueado",
        "progreso": 0,
        "fechaDesbloqueo": null,
        "trainer": "65cf8a9b1234567890abcdef",
        "createdAt": "2025-02-01T08:00:00.000Z",
        "updatedAt": "2025-02-01T08:00:00.000Z"
    }
];

export const AchievementsService = {
    getAchievements: async (): Promise<Achievement[]> => {
        try {
            console.log('AchievementsService: Iniciando petición a /api/achievements');
            const response = await fetch('http://localhost:3000/api/achievements');
            
            if (!response.ok) {
                console.error('AchievementsService: Error en la respuesta HTTP:', response.status);
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('AchievementsService: Datos recibidos de la API:', data);
            return data;
        } catch (error) {
            console.error('AchievementsService: Error en getAchievements:', error);
            
            if (process.env.NODE_ENV === 'development') {
                console.log('AchievementsService: Usando datos mock en desarrollo');
                return mockAchievements;
            }
            throw error;
        }
    },

    getRecentAchievements: async (limit: number = 3): Promise<Achievement[]> => {
        try {
            console.log('AchievementsService: Obteniendo logros recientes, límite:', limit);
            const achievements = await AchievementsService.getAchievements();
            
            console.log('AchievementsService: Filtrando y ordenando logros recientes');
            const filtered = achievements
                .filter(a => a.estado === 'desbloqueado' || a.estado === 'en_progreso')
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, limit);
            
            console.log('AchievementsService: Logros recientes filtrados:', filtered);
            return filtered;
        } catch (error) {
            console.error('AchievementsService: Error en getRecentAchievements:', error);
            throw error;
        }
    }
};