export interface MacroSummary {
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  caloriasConsumidas: number;
  caloriasObjetivo: number;
}

export interface Alimento {
  nombre: string;
  cantidad: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

export interface Comida {
  nombre: string;
  horario: string;
  alimentos: Alimento[];
}

export interface DietPlan {
  nombre: string;
  descripcion: string;
  comidas: Comida[];
}

export class NutritionService {
  static async getCurrentDietPlan(): Promise<DietPlan> {
    // In a real app, this would fetch from an API
    return {
      nombre: "Plan Equilibrado",
      descripcion: "Plan nutricional equilibrado para optimizar rendimiento y recuperación",
      comidas: [
        {
          nombre: "Desayuno",
          horario: "7:00 - 8:00",
          alimentos: [
            {
              nombre: "Avena con leche",
              cantidad: "60g avena + 250ml leche",
              calorias: 350,
              proteinas: 15,
              carbohidratos: 45,
              grasas: 10
            },
            {
              nombre: "Plátano",
              cantidad: "1 unidad mediana",
              calorias: 105,
              proteinas: 1,
              carbohidratos: 27,
              grasas: 0
            }
          ]
        },
        {
          nombre: "Media Mañana",
          horario: "10:30 - 11:00",
          alimentos: [
            {
              nombre: "Yogur griego con nueces",
              cantidad: "200g yogur + 30g nueces",
              calorias: 320,
              proteinas: 20,
              carbohidratos: 12,
              grasas: 22
            }
          ]
        },
        {
          nombre: "Almuerzo",
          horario: "13:30 - 14:30",
          alimentos: [
            {
              nombre: "Pechuga de pollo a la plancha",
              cantidad: "150g",
              calorias: 250,
              proteinas: 47,
              carbohidratos: 0,
              grasas: 5
            },
            {
              nombre: "Arroz integral",
              cantidad: "80g en crudo",
              calorias: 280,
              proteinas: 6,
              carbohidratos: 58,
              grasas: 2
            },
            {
              nombre: "Ensalada mixta",
              cantidad: "200g",
              calorias: 70,
              proteinas: 3,
              carbohidratos: 10,
              grasas: 2
            }
          ]
        },
        {
          nombre: "Merienda",
          horario: "17:00 - 17:30",
          alimentos: [
            {
              nombre: "Batido de proteínas",
              cantidad: "30g proteína + 300ml leche",
              calorias: 220,
              proteinas: 30,
              carbohidratos: 12,
              grasas: 5
            },
            {
              nombre: "Manzana",
              cantidad: "1 unidad mediana",
              calorias: 95,
              proteinas: 0,
              carbohidratos: 25,
              grasas: 0
            }
          ]
        },
        {
          nombre: "Cena",
          horario: "20:30 - 21:30",
          alimentos: [
            {
              nombre: "Salmón al horno",
              cantidad: "150g",
              calorias: 280,
              proteinas: 28,
              carbohidratos: 0,
              grasas: 18
            },
            {
              nombre: "Patata al horno",
              cantidad: "150g",
              calorias: 130,
              proteinas: 3,
              carbohidratos: 30,
              grasas: 0
            },
            {
              nombre: "Verduras salteadas",
              cantidad: "200g",
              calorias: 100,
              proteinas: 4,
              carbohidratos: 15,
              grasas: 3
            }
          ]
        }
      ]
    };
  }

  static async getDailyMacroSummary(): Promise<MacroSummary> {
    // In a real app, this would calculate based on consumed foods or fetch from an API
    return {
      proteinas: 157,
      carbohidratos: 234,
      grasas: 67,
      caloriasConsumidas: 2200,
      caloriasObjetivo: 2500
    };
  }
}