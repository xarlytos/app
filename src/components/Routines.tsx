import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";
import { Screen } from '@nativescript/core';
import { RoutineService, Planning } from '../api/RoutineService';

type RoutinesProps = {
    route: RouteProp<MainStackParamList, "Routines">,
    navigation: FrameNavigationProp<MainStackParamList, "Routines">,
};

export function Routines({ navigation }: RoutinesProps) {
    const [routines, setRoutines] = React.useState<Planning[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchRoutines = async () => {
            try {
                console.log('Routines: Starting to fetch routines...');
                const data = await RoutineService.getRoutines();
                console.log('Routines: Successfully fetched routines:', data);
                setRoutines(data);
            } catch (err) {
                console.error('Routines: Error fetching routines:', err);
                setError('Error al cargar las rutinas');
            } finally {
                setLoading(false);
            }
        };

        fetchRoutines();
    }, []);

    const [selectedDate, setSelectedDate] = React.useState(new Date());

    const changeDate = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        setSelectedDate(newDate);
    };

    const goToToday = () => {
        setSelectedDate(new Date());
    };

    const formatDate = (date: Date) => {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
        const diaSemana = dias[date.getDay()];
        const dia = date.getDate();
        const mes = meses[date.getMonth()];
        const año = date.getFullYear();
    
        return `${diaSemana} ${dia} de ${mes} ${año}`;
    };

    const getRoutineForSelectedDate = (planning: Planning, date: Date) => {
        try {
            // Convertir la fecha de inicio a objeto Date
            const startDate = new Date(planning.fechaInicio);
            
            // Calcular la diferencia en días
            const diffTime = date.getTime() - startDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            // Si la fecha es anterior a la fecha de inicio, retornar null
            if (diffDays < 0) return null;
            
            // Si no hay plan o días definidos, retornar null
            if (!planning.plan?.days || planning.plan.days.length === 0) return null;
            
            // Calcular el número total de días en el plan
            const totalDays = planning.plan.days.length;
            
            // Si hemos superado el número total de días del plan, retornar null
            if (diffDays >= totalDays) return null;
            
            // Obtener el día correspondiente sin repetición
            const dayIndex = diffDays;
            
            // Verificar si hay un plan para ese día
            if (planning.plan.days[dayIndex]?.sessions?.length > 0) {
                return planning.plan.days[dayIndex];
            }
            
            return null;
        } catch (error) {
            console.error('Error en getRoutineForSelectedDate:', error);
            return null;
        }
    };

    return (
        <gridLayout rows="auto, auto, *" columns="*" className="page bg-gray-50">
            <gridLayout row={0} rows="auto, auto" columns="*" className="bg-[#95cfe0] p-4">
                <gridLayout row={0} columns="auto, *, auto" className="mb-4">
                    <image
                        col={0}
                        className="h-6 w-6 mr-2"
                        src="~/imagenes/left-arrow.png"
                        onTap={() => navigation.goBack()}
                    />
                    <label col={1} className="text-2xl font-bold text-center text-black">Entrenamiento</label>
                    <button col={2} className="text-sm text-purple-700 bg-white/20 rounded-xl w-10 h-10 text-center font-bold" onTap={goToToday}>
                        HOY
                    </button>
                </gridLayout>

                <gridLayout row={1} columns="auto, *, auto" className="bg-white rounded-full p-2">
                    <image
                        col={0}
                        className="h-7 w-7 bg-gray-200 rounded-full"
                        src="~/imagenes/left.png"
                        onTap={() => changeDate(-1)}
                    />
                    <label col={1} className="text-lg text-center text-black font-medium">{formatDate(selectedDate)}</label>
                    <image
                        col={2}
                        className="h-7 w-7 bg-gray-200 rounded-full"
                        src="~/imagenes/next.png"
                        onTap={() => changeDate(1)}
                    />
                </gridLayout>
            </gridLayout>

            <scrollView row={2} className="px-4 pt-4">
                {loading ? (
                    <activityIndicator busy={true} className="m-20" />
                ) : error ? (
                    <label className="text-red-500 text-center m-20">{error}</label>
                ) : routines.length === 0 ? (
                    <label className="text-gray-500 text-center m-20">No hay rutinas disponibles</label>
                ) : (
                    <stackLayout>
                        {routines.map((planning, index) => {
                            const dayRoutine = getRoutineForSelectedDate(planning, selectedDate);
                            if (!dayRoutine?.sessions?.[0]?.exercises?.length) return null;

                            const firstSession = dayRoutine.sessions[0];
                            const firstExercise = firstSession.exercises[0];

                            return (
                                <gridLayout key={index} className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6 elevation-3">
                                    <stackLayout>
                                        <gridLayout className="p-6 bg-[#95cfe0]/10">
                                            <stackLayout>
                                                <label className="text-3xl font-bold text-black mb-2">
                                                    {firstExercise?.exercise?.nombre || 'Ejercicio sin nombre'}
                                                </label>
                                                <label className="text-lg text-gray-600">{planning.nombre}</label>
                                            </stackLayout>
                                        </gridLayout>

                                        {dayRoutine.sessions.map((session, sessionIndex) => (
                                            <stackLayout key={sessionIndex} className="p-6">
                                                {session.exercises?.map((exerciseWithSets, exerciseIndex) => (
                                                    <gridLayout key={exerciseIndex} 
                                                              className="bg-white rounded-2xl shadow-lg mb-3 p-5 elevation-2"
                                                              onTap={() => navigation.navigate("ExerciseDetails", { 
                                                                  exercise: exerciseWithSets.exercise 
                                                              })}>
                                                        <stackLayout>
                                                            <gridLayout columns="*, auto">
                                                                <label col={0} className="text-lg font-bold text-black">
                                                                    {exerciseWithSets.exercise?.nombre || 'Ejercicio sin nombre'}
                                                                </label>
                                                                <label col={1} className="text-blue-500 text-sm">Ver más →</label>
                                                            </gridLayout>
                                                            <gridLayout columns="auto, auto, auto" className="mt-3">
                                                                <stackLayout col={0} className="bg-[#95cfe0]/10 rounded-xl px-4 py-2">
                                                                    <label className="text-sm text-[#95cfe0] font-bold">
                                                                        {exerciseWithSets.sets?.length || 0} series
                                                                    </label>
                                                                </stackLayout>
                                                                <stackLayout col={1} className="bg-[#95cfe0]/10 rounded-xl px-4 py-2 ml-2">
                                                                    <label className="text-sm text-[#95cfe0] font-bold">
                                                                        {exerciseWithSets.sets?.[0]?.reps || 0} reps
                                                                    </label>
                                                                </stackLayout>
                                                                <stackLayout col={2} className="bg-[#95cfe0]/10 rounded-xl px-4 py-2 ml-2">
                                                                    <label className="text-sm text-[#95cfe0] font-bold">
                                                                        {exerciseWithSets.sets?.[0]?.peso || 0}kg
                                                                    </label>
                                                                </stackLayout>
                                                            </gridLayout>
                                                        </stackLayout>
                                                    </gridLayout>
                                                ))}
                                                
                                                <button className="bg-blue-500 text-black p-4 rounded-2xl text-lg font-bold shadow-xl mt-4" 
                                                        onTap={() => navigation.navigate("WorkoutSession", { 
                                                            planning,
                                                            dayRoutine,
                                                            session 
                                                        })}>
                                                    COMENZAR ENTRENAMIENTO
                                                </button>
                                            </stackLayout>
                                        ))}
                                    </stackLayout>
                                </gridLayout>
                            );
                        })}
                        
                        {routines.every(planning => !getRoutineForSelectedDate(planning, selectedDate)) && (
                            <gridLayout className="bg-white rounded-3xl shadow-xl p-8 elevation-3">
                                <stackLayout>
                                    <label className="text-xl font-bold text-center text-gray-800 mb-2">
                                        No hay entrenamiento programado para este día
                                    </label>
                                    <label className="text-gray-500 text-center">
                                        Selecciona otro día o contacta con tu entrenador
                                    </label>
                                </stackLayout>
                            </gridLayout>
                        )}
                    </stackLayout>
                )}
            </scrollView>
        </gridLayout>
    );
}