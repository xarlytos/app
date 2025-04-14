import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";
import { DietService, Comida, Macros } from '../api/DietService';

type MealDetailsProps = {
    route: RouteProp<MainStackParamList, "MealDetails">,
    navigation: FrameNavigationProp<MainStackParamList, "MealDetails">,
};

export function MealDetails({ route, navigation }: MealDetailsProps) {
    const { comida } = route.params;
    const macrosTotales = React.useMemo(() => 
        DietService.calcularMacros(comida.alimentos),
        [comida]
    );

    const getMealIcon = (nombre: string) => {
        switch (nombre) {
            case 'Desayuno': return '🍳';
            case 'Almuerzo': return '🥗';
            case 'Comida': return '🍽️';
            case 'Merienda': return '🫖';
            case 'Cena': return '🌙';
            default: return '🍴';
        }
    };

    return (
        <gridLayout rows="auto,*" columns="*" className="page bg-gray-100">
            {/* Header */}
            <gridLayout row={0} columns="auto,*" className="p-4" backgroundColor="#95cfe0">
                <gridLayout col={0} width="40" height="40" className="justify-center items-center" onTap={() => navigation.goBack()}>
                    <image
                        className="h-6 w-6"
                        src="~/imagenes/left-arrow.png"
                    />
                </gridLayout>
                <stackLayout col={1} className="ml-4">
                    <label className="text-2xl font-bold text-black">{comida.nombre}</label>
                    <label className="text-sm text-black/70">{comida.hora}</label>
                </stackLayout>
            </gridLayout>

            <scrollView row={1}>
                <stackLayout className="p-4">
                    {/* Resumen de la comida */}
                    <gridLayout rows="auto,auto,auto" className="bg-white p-6 rounded-2xl mb-4 elevation-1">
                        {/* Encabezado con icono */}
                        <gridLayout row={0} columns="auto,*" className="mb-6">
                            <gridLayout col={0} width="60" height="60" className="mr-4 bg-[#95cfe0]/10 rounded-2xl justify-center items-center">
                                <label className="text-4xl">{getMealIcon(comida.nombre)}</label>
                            </gridLayout>
                            <stackLayout col={1} verticalAlignment="middle">
                                <label className="text-xl font-bold text-black">{comida.nombre}</label>
                                <label className="text-sm text-gray-600 mt-1">{comida.hora}</label>
                            </stackLayout>
                        </gridLayout>

                        {/* Calorías totales */}
                        <gridLayout row={1} className="bg-[#95cfe0]/10 p-6 rounded-xl mb-6">
                            <stackLayout horizontalAlignment="center">
                                <label className="text-sm text-gray-600 text-center">Calorías Totales</label>
                                <label className="text-3xl font-bold text-black text-center mt-1">
                                    {Math.round(macrosTotales.calorias)}
                                </label>
                                <label className="text-sm text-gray-600 text-center">kcal</label>
                            </stackLayout>
                        </gridLayout>

                        {/* Macros */}
                        <stackLayout row={2} className="bg-gray-50 rounded-xl p-6">
                            <label className="text-sm text-gray-600 mb-4">Macronutrientes</label>
                            
                            {/* Progress bars for macros */}
                            <gridLayout rows="auto,auto,auto" className="mt-2">
                                {/* Proteínas */}
                                <gridLayout row={0} columns="90,*,40" className="mb-4">
                                    <label col={0} className="text-sm text-gray-600">Proteínas</label>
                                    <gridLayout col={1} className="bg-gray-200 rounded-full h-2 mx-3">
                                        <stackLayout 
                                            className="h-2 rounded-full"
                                            backgroundColor="#95cfe0"
                                            horizontalAlignment="left"
                                            width={`${(macrosTotales.proteinas / 50) * 100}%`}
                                        />
                                    </gridLayout>
                                    <label col={2} className="text-sm font-bold text-black text-right">
                                        {Math.round(macrosTotales.proteinas)}g
                                    </label>
                                </gridLayout>

                                {/* Carbohidratos */}
                                <gridLayout row={1} columns="90,*,40" className="mb-4">
                                    <label col={0} className="text-sm text-gray-600">Carbos</label>
                                    <gridLayout col={1} className="bg-gray-200 rounded-full h-2 mx-3">
                                        <stackLayout 
                                            className="h-2 rounded-full"
                                            backgroundColor="#95cfe0"
                                            horizontalAlignment="left"
                                            width={`${(macrosTotales.carbohidratos / 65) * 100}%`}
                                        />
                                    </gridLayout>
                                    <label col={2} className="text-sm font-bold text-black text-right">
                                        {Math.round(macrosTotales.carbohidratos)}g
                                    </label>
                                </gridLayout>

                                {/* Grasas */}
                                <gridLayout row={2} columns="90,*,40">
                                    <label col={0} className="text-sm text-gray-600">Grasas</label>
                                    <gridLayout col={1} className="bg-gray-200 rounded-full h-2 mx-3">
                                        <stackLayout 
                                            className="h-2 rounded-full"
                                            backgroundColor="#95cfe0"
                                            horizontalAlignment="left"
                                            width={`${(macrosTotales.grasas / 20) * 100}%`}
                                        />
                                    </gridLayout>
                                    <label col={2} className="text-sm font-bold text-black text-right">
                                        {Math.round(macrosTotales.grasas)}g
                                    </label>
                                </gridLayout>
                            </gridLayout>
                        </stackLayout>
                    </gridLayout>

                    {/* Lista de Alimentos */}
                    <label className="text-xl font-bold text-black mb-4">Alimentos</label>
                    <stackLayout className="mx-0">
                        {comida.alimentos.map((alimento, index) => (
                            <gridLayout key={index} rows="auto,auto" className="bg-white p-6 rounded-lg mb-4 elevation-1">
                                <gridLayout row={0} columns="*,auto" className="mb-4">
                                    <stackLayout col={0}>
                                        <label className="text-lg font-bold text-black">{alimento.nombre}</label>
                                        <label className="text-sm text-gray-600 mt-1">
                                            {alimento.cantidad} {alimento.unidad}
                                        </label>
                                    </stackLayout>
                                    <stackLayout col={1} horizontalAlignment="right">
                                        <label className="text-lg font-bold text-black">
                                            {Math.round(alimento.macros.calorias)}
                                        </label>
                                        <label className="text-xs text-gray-500">kcal</label>
                                    </stackLayout>
                                </gridLayout>

                                <gridLayout row={1} columns="*,*,*" className="pt-4 border-t border-gray-200">
                                    <stackLayout col={0} className="text-center">
                                        <label className="text-xs text-gray-500">Proteínas</label>
                                        <label className="text-sm font-bold text-black mt-1">
                                            {Math.round(alimento.macros.proteinas)}g
                                        </label>
                                    </stackLayout>
                                    <stackLayout col={1} className="text-center border-x border-gray-200">
                                        <label className="text-xs text-gray-500">Carbos</label>
                                        <label className="text-sm font-bold text-black mt-1">
                                            {Math.round(alimento.macros.carbohidratos)}g
                                        </label>
                                    </stackLayout>
                                    <stackLayout col={2} className="text-center">
                                        <label className="text-xs text-gray-500">Grasas</label>
                                        <label className="text-sm font-bold text-black mt-1">
                                            {Math.round(alimento.macros.grasas)}g
                                        </label>
                                    </stackLayout>
                                </gridLayout>
                            </gridLayout>
                        ))}
                    </stackLayout>
                </stackLayout>
            </scrollView>
        </gridLayout>
    );
}