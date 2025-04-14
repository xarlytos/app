import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";
import { ObservableArray, Color, DatePicker, Screen, ImageSource } from '@nativescript/core';
import { DietService, Dieta, Comida, Macros } from '../api/DietService';

type NutritionProps = {
    route: RouteProp<MainStackParamList, "Nutrition">,
    navigation: FrameNavigationProp<MainStackParamList, "Nutrition">,
};

export function Nutrition({ navigation }: NutritionProps) {
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [comidasDelDia, setComidasDelDia] = React.useState<Comida[]>([]);
    const [restricciones, setRestricciones] = React.useState<Macros | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        console.log('Nutrition: useEffect iniciado con fecha:', selectedDate);
        loadComidas();
    }, [selectedDate]);

    const loadComidas = async () => {
        try {
            console.log('Nutrition: Iniciando loadComidas para fecha:', selectedDate);
            setLoading(true);
            
            const dietaActual = await DietService.getDietaActual();
            console.log('Nutrition: Dieta actual recibida:', dietaActual);

            if (!dietaActual) {
                console.log('Nutrition: No hay dieta activa');
                return;
            }

            // Buscar el día en la dieta actual
            const fechaBuscada = selectedDate.toISOString().split('T')[0];
            console.log('Nutrition: Buscando comidas para fecha:', fechaBuscada);
            
            let diaEncontrado = null;
            
            for (const semana of dietaActual.semanas) {
                console.log('Nutrition: Revisando semana:', semana.numero);
                diaEncontrado = semana.dias.find(dia => {
                    const diaFecha = dia.fecha.split('T')[0];
                    console.log('Nutrition: Comparando fechas:', { 
                        diaFecha, 
                        fechaBuscada, 
                        coincide: diaFecha === fechaBuscada 
                    });
                    return diaFecha === fechaBuscada;
                });
                if (diaEncontrado) break;
            }

            if (diaEncontrado) {
                console.log('Nutrition: Día encontrado:', diaEncontrado);
                console.log('Nutrition: Comidas del día:', diaEncontrado.comidas);
                console.log('Nutrition: Restricciones del día:', diaEncontrado.restricciones);
                setComidasDelDia(diaEncontrado.comidas);
                setRestricciones(diaEncontrado.restricciones);
            } else {
                console.log('Nutrition: No se encontraron comidas para la fecha');
                setComidasDelDia([]);
                setRestricciones(null);
            }
        } catch (error) {
            console.error('Nutrition: Error cargando comidas:', error);
        } finally {
            setLoading(false);
        }
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

    const changeDate = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        console.log('Nutrition: Cambiando fecha a:', newDate);
        setSelectedDate(newDate);
    };

    const goToToday = () => {
        const today = new Date();
        console.log('Nutrition: Volviendo a hoy:', today);
        setSelectedDate(today);
    };

    const showMealDetails = (comida: Comida) => {
        console.log('Nutrition: Navegando a detalles de comida:', comida);
        navigation.navigate('MealDetails', { comida });
    };

    const calcularProgresoMacros = () => {
        if (!restricciones || comidasDelDia.length === 0) {
            console.log('Nutrition: No hay datos para calcular macros');
            return {
                calorias: 0,
                proteinas: 0,
                carbohidratos: 0,
                grasas: 0
            };
        }

        console.log('Nutrition: Calculando macros para comidas:', comidasDelDia);
        const totalMacros = comidasDelDia.reduce((total, comida) => {
            const macrosComida = DietService.calcularMacros(comida.alimentos);
            console.log('Nutrition: Macros para comida', comida.nombre, ':', macrosComida);
            return {
                calorias: total.calorias + macrosComida.calorias,
                proteinas: total.proteinas + macrosComida.proteinas,
                carbohidratos: total.carbohidratos + macrosComida.carbohidratos,
                grasas: total.grasas + macrosComida.grasas
            };
        }, {
            calorias: 0,
            proteinas: 0,
            carbohidratos: 0,
            grasas: 0
        });

        console.log('Nutrition: Total macros calculados:', totalMacros);
        return totalMacros;
    };

    const getProgressBarWidth = (actual: number, objetivo: number) => {
        const porcentaje = Math.min((actual / objetivo) * 100, 100);
        console.log('Nutrition: Calculando progreso:', { actual, objetivo, porcentaje });
        return `${porcentaje}%`;
    };

    const macrosTotales = calcularProgresoMacros();
    console.log('Nutrition: Renderizando con macros totales:', macrosTotales);

    return (
        <gridLayout rows="auto, *" className="page bg-gray-50">
            <gridLayout row={0} rows="auto, auto" columns="*" className="bg-[#95cfe0] p-4">
                <gridLayout row={0} columns="auto, *, auto" className="mb-4">
                    <image
                        col={0}
                        className="h-6 w-6 mr-2"
                        src="~/imagenes/left-arrow.png"
                        onTap={() => navigation.goBack()}
                    />
                    <label col={1} className="text-2xl font-bold text-center text-black">Nutrición</label>
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

            <scrollView row={1} className="px-4 pt-4">
                {loading ? (
                    <activityIndicator busy={true} className="m-20" />
                ) : comidasDelDia.length > 0 ? (
                    <stackLayout>
                        {/* Resumen de macros del día */}
                        <gridLayout className="bg-white p-6 rounded-2xl mb-4 elevation-3">
                            <stackLayout>
                                <label className="text-xl font-bold text-black mb-4">Resumen del día</label>
                                
                                {restricciones && (
                                    <gridLayout rows="auto, auto, auto, auto" className="mb-3">
                                        {/* Calorías */}
                                        <gridLayout row={0} columns="*, auto" className="mb-4">
                                            <stackLayout col={0}>
                                                <gridLayout columns="auto, *">
                                                    <label col={0} className="text-sm font-bold text-[#2196F3] mb-1">Calorías</label>
                                                    <label col={1} className="text-xs text-[#2196F3] text-right font-bold">
                                                        {Math.round(macrosTotales.calorias)} / {restricciones.calorias} kcal
                                                    </label>
                                                </gridLayout>
                                                <gridLayout className="h-4 bg-[#E3F2FD] rounded-full">
                                                    <stackLayout className="bg-[#2196F3] rounded-full" horizontalAlignment="left"
                                                                width={getProgressBarWidth(macrosTotales.calorias, restricciones.calorias)} />
                                                </gridLayout>
                                            </stackLayout>
                                        </gridLayout>
                                        
                                        {/* Proteínas */}
                                        <gridLayout row={1} columns="*, auto" className="mb-4">
                                            <stackLayout col={0}>
                                                <gridLayout columns="auto, *">
                                                    <label col={0} className="text-sm font-bold text-[#F44336] mb-1">Proteínas</label>
                                                    <label col={1} className="text-xs text-[#F44336] text-right font-bold">
                                                        {Math.round(macrosTotales.proteinas)} / {restricciones.proteinas} g
                                                    </label>
                                                </gridLayout>
                                                <gridLayout className="h-4 bg-[#FFEBEE] rounded-full">
                                                    <stackLayout className="bg-[#F44336] rounded-full" horizontalAlignment="left"
                                                                width={getProgressBarWidth(macrosTotales.proteinas, restricciones.proteinas)} />
                                                </gridLayout>
                                            </stackLayout>
                                        </gridLayout>
                                        
                                        {/* Carbohidratos */}
                                        <gridLayout row={2} columns="*, auto" className="mb-4">
                                            <stackLayout col={0}>
                                                <gridLayout columns="auto, *">
                                                    <label col={0} className="text-sm font-bold text-[#FF9800] mb-1">Carbohidratos</label>
                                                    <label col={1} className="text-xs text-[#FF9800] text-right font-bold">
                                                        {Math.round(macrosTotales.carbohidratos)} / {restricciones.carbohidratos} g
                                                    </label>
                                                </gridLayout>
                                                <gridLayout className="h-4 bg-[#FFF3E0] rounded-full">
                                                    <stackLayout className="bg-[#FF9800] rounded-full" horizontalAlignment="left"
                                                                width={getProgressBarWidth(macrosTotales.carbohidratos, restricciones.carbohidratos)} />
                                                </gridLayout>
                                            </stackLayout>
                                        </gridLayout>
                                        
                                        {/* Grasas */}
                                        <gridLayout row={3} columns="*, auto" className="mb-2">
                                            <stackLayout col={0}>
                                                <gridLayout columns="auto, *">
                                                    <label col={0} className="text-sm font-bold text-[#4CAF50] mb-1">Grasas</label>
                                                    <label col={1} className="text-xs text-[#4CAF50] text-right font-bold">
                                                        {Math.round(macrosTotales.grasas)} / {restricciones.grasas} g
                                                    </label>
                                                </gridLayout>
                                                <gridLayout className="h-4 bg-[#E8F5E9] rounded-full">
                                                    <stackLayout className="bg-[#4CAF50] rounded-full" horizontalAlignment="left"
                                                                width={getProgressBarWidth(macrosTotales.grasas, restricciones.grasas)} />
                                                </gridLayout>
                                            </stackLayout>
                                        </gridLayout>
                                    </gridLayout>
                                )}
                            </stackLayout>
                        </gridLayout>
                        
                        {comidasDelDia.map((comida, index) => (
                            <gridLayout key={index} 
                                      className="bg-white p-4 rounded-lg mb-4 elevation-1"
                                      onTap={() => showMealDetails(comida)}>
                                <stackLayout>
                                    <gridLayout columns="auto,*,auto" className="mb-3">
                                        <stackLayout col={0} className="mr-3 bg-[#95cfe0]/10 rounded-full p-2">
                                            <label className="text-2xl">
                                                {comida.nombre === 'Desayuno' ? '🍳' :
                                                 comida.nombre === 'Almuerzo' ? '🥗' :
                                                 comida.nombre === 'Comida' ? '🍽️' :
                                                 comida.nombre === 'Merienda' ? '🫖' :
                                                 comida.nombre === 'Cena' ? '🌙' : '🍴'}
                                            </label>
                                        </stackLayout>
                                        <stackLayout col={1}>
                                            <label className="text-lg font-bold text-black">{comida.nombre}</label>
                                            <label className="text-sm text-gray-600">{comida.hora}</label>
                                        </stackLayout>
                                        <stackLayout col={2} className="text-right">
                                            <label className="text-lg font-bold text-black">
                                                {Math.round(DietService.calcularMacros(comida.alimentos).calorias)}
                                            </label>
                                            <label className="text-sm text-gray-600">kcal</label>
                                        </stackLayout>
                                    </gridLayout>

                                    <stackLayout className="ml-12">
                                        {comida.alimentos.map((alimento, idx) => (
                                            <gridLayout key={idx} columns="*,auto" className="mb-1">
                                                <label col={0} className="text-gray-600">
                                                    {alimento.cantidad}{alimento.unidad} {alimento.nombre}
                                                </label>
                                                <label col={1} className="text-sm text-gray-500">
                                                    {Math.round(alimento.macros.calorias)} kcal
                                                </label>
                                            </gridLayout>
                                        ))}
                                    </stackLayout>

                                    <gridLayout columns="*,*,*" className="ml-12 mt-3 pt-3 border-t border-gray-200">
                                        <label col={0} className="text-xs text-gray-500">
                                            P: {Math.round(DietService.calcularMacros(comida.alimentos).proteinas)}g
                                        </label>
                                        <label col={1} className="text-xs text-gray-500">
                                            C: {Math.round(DietService.calcularMacros(comida.alimentos).carbohidratos)}g
                                        </label>
                                        <label col={2} className="text-xs text-gray-500">
                                            G: {Math.round(DietService.calcularMacros(comida.alimentos).grasas)}g
                                        </label>
                                    </gridLayout>
                                </stackLayout>
                            </gridLayout>
                        ))}
                    </stackLayout>
                ) : (
                    <stackLayout className="bg-white p-8 rounded-lg elevation-1">
                        <label className="text-xl font-bold text-black text-center mb-2">
                            Sin comidas programadas
                        </label>
                        <label className="text-base text-gray-600 text-center">
                            No hay comidas planificadas para este día
                        </label>
                    </stackLayout>
                )}
            </scrollView>
        </gridLayout>
    );
}
