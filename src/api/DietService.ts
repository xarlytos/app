import { dietData } from './mockData';

export interface Macros {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
}

export interface Alimento {
    nombre: string;
    cantidad: number;
    unidad: string;
    macros: Macros;
}

export interface Comida {
    nombre: string;
    hora: string;
    alimentos: Alimento[];
}

export interface Restricciones extends Macros {}

export interface Dia {
    fecha: string;
    restricciones: Restricciones;
    comidas: Comida[];
}

export interface Semana {
    numero: number;
    dias: Dia[];
}

export interface Cliente {
    _id: string;
    nombre: string;
    email: string;
}

export interface Trainer {
    _id: string;
    nombre: string;
    email: string;
    especialidad: string;
}

export interface Dieta {
    _id: string;
    nombre: string;
    descripcion: string;
    cliente: Cliente;
    trainer: Trainer;
    fechaInicio: string;
    fechaFin: string;
    estado: string;
    semanas: Semana[];
}

const mockDieta: Dieta = {
    "_id": "65cf8a9b1234567890abcde1",
    "nombre": "Dieta Equilibrada",
    "descripcion": "Plan nutricional equilibrado",
    "cliente": {
        "_id": "65cf8a9b1234567890abcde2",
        "nombre": "María García",
        "email": "maria@ejemplo.com"
    },
    "trainer": {
        "_id": "65cf8a9b1234567890abcde3",
        "nombre": "Juan Pérez",
        "email": "juan@ejemplo.com",
        "especialidad": "Nutrición deportiva"
    },
    "fechaInicio": "2025-02-16T15:02:56.000Z",
    "fechaFin": "2025-03-16T15:02:56.000Z",
    "estado": "activo",
    "semanas": [
        {
            "numero": 1,
            "dias": [
                {
                    "fecha": "2025-02-16T15:02:56.000Z",
                    "restricciones": {
                        "calorias": 2000,
                        "proteinas": 150,
                        "carbohidratos": 250,
                        "grasas": 70
                    },
                    "comidas": [
                        {
                            "nombre": "Desayuno",
                            "hora": "08:00",
                            "alimentos": [
                                {
                                    "nombre": "Avena",
                                    "cantidad": 100,
                                    "unidad": "g",
                                    "macros": {
                                        "calorias": 389,
                                        "proteinas": 16.9,
                                        "carbohidratos": 66.3,
                                        "grasas": 6.9
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "fecha": "2025-03-01T15:02:56.000Z",
                    "restricciones": {
                        "calorias": 2000,
                        "proteinas": 150,
                        "carbohidratos": 250,
                        "grasas": 70
                    },
                    "comidas": [
                        {
                            "nombre": "Desayuno",
                            "hora": "08:00",
                            "alimentos": [
                                {
                                    "nombre": "Avena con plátano",
                                    "cantidad": 100,
                                    "unidad": "g",
                                    "macros": {
                                        "calorias": 389,
                                        "proteinas": 16.9,
                                        "carbohidratos": 66.3,
                                        "grasas": 6.9
                                    }
                                },
                                {
                                    "nombre": "Proteína en polvo",
                                    "cantidad": 30,
                                    "unidad": "g",
                                    "macros": {
                                        "calorias": 120,
                                        "proteinas": 24,
                                        "carbohidratos": 3,
                                        "grasas": 1.5
                                    }
                                }
                            ]
                        },
                        {
                            "nombre": "Almuerzo",
                            "hora": "11:00",
                            "alimentos": [
                                {
                                    "nombre": "Yogur griego",
                                    "cantidad": 200,
                                    "unidad": "g",
                                    "macros": {
                                        "calorias": 130,
                                        "proteinas": 20,
                                        "carbohidratos": 4,
                                        "grasas": 4
                                    }
                                }
                            ]
                        },
                        {
                            "nombre": "Comida",
                            "hora": "14:00",
                            "alimentos": [
                                {
                                    "nombre": "Pechuga de pollo",
                                    "cantidad": 200,
                                    "unidad": "g",
                                    "macros": {
                                        "calorias": 330,
                                        "proteinas": 62,
                                        "carbohidratos": 0,
                                        "grasas": 7.2
                                    }
                                },
                                {
                                    "nombre": "Arroz integral",
                                    "cantidad": 150,
                                    "unidad": "g",
                                    "macros": {
                                        "calorias": 540,
                                        "proteinas": 12,
                                        "carbohidratos": 112.5,
                                        "grasas": 4.2
                                    }
                                }
                            ]
                        },
                        {
                            "nombre": "Merienda",
                            "hora": "17:00",
                            "alimentos": [
                                {
                                    "nombre": "Almendras",
                                    "cantidad": 30,
                                    "unidad": "g",
                                    "macros": {
                                        "calorias": 180,
                                        "proteinas": 6,
                                        "carbohidratos": 6,
                                        "grasas": 15
                                    }
                                }
                            ]
                        },
                        {
                            "nombre": "Cena",
                            "hora": "21:00",
                            "alimentos": [
                                {
                                    "nombre": "Salmón",
                                    "cantidad": 150,
                                    "unidad": "g",
                                    "macros": {
                                        "calorias": 306,
                                        "proteinas": 33,
                                        "carbohidratos": 0,
                                        "grasas": 18
                                    }
                                },
                                {
                                    "nombre": "Ensalada mixta",
                                    "cantidad": 200,
                                    "unidad": "g",
                                    "macros": {
                                        "calorias": 40,
                                        "proteinas": 2,
                                        "carbohidratos": 8,
                                        "grasas": 0
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "fecha": "2025-02-19T15:02:56.000Z",
                    "restricciones": {
                        "calorias": 2000,
                        "proteinas": 150,
                        "carbohidratos": 250,
                        "grasas": 70
                    },
                    "comidas": [
                        {
                            "nombre": "Desayuno",
                            "hora": "08:00",
                            "alimentos": [
                                {
                                    "nombre": "Tostadas integrales",
                                    "cantidad": 80,
                                    "unidad": "g",
                                    "macros": {
                                        "calorias": 220,
                                        "proteinas": 8,
                                        "carbohidratos": 40,
                                        "grasas": 4
                                    }
                                },
                                {
                                    "nombre": "Huevos revueltos",
                                    "cantidad": 150,
                                    "unidad": "g",
                                    "macros": {
                                        "calorias": 245,
                                        "proteinas": 20,
                                        "carbohidratos": 2,
                                        "grasas": 17
                                    }
                                }
                            ]
                        },
                        {
                            "nombre": "Almuerzo",
                            "hora": "11:00",
                            "alimentos": [
                                {
                                    "nombre": "Batido de proteínas",
                                    "cantidad": 300,
                                    "unidad": "ml",
                                    "macros": {
                                        "calorias": 150,
                                        "proteinas": 25,
                                        "carbohidratos": 5,
                                        "grasas": 3
                                    }
                                }
                            ]
                        },
                        {
                            "nombre": "Comida",
                            "hora": "14:00",
                            "alimentos": [
                                {
                                    "nombre": "Atún a la plancha",
                                    "cantidad": 180,
                                    "unidad": "g",
                                    "macros": {
                                        "calorias": 270,
                                        "proteinas": 54,
                                        "carbohidratos": 0,
                                        "grasas": 6
                                    }
                                },
                                {
                                    "nombre": "Quinoa",
                                    "cantidad": 150,
                                    "unidad": "g",
                                    "macros": {
                                        "calorias": 180,
                                        "proteinas": 6,
                                        "carbohidratos": 32,
                                        "grasas": 3
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "fecha": "2025-02-20T15:02:56.000Z",
                    "restricciones": {
                        "calorias": 2000,
                        "proteinas": 150,
                        "carbohidratos": 250,
                        "grasas": 70
                    },
                    "comidas": [
                        {
                            "nombre": "Desayuno",
                            "hora": "08:00",
                            "alimentos": [
                                {
                                    "nombre": "Yogur con granola",
                                    "cantidad": 250,
                                    "unidad": "g",
                                    "macros": {
                                        "calorias": 280,
                                        "proteinas": 15,
                                        "carbohidratos": 45,
                                        "grasas": 8
                                    }
                                },
                                {
                                    "nombre": "Plátano",
                                    "cantidad": 120,
                                    "unidad": "g",
                                    "macros": {
                                        "calorias": 105,
                                        "proteinas": 1.3,
                                        "carbohidratos": 27,
                                        "grasas": 0.3
                                    }
                                }
                            ]
                        },
                        {
                            "nombre": "Almuerzo",
                            "hora": "11:00",
                            "alimentos": [
                                {
                                    "nombre": "Sandwich de pavo",
                                    "cantidad": 180,
                                    "unidad": "g",
                                    "macros": {
                                        "calorias": 320,
                                        "proteinas": 22,
                                        "carbohidratos": 38,
                                        "grasas": 9
                                    }
                                }
                            ]
                        },
                        {
                            "nombre": "Comida",
                            "hora": "14:00",
                            "alimentos": [
                                {
                                    "nombre": "Pechuga de pavo",
                                    "cantidad": 200,
                                    "unidad": "g",
                                    "macros": {
                                        "calorias": 280,
                                        "proteinas": 58,
                                        "carbohidratos": 0,
                                        "grasas": 4
                                    }
                                },
                                {
                                    "nombre": "Pasta integral",
                                    "cantidad": 150,
                                    "unidad": "g",
                                    "macros": {
                                        "calorias": 195,
                                        "proteinas": 7,
                                        "carbohidratos": 41,
                                        "grasas": 1
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

export const DietService = {
    getAllDietas: async (): Promise<Dieta[]> => {
        try {
            console.log('DietService: Iniciando getAllDietas');
            const response = await fetch('http://localhost:3000/api/dietas');
            console.log('DietService: Status de respuesta getAllDietas:', response.status);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('DietService: Datos recibidos getAllDietas:', data);
            return data;
        } catch (error) {
            console.error('DietService: Error en getAllDietas:', error);
            console.log('DietService: Usando datos mock en desarrollo');
            if (process.env.NODE_ENV === 'development') {
                console.log('DietService: Mock data:', mockDieta);
                return [mockDieta];
            }
            throw error;
        }
    },

    getDietaById: async (id: string): Promise<Dieta> => {
        try {
            console.log(`DietService: Iniciando getDietaById para ID: ${id}`);
            const response = await fetch(`http://localhost:3000/api/dietas/${id}`);
            console.log('DietService: Status de respuesta getDietaById:', response.status);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('DietService: Dieta recibida por ID:', data);
            return data;
        } catch (error) {
            console.error('DietService: Error en getDietaById:', error);
            console.log('DietService: Usando datos mock en desarrollo');
            if (process.env.NODE_ENV === 'development') {
                console.log('DietService: Mock data:', mockDieta);
                return mockDieta;
            }
            throw error;
        }
    },

    getDietaActual: async (): Promise<Dieta | null> => {
        try {
            console.log('DietService: Iniciando getDietaActual');
            const dietas = await DietService.getAllDietas();
            console.log('DietService: Dietas obtenidas:', dietas);
            
            const dietaActiva = dietas.find(d => d.estado === 'activo');
            console.log('DietService: Dieta activa encontrada:', dietaActiva);
            
            return dietaActiva || null;
        } catch (error) {
            console.error('DietService: Error en getDietaActual:', error);
            throw error;
        }
    },

    getComidaDelDia: async (fecha: Date): Promise<Comida[]> => {
        try {
            console.log('DietService: Iniciando getComidaDelDia para fecha:', fecha);
            const dietaActual = await DietService.getDietaActual();
            
            if (!dietaActual) {
                console.log('DietService: No hay dieta activa');
                return [];
            }

            const fechaBuscada = fecha.toISOString().split('T')[0];
            console.log('DietService: Buscando comidas para fecha:', fechaBuscada);
            
            for (const semana of dietaActual.semanas) {
                console.log('DietService: Revisando semana:', semana.numero);
                const diaEncontrado = semana.dias.find(dia => {
                    const diaFecha = dia.fecha.split('T')[0];
                    console.log('DietService: Comparando fechas:', {
                        diaFecha,
                        fechaBuscada,
                        coincide: diaFecha === fechaBuscada
                    });
                    return diaFecha === fechaBuscada;
                });
                
                if (diaEncontrado) {
                    console.log('DietService: Comidas encontradas:', diaEncontrado.comidas);
                    return diaEncontrado.comidas;
                }
            }
            
            console.log('DietService: No se encontraron comidas para la fecha');
            return [];
        } catch (error) {
            console.error('DietService: Error en getComidaDelDia:', error);
            throw error;
        }
    },

    calcularMacros: (alimentos: Alimento[]): Macros => {
        console.log('DietService: Calculando macros para alimentos:', alimentos);
        const total = alimentos.reduce((total, alimento) => {
            console.log('DietService: Sumando macros de alimento:', alimento.nombre, alimento.macros);
            return {
                calorias: total.calorias + alimento.macros.calorias,
                proteinas: total.proteinas + alimento.macros.proteinas,
                carbohidratos: total.carbohidratos + alimento.macros.carbohidratos,
                grasas: total.grasas + alimento.macros.grasas
            };
        }, {
            calorias: 0,
            proteinas: 0,
            carbohidratos: 0,
            grasas: 0
        });
        
        console.log('DietService: Total macros calculados:', total);
        return total;
    }
};