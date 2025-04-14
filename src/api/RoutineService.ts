export interface Set {
  set: number;
  reps: string;
  percent: string;
  rest: string;
  notes: string;
  adjusted_1RM: number;
  checkin: {
    completed?: boolean;
    actualReps?: number;
    actualWeight?: number;
    notes?: string;
    timestamp?: string;
  };
}

export interface Exercise {
  nombre: string;
  tipo: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string;
  imgUrl: string;
  sets: Set[];
}

export interface Activity {
  name: string;
  type: string;
  mode: string;
  scheme: string;
  intensity: string;
  exercises: Exercise[];
}

export interface Session {
  id: string;
  nombre: string;
  actividades: Activity[];
}

export interface Day {
  id: string;
  nombre: string;
  sesiones: Session[];
}

export interface Week {
  id: string;
  nombre: string;
  dias: Day[];
}

export interface Routine {
  nombre: string;
  descripcion: string;
  creador: string;
  duracion: string;
  fechaInicio: string;
  meta: string;
  cliente: string;
  semanas: Week[];
}

export const mockRoutine: Routine = {
  nombre: "Plan de entrenamiento de fuerza con checkins vacíos",
  descripcion: "Entrenamiento avanzado con checkins configurables.",
  creador: "Entrenador Ana",
  duracion: "4",
  fechaInicio: "2024-10-28",
  meta: "Ganar masa muscular",
  cliente: "653f8fa52842a7b29e16b7d8",
  semanas: [
    {
      id: "week1",
      nombre: "Semana 1",
      dias: [
        {
          id: "day1",
          nombre: "Día 1",
          sesiones: [
            {
              id: "session1",
              nombre: "Sesión de fuerza",
              actividades: [
                {
                  name: "Entrenamiento de pecho",
                  type: "Fuerza",
                  mode: "Progresión",
                  scheme: "Pirámide",
                  intensity: "Alta",
                  exercises: [
                    {
                      nombre: "Press de banca",
                      tipo: "Resistencia",
                      grupoMuscular: ["Pecho"],
                      descripcion: "Press de banca con barra",
                      equipo: "Barra",
                      imgUrl: "https://imagen.press.banca",
                      sets: [
                        {
                          set: 1,
                          reps: "10",
                          percent: "70%",
                          rest: "90s",
                          notes: "Controlar la bajada",
                          adjusted_1RM: 100,
                          checkin: {}
                        },
                        {
                          set: 2,
                          reps: "8",
                          percent: "75%",
                          rest: "90s",
                          notes: "Aumentar velocidad",
                          adjusted_1RM: 105,
                          checkin: {}
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export interface CheckIn {
  fecha: string;
  repsCompletadas: number;
  pesoUtilizado: number;
  rirReportado: number;
  notas: string;
}

export interface Set {
  _id: string;
  reps: number;
  peso: number;
  rir: number;
  checkIns: CheckIn[];
}

export interface Exercise {
  _id: string;
  nombre: string;
  grupoMuscular: string;
  descripcion: string;
  equipo: string;
  imgUrl: string;
  consejos: string[];
  precauciones: string[];
}

export interface ExerciseWithSets {
  exercise: Exercise;
  sets: Set[];
}

export interface Session {
  exercises: ExerciseWithSets[];
}

export interface Day {
  sessions: Session[];
}

export interface Plan {
  days: Day[];
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

export interface Planning {
  _id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  meta: string;
  tipo: string;
  cliente: Cliente;
  trainer: Trainer;
  plan: Plan;
}

// First, rename the old interfaces to avoid conflicts
export interface OldSet {
  set: number;
  reps: string;
  percent: string;
  rest: string;
  notes: string;
  adjusted_1RM: number;
  checkin: {
    completed?: boolean;
    actualReps?: number;
    actualWeight?: number;
    notes?: string;
    timestamp?: string;
  };
}

export interface OldExercise {
  nombre: string;
  tipo: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string;
  imgUrl: string;
  sets: OldSet[];
}

// Update the RoutineService methods to use correct types
export const RoutineService = {
  getRoutines: async (): Promise<Planning[]> => {
    try {
      console.log('RoutineService: Starting getRoutines...');
      console.log('RoutineService: Environment:', process.env.NODE_ENV);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('RoutineService: Development mode detected');
        const mockData = mockPlannings;
        console.log('RoutineService: Returning mock data structure:', {
          dataLength: mockData.length,
          firstPlanningId: mockData[0]._id,
          daysCount: mockData[0].plan.days.length,
          exercisesCount: mockData[0].plan.days.reduce((acc, day) => 
            acc + day.sessions.reduce((sessAcc, sess) => 
              sessAcc + sess.exercises.length, 0), 0)
        });
        return mockData;
      }

      console.log('RoutineService: Attempting API call...');
      const response = await fetch('http://localhost:3000/api/clients/plannings');
      console.log('RoutineService: Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('RoutineService: API data structure:', {
        dataLength: data.length,
        firstPlanningId: data[0]?._id,
        daysCount: data[0]?.plan.days.length,
      });
      return data;
    } catch (error) {
      console.error('RoutineService: Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      const mockData = mockPlannings;
      console.log('RoutineService: Falling back to mock data with structure:', {
        dataLength: mockData.length,
        firstPlanningId: mockData[0]._id,
        daysCount: mockData[0].plan.days.length
      });
      return mockData;
    }
  },

  getCurrentRoutine: (): Routine => {
    return mockRoutine;
  },

  updateSetCheckin: (weekId: string, dayId: string, sessionId: string, exerciseIndex: number, setIndex: number, checkinData: OldSet['checkin']): void => {
    const routine = mockRoutine;
    const week = routine.semanas.find(w => w.id === weekId);
    if (!week) return;

    const day = week.dias.find(d => d.id === dayId);
    if (!day) return;

    const session = day.sesiones.find(s => s.id === sessionId);
    if (!session) return;

    const exercise = session.actividades[0]?.exercises[exerciseIndex];
    if (!exercise) return;

    exercise.sets[setIndex].checkin = {
      ...exercise.sets[setIndex].checkin,
      ...checkinData,
      timestamp: new Date().toISOString()
    };
  },

  isSetCompleted: (set: OldSet): boolean => {
    return !!set.checkin.completed;
  },

  isExerciseCompleted: (exercise: OldExercise): boolean => {
    return exercise.sets.every(set => RoutineService.isSetCompleted(set));
  },

  isSessionCompleted: (session: Session): boolean => {
    return session.actividades.every(activity => 
      activity.exercises.every(exercise => RoutineService.isExerciseCompleted(exercise))
    );
  }
};

// Mock data for development
const mockPlannings: Planning[] = [
    {
        "_id": "65cf8a9b1234567890abcde1",
        "nombre": "Plan de Fuerza - Febrero 2025",
        "descripcion": "Rutina de fuerza enfocada en hipertrofia",
        "fechaInicio": "2025-02-19",
        "meta": "Ganar fuerza y masa muscular",
        "tipo": "Fuerza",
        "cliente": {
            "_id": "65cf8a9b1234567890abcde2",
            "nombre": "Juan Pérez",
            "email": "juan@example.com"
        },
        "trainer": {
            "_id": "65cf8a9b1234567890abcde3",
            "nombre": "Ana Entrenadora",
            "email": "ana@example.com",
            "especialidad": "Entrenamiento de fuerza"
        },
        "plan": {
            "days": [
                {
                    "sessions": [
                        {
                            "exercises": [
                                {
                                    "exercise": {
                                        "_id": "65cf8a9b1234567890abcde4",
                                        "nombre": "Press de Banca",
                                        "grupoMuscular": "Pecho",
                                        "descripcion": "Ejercicio compuesto que trabaja principalmente el pecho, con participación de hombros y tríceps",
                                        "equipo": "Barra y banco plano",
                                        "imgUrl": "https://ejemplo.com/press-banca.jpg",
                                        "consejos": [
                                            "Mantén los omóplatos juntos y hacia atrás",
                                            "Mantén los pies firmes en el suelo",
                                            "Controla el movimiento tanto en la bajada como en la subida",
                                            "Respira de manera controlada: inhala en la bajada, exhala en la subida",
                                            "Mantén una ligera curva en la espalda baja"
                                        ],
                                        "precauciones": [
                                            "No dejes rebotar la barra en el pecho",
                                            "Utiliza siempre seguros en la barra",
                                            "Pide ayuda a un compañero para pesos pesados",
                                            "No arquees excesivamente la espalda",
                                            "Si sientes dolor en las articulaciones, detente"
                                        ]
                                    },
                                    "sets": [
                                        {
                                            "_id": "set1",
                                            "reps": 10,
                                            "peso": 60,
                                            "rir": 2
                                        },
                                        {
                                            "_id": "set2",
                                            "reps": 10,
                                            "peso": 60,
                                            "rir": 2
                                        },
                                        {
                                            "_id": "set3",
                                            "reps": 8,
                                            "peso": 65,
                                            "rir": 1
                                        }
                                    ]
                                },
                                {
                                    "exercise": {
                                        "_id": "65cf8a9b1234567890abcde5",
                                        "nombre": "Remo con Barra",
                                        "grupoMuscular": "Espalda",
                                        "descripcion": "Ejercicio compuesto para desarrollar la espalda y mejorar la fuerza del tren superior",
                                        "equipo": "Barra olímpica",
                                        "imgUrl": "https://ejemplo.com/remo-barra.jpg",
                                        "consejos": [
                                            "Mantén la espalda recta durante todo el movimiento",
                                            "Aprieta el core para estabilizar la postura",
                                            "Tira de la barra hacia el abdomen inferior",
                                            "Mantén los codos cerca del cuerpo",
                                            "Concéntrate en contraer los músculos de la espalda"
                                        ],
                                        "precauciones": [
                                            "No uses momentum para levantar el peso",
                                            "Evita redondear la espalda",
                                            "No levantes peso excesivo que comprometa la forma",
                                            "Mantén la cabeza en posición neutral",
                                            "Si sientes molestias en la zona lumbar, detente"
                                        ]
                                    },
                                    "sets": [
                                        {
                                            "_id": "set4",
                                            "reps": 12,
                                            "peso": 50,
                                            "rir": 2
                                        },
                                        {
                                            "_id": "set5",
                                            "reps": 12,
                                            "peso": 50,
                                            "rir": 2
                                        },
                                        {
                                            "_id": "set6",
                                            "reps": 10,
                                            "peso": 55,
                                            "rir": 1
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    {
        "_id": "65cf8a9b1234567890abcdec",
        "nombre": "Plan de Resistencia - Febrero 2025",
        "descripcion": "Rutina de resistencia cardiovascular y fuerza funcional",
        "fechaInicio": "2025-02-20",
        "meta": "Mejorar resistencia y capacidad cardiovascular",
        "tipo": "Resistencia",
        "cliente": {
            "_id": "65cf8a9b1234567890abcde2",
            "nombre": "Juan Pérez",
            "email": "juan@example.com"
        },
        "trainer": {
            "_id": "65cf8a9b1234567890abcde3",
            "nombre": "Ana Entrenadora",
            "email": "ana@example.com",
            "especialidad": "Entrenamiento de fuerza"
        },
        "plan": {
            "days": [
                {
                    "sessions": [
                        {
                            "exercises": [
                                {
                                    "exercise": {
                                        "_id": "65cf8a9b1234567890abcdf1",
                                        "nombre": "HIIT en Cinta",
                                        "grupoMuscular": "Cardio",
                                        "descripcion": "Intervalos de alta intensidad en cinta de correr para mejorar la resistencia cardiovascular",
                                        "equipo": "Cinta de correr",
                                        "imgUrl": "https://ejemplo.com/hiit-cinta.jpg",
                                        "consejos": [
                                            "Realiza un calentamiento progresivo de 5-10 minutos",
                                            "Mantén una postura erguida mientras corres",
                                            "Usa los brazos para mantener el equilibrio",
                                            "Respira de manera rítmica y controlada",
                                            "Ajusta la velocidad según tu capacidad"
                                        ],
                                        "precauciones": [
                                            "No saltes directamente a alta intensidad",
                                            "Mantente hidratado durante el ejercicio",
                                            "Si te mareas, reduce la intensidad",
                                            "Usa calzado apropiado para correr",
                                            "No te apoyes en las barandillas durante los intervalos"
                                        ]
                                    },
                                    "sets": [
                                        {
                                            "_id": "set7",
                                            "reps": 8,
                                            "peso": 0,
                                            "rir": 1,
                                            "descripcion": "30 segundos sprint / 30 segundos caminar"
                                        }
                                    ]
                                },
                                {
                                    "exercise": {
                                        "_id": "65cf8a9b1234567890abcdf2",
                                        "nombre": "Burpees",
                                        "grupoMuscular": "Full Body",
                                        "descripcion": "Ejercicio de cuerpo completo que combina sentadilla, flexión y salto",
                                        "equipo": "Ninguno",
                                        "imgUrl": "https://ejemplo.com/burpees.jpg",
                                        "consejos": [
                                            "Mantén un ritmo constante",
                                            "Aterriza suavemente en los saltos",
                                            "Mantén el core activado",
                                            "Respira de manera controlada",
                                            "Haz el movimiento completo en cada repetición"
                                        ],
                                        "precauciones": [
                                            "No sacrifiques la forma por la velocidad",
                                            "Cuida las muñecas en la posición de flexión",
                                            "Si tienes problemas de rodillas, modifica los saltos",
                                            "Toma descansos si es necesario",
                                            "No hagas rebotes en la flexión"
                                        ]
                                    },
                                    "sets": [
                                        {
                                            "_id": "set8",
                                            "reps": 15,
                                            "peso": 0,
                                            "rir": 2
                                        },
                                        {
                                            "_id": "set9",
                                            "reps": 15,
                                            "peso": 0,
                                            "rir": 2
                                        },
                                        {
                                            "_id": "set10",
                                            "reps": 12,
                                            "peso": 0,
                                            "rir": 1
                                        }
                                    ]
                                },
                                {
                                    "exercise": {
                                        "_id": "65cf8a9b1234567890abcdf3",
                                        "nombre": "Mountain Climbers",
                                        "grupoMuscular": "Core",
                                        "descripcion": "Ejercicio dinámico que trabaja el core y mejora la resistencia cardiovascular",
                                        "equipo": "Ninguno",
                                        "imgUrl": "https://ejemplo.com/mountain-climbers.jpg",
                                        "consejos": [
                                            "Mantén las caderas bajas y alineadas",
                                            "Alterna las piernas de manera controlada",
                                            "Mantén los hombros estables",
                                            "Activa el core durante todo el movimiento",
                                            "Mantén un ritmo constante"
                                        ],
                                        "precauciones": [
                                            "No arquees la espalda",
                                            "No muevas los hombros excesivamente",
                                            "Mantén la respiración constante",
                                            "Si sientes dolor en las muñecas, descansa",
                                            "No sacrifiques la forma por la velocidad"
                                        ]
                                    },
                                    "sets": [
                                        {
                                            "_id": "set11",
                                            "reps": 30,
                                            "peso": 0,
                                            "rir": 2,
                                            "descripcion": "30 segundos continuos"
                                        },
                                        {
                                            "_id": "set12",
                                            "reps": 30,
                                            "peso": 0,
                                            "rir": 2,
                                            "descripcion": "30 segundos continuos"
                                        },
                                        {
                                            "_id": "set13",
                                            "reps": 30,
                                            "peso": 0,
                                            "rir": 1,
                                            "descripcion": "30 segundos continuos"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
];