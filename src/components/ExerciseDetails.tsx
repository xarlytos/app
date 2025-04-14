import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";
import { Exercise, Set } from "../api/RoutineService";

type ExerciseDetailsProps = {
    route: RouteProp<MainStackParamList, "ExerciseDetails">,
    navigation: FrameNavigationProp<MainStackParamList, "ExerciseDetails">,
};

export function ExerciseDetails({ route, navigation }: ExerciseDetailsProps) {
    const { exercise } = route.params;

    return (
        <gridLayout rows="auto, *" columns="*" className="page bg-gray-100">
            <gridLayout row={0} columns="auto, *" className="p-4" backgroundColor="#95cfe0">
                <image
                    col={0}
                    className="h-6 w-6 mr-2"
                    src="~/imagenes/left-arrow.png"
                    onTap={() => navigation.goBack()}
                />
                <label col={1} className="text-2xl font-bold text-center text-black">{exercise.nombre}</label>
            </gridLayout>

            <scrollView row={1} className="p-4">
                <stackLayout>
                    {/* Series y repeticiones */}
                    <gridLayout className="bg-white rounded-xl shadow-md p-4 mb-4">
                        <stackLayout>
                            <label className="text-xl font-bold text-black mb-2">Series y Repeticiones</label>
                            {exercise.sets && exercise.sets.map((set: Set, index: number) => (
                                <gridLayout key={index} className="bg-[#95cfe0]/10 p-3 rounded-lg mb-2">
                                    <stackLayout>
                                        <label className="text-lg font-bold text-gray-800 mb-1">Serie {index + 1}</label>
                                        <gridLayout columns="auto, auto, auto" className="gap-2">
                                            <label col={0} className="text-gray-600 bg-white px-3 py-1 rounded">
                                                {set.reps} reps
                                            </label>
                                            <label col={1} className="text-gray-600 bg-white px-3 py-1 rounded">
                                                {set.peso}kg
                                            </label>
                                            {set.rir && (
                                                <label col={2} className="text-gray-600 bg-white px-3 py-1 rounded">
                                                    RIR {set.rir}
                                                </label>
                                            )}
                                        </gridLayout>
                                    </stackLayout>
                                </gridLayout>
                            ))}
                        </stackLayout>
                    </gridLayout>

                    {/* Información básica */}
                    <gridLayout className="bg-white rounded-xl shadow-md p-4 mb-4">
                        <stackLayout>
                            <label className="text-xl font-bold text-black mb-2">Información Básica</label>
                            <gridLayout columns="auto, *" className="mt-2">
                                <label col={0} className="text-gray-600 mr-2">Tipo:</label>
                                <label col={1} className="text-gray-600 font-medium">{exercise.tipo}</label>
                            </gridLayout>
                            <gridLayout columns="auto, *" className="mt-2">
                                <label col={0} className="text-gray-600 mr-2">Equipo:</label>
                                <label col={1} className="text-gray-600 font-medium">{exercise.equipo}</label>
                            </gridLayout>
                            <gridLayout columns="auto, *" className="mt-2">
                                <label col={0} className="text-gray-600 mr-2">Grupos Musculares:</label>
                                <label col={1} className="text-gray-600 font-medium">
                                    {Array.isArray(exercise.grupoMuscular) ? exercise.grupoMuscular.join(", ") : exercise.grupoMuscular}
                                </label>
                            </gridLayout>
                        </stackLayout>
                    </gridLayout>

                    {/* Descripción */}
                    <gridLayout className="bg-white rounded-xl shadow-md p-4 mb-4">
                        <stackLayout>
                            <label className="text-xl font-bold text-black mb-2">Descripción</label>
                            <label className="text-gray-600" textWrap={true}>{exercise.descripcion}</label>
                        </stackLayout>
                    </gridLayout>

                    {/* Imagen del ejercicio */}
                    {exercise.imgUrl && (
                        <gridLayout className="bg-white rounded-xl shadow-md p-4 mb-4">
                            <stackLayout>
                                <label className="text-xl font-bold text-black mb-2">Demostración</label>
                                <image
                                    src={exercise.imgUrl}
                                    stretch="aspectFill"
                                    className="w-full h-48 rounded-lg"
                                    loadMode="async"
                                />
                            </stackLayout>
                        </gridLayout>
                    )}

                    {/* Consejos */}
                    <gridLayout className="bg-white rounded-xl shadow-md p-4 mb-4">
                        <stackLayout>
                            <label className="text-xl font-bold text-black mb-2">Consejos de Ejecución</label>
                            <label className="text-gray-600" textWrap={true}>
                                {exercise.consejos?.map((consejo, index) => (
                                    `• ${consejo}${index < exercise.consejos.length - 1 ? '\n' : ''}`
                                )).join('')}
                            </label>
                        </stackLayout>
                    </gridLayout>

                    {/* Precauciones */}
                    <gridLayout className="bg-white rounded-xl shadow-md p-4 mb-4">
                        <stackLayout>
                            <label className="text-xl font-bold text-black mb-2">Precauciones</label>
                            <label className="text-gray-600" textWrap={true}>
                                {exercise.precauciones?.map((precaucion, index) => (
                                    `• ${precaucion}${index < exercise.precauciones.length - 1 ? '\n' : ''}`
                                )).join('')}
                            </label>
                        </stackLayout>
                    </gridLayout>
                </stackLayout>
            </scrollView>
        </gridLayout>
    );
}