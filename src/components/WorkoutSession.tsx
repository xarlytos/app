import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";
import { TextField, Dialogs, Modal, Screen } from "@nativescript/core";
import { RoutineService, Planning, Exercise, Set, ExerciseWithSets } from '../api/RoutineService';

type WorkoutSessionProps = {
    route: RouteProp<MainStackParamList, "WorkoutSession">,
    navigation: FrameNavigationProp<MainStackParamList, "WorkoutSession">,
};

type SetRating = 'none' | 'good' | 'medium' | 'bad';

interface SetState {
    rating: SetRating;
    showRatingOptions: boolean;
    notes: string;
    showNotes: boolean;
    actualReps?: number;
    actualWeight?: number;
}

export function WorkoutSession({ route, navigation }: WorkoutSessionProps) {
    const { planning, session } = route.params;
    const [time, setTime] = React.useState(0);
    const [isRunning, setIsRunning] = React.useState(false);
    const [setStates, setSetStates] = React.useState<{ [key: string]: SetState }>({});
    const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
    const [currentNote, setCurrentNote] = React.useState("");
    const [currentSetIndex, setCurrentSetIndex] = React.useState<string | null>(null);
    const [currentExerciseIndex, setCurrentExerciseIndex] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const currentExercise = session.exercises[currentExerciseIndex];
    const totalExercises = session.exercises.length;

    React.useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (!isRunning && time !== 0) {
            clearInterval(interval!);
        }
        return () => clearInterval(interval!);
    }, [isRunning, time]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleStartPause = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setTime(0);
        setIsRunning(false);
    };

    const toggleRatingOptions = (setId: string) => {
        setActiveDropdown(activeDropdown === setId ? null : setId);
    };

    const handleSetRating = async (exerciseId: string, setId: string, rating: SetRating) => {
        try {
            setLoading(true);
            setSetStates(prev => ({
                ...prev,
                [setId]: {
                    ...prev[setId],
                    rating,
                    showRatingOptions: false
                }
            }));
            setActiveDropdown(null);

            // Actualizar el check-in en el backend
            await RoutineService.updateSetCheckin(
                planning._id,
                setId,
                {
                    completed: true,
                    actualReps: currentExercise.sets.find(s => s._id === setId)?.reps,
                    actualWeight: currentExercise.sets.find(s => s._id === setId)?.peso,
                    notes: setStates[setId]?.notes || '',
                    rating: rating
                }
            );
        } catch (error) {
            console.error('Error al actualizar el rating:', error);
            Dialogs.alert({
                title: "Error",
                message: "No se pudo guardar la calificación del ejercicio",
                okButtonText: "OK"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async (exerciseId: string, setId: string) => {
        try {
            setLoading(true);
            if (!currentNote.trim()) return;

            setSetStates(prev => ({
                ...prev,
                [setId]: {
                    ...prev[setId],
                    notes: currentNote,
                    showNotes: false
                }
            }));
            setCurrentNote("");
            setCurrentSetIndex(null);

            // Actualizar la nota en el backend
            await RoutineService.updateSetCheckin(
                planning._id,
                setId,
                {
                    notes: currentNote,
                    completed: true,
                    actualReps: currentExercise.sets.find(s => s._id === setId)?.reps,
                    actualWeight: currentExercise.sets.find(s => s._id === setId)?.peso,
                    rating: setStates[setId]?.rating || 'none'
                }
            );
        } catch (error) {
            console.error('Error al guardar la nota:', error);
            Dialogs.alert({
                title: "Error",
                message: "No se pudo guardar la nota",
                okButtonText: "OK"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSet = async (setId: string, actualReps?: number, actualWeight?: number) => {
        try {
            setLoading(true);
            setSetStates(prev => ({
                ...prev,
                [setId]: {
                    ...prev[setId],
                    actualReps,
                    actualWeight
                }
            }));

            // Actualizar el check-in en el backend
            await RoutineService.updateSetCheckin(
                planning._id,
                setId,
                {
                    completed: true,
                    actualReps,
                    actualWeight,
                    notes: setStates[setId]?.notes || '',
                    rating: setStates[setId]?.rating || 'none'
                }
            );
        } catch (error) {
            console.error('Error al actualizar el set:', error);
            Dialogs.alert({
                title: "Error",
                message: "No se pudo actualizar el set",
                okButtonText: "OK"
            });
        } finally {
            setLoading(false);
        }
    };

    const nextExercise = async () => {
        if (currentExerciseIndex < totalExercises - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
        } else {
            // Último ejercicio completado
            try {
                setLoading(true);
                // Aquí podríamos añadir lógica adicional para marcar la sesión como completada
                Dialogs.alert({
                    title: "¡Entrenamiento Completado!",
                    message: "Has completado todos los ejercicios de esta sesión.",
                    okButtonText: "Finalizar"
                }).then(() => {
                    navigation.goBack();
                });
            } catch (error) {
                console.error('Error al finalizar el entrenamiento:', error);
                Dialogs.alert({
                    title: "Error",
                    message: "Hubo un problema al finalizar el entrenamiento",
                    okButtonText: "OK"
                });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <gridLayout rows="auto, auto, *, auto" columns="*" className="page bg-gray-50">
            <gridLayout row={0} columns="auto, *, auto" className="bg-[#95cfe0] p-4">
                <image
                    col={0}
                    className="h-6 w-6 mr-2"
                    src="~/imagenes/left-arrow.png"
                    onTap={() => navigation.goBack()}
                />
                <label col={1} className="text-2xl font-bold text-center text-black">
                    {planning.nombre}
                </label>
            </gridLayout>

            <gridLayout row={1} className="p-4 bg-white border-b border-gray-200">
                <stackLayout>
                    <label className="text-lg font-bold text-gray-800">
                        {currentExercise.exercise.nombre}
                    </label>
                    <label className="text-sm text-gray-600">
                        Ejercicio {currentExerciseIndex + 1} de {totalExercises}
                    </label>
                </stackLayout>
            </gridLayout>

            <scrollView row={2} className="p-4">
                <stackLayout>
                    <gridLayout columns="*, auto, auto" className="mb-4 bg-white p-4 rounded-xl shadow-sm">
                        <label col={0} className="text-2xl font-bold">{formatTime(time)}</label>
                        <button col={1} 
                                className={`${isRunning ? 'bg-red-500' : 'bg-green-500'} text-white p-2 rounded-lg mx-2`}
                                onTap={handleStartPause}
                                isEnabled={!loading}>
                            {isRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button col={2} 
                                className="bg-gray-500 text-white p-2 rounded-lg"
                                onTap={handleReset}
                                isEnabled={!loading}>
                            Reset
                        </button>
                    </gridLayout>

                    {currentExercise.sets.map((set, index) => (
                        <gridLayout key={set._id} className="bg-white p-4 rounded-xl shadow-sm mb-3">
                            <stackLayout>
                                <gridLayout columns="auto, *, auto" className="mb-2">
                                    <label col={0} className="text-lg font-bold">Serie {index + 1}</label>
                                    <stackLayout col={2} className="ml-2">
                                        <button className={`p-2 rounded-lg ${setStates[set._id]?.rating === 'good' ? 'bg-green-500' : 'bg-gray-200'}`}
                                                onTap={() => toggleRatingOptions(set._id)}
                                                isEnabled={!loading}>
                                            Calificar
                                        </button>
                                        {activeDropdown === set._id && (
                                            <gridLayout className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-2 z-10">
                                                <stackLayout>
                                                    <button className="p-2 bg-green-500 text-white rounded-lg mb-1"
                                                            onTap={() => handleSetRating(currentExercise.exercise._id, set._id, 'good')}
                                                            isEnabled={!loading}>
                                                        Bien
                                                    </button>
                                                    <button className="p-2 bg-yellow-500 text-white rounded-lg mb-1"
                                                            onTap={() => handleSetRating(currentExercise.exercise._id, set._id, 'medium')}
                                                            isEnabled={!loading}>
                                                        Regular
                                                    </button>
                                                    <button className="p-2 bg-red-500 text-white rounded-lg"
                                                            onTap={() => handleSetRating(currentExercise.exercise._id, set._id, 'bad')}
                                                            isEnabled={!loading}>
                                                        Mal
                                                    </button>
                                                </stackLayout>
                                            </gridLayout>
                                        )}
                                    </stackLayout>
                                </gridLayout>

                                <gridLayout columns="auto, auto, auto" className="mb-2">
                                    <textField col={0}
                                            className="bg-[#95cfe0]/10 p-2 rounded-lg"
                                            hint={`${set.reps} reps`}
                                            keyboardType="number"
                                            text={setStates[set._id]?.actualReps?.toString() || ''}
                                            onTextChange={(args) => handleUpdateSet(set._id, parseInt(args.value), setStates[set._id]?.actualWeight)}
                                            isEnabled={!loading} />
                                    <textField col={1}
                                            className="bg-[#95cfe0]/10 p-2 rounded-lg ml-2"
                                            hint={`${set.peso}kg`}
                                            keyboardType="number"
                                            text={setStates[set._id]?.actualWeight?.toString() || ''}
                                            onTextChange={(args) => handleUpdateSet(set._id, setStates[set._id]?.actualReps, parseInt(args.value))}
                                            isEnabled={!loading} />
                                    <label col={2} className="bg-[#95cfe0]/10 p-2 rounded-lg ml-2">
                                        RIR {set.rir}
                                    </label>
                                </gridLayout>

                                {currentSetIndex === set._id ? (
                                    <gridLayout columns="*, auto" className="mt-2">
                                        <textField col={0} 
                                                hint="Agregar nota..."
                                                text={currentNote}
                                                onTextChange={(args) => setCurrentNote(args.value)}
                                                className="border p-2 rounded-lg"
                                                isEnabled={!loading} />
                                        <button col={1}
                                                className="bg-blue-500 text-white p-2 rounded-lg ml-2"
                                                onTap={() => handleAddNote(currentExercise.exercise._id, set._id)}
                                                isEnabled={!loading}>
                                            Guardar
                                        </button>
                                    </gridLayout>
                                ) : (
                                    <button className="text-blue-500 text-left"
                                            onTap={() => setCurrentSetIndex(set._id)}
                                            isEnabled={!loading}>
                                        {setStates[set._id]?.notes || 'Agregar nota...'}
                                    </button>
                                )}
                            </stackLayout>
                        </gridLayout>
                    ))}
                </stackLayout>
            </scrollView>

            <button row={3} 
                    className="bg-blue-500 text-white p-4 m-4 rounded-xl text-lg font-bold"
                    onTap={nextExercise}
                    isEnabled={!loading}>
                {currentExerciseIndex < totalExercises - 1 ? 'Siguiente Ejercicio' : 'Finalizar Entrenamiento'}
            </button>

            {loading && (
                <absoluteLayout className="w-full h-full bg-black/50">
                    <activityIndicator busy={true} className="text-blue-500" />
                </absoluteLayout>
            )}
        </gridLayout>
    );
}