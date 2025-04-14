import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";
import { AchievementsService, Achievement } from '../api/AchievementsService';

type AchievementsProps = {
    route: RouteProp<MainStackParamList, "Achievements">,
    navigation: FrameNavigationProp<MainStackParamList, "Achievements">,
};

export function Achievements({ navigation }: AchievementsProps) {
    const [achievements, setAchievements] = React.useState<Achievement[]>([]);
    const [showCompleted, setShowCompleted] = React.useState(false);
    const [stats, setStats] = React.useState({
        total: 0,
        completed: 0,
        percentage: 0
    });

    React.useEffect(() => {
        loadAchievements();
    }, []);

    const loadAchievements = async () => {
        try {
            console.log('Achievements: Iniciando carga de logros...');
            const achievementsData = await AchievementsService.getAchievements();
            console.log('Achievements: Datos de logros recibidos:', achievementsData);
            setAchievements(achievementsData);
            
            // Calcular estadísticas
            const completed = achievementsData.filter(a => a.estado === 'desbloqueado').length;
            const inProgress = achievementsData.filter(a => a.estado === 'en_progreso').length;
            const total = achievementsData.length;
            
            // Calcular porcentaje total incluyendo progreso parcial
            let totalProgress = 0;
            achievementsData.forEach(achievement => {
                if (achievement.estado === 'desbloqueado') {
                    totalProgress += 100; // Logro completado vale 100%
                } else if (achievement.estado === 'en_progreso') {
                    totalProgress += achievement.progreso; // Añadir el progreso parcial
                }
                // Los logros bloqueados no suman al progreso
            });
            
            // Calcular el porcentaje final
            const percentage = total > 0 ? Math.round(totalProgress / (total * 100) * 100) : 0;
            
            console.log('Achievements: Estadísticas calculadas:', { 
                completed, 
                inProgress,
                total, 
                totalProgress,
                percentage 
            });
            
            setStats({
                completed,
                total,
                percentage
            });
        } catch (error) {
            console.error('Achievements: Error cargando logros:', error);
        }
    };

    const filteredAchievements = React.useMemo(() => {
        console.log('Achievements: Filtrando logros, showCompleted:', showCompleted);
        const filtered = achievements.filter(a => 
            showCompleted ? a.estado === 'desbloqueado' : a.estado !== 'desbloqueado'
        );
        console.log('Achievements: Logros filtrados:', filtered);
        return filtered;
    }, [achievements, showCompleted]);

    const getIconForAchievement = (iconName: string) => {
        console.log('Achievements: Obteniendo icono para:', iconName);
        // Mapeo de nombres de iconos a emojis
        const iconMap: { [key: string]: string } = {
            'first-class.png': '🎯',
            'fitness-master.png': '💪',
            'nutrition-expert.png': '🥗'
        };
        const icon = iconMap[iconName] || '🏆';
        console.log('Achievements: Icono seleccionado:', icon);
        return icon;
    };

    return (
        <gridLayout rows="auto, auto, auto, *" columns="*" className="page bg-gray-50">
            <gridLayout row={0} columns="auto, *" className="p-4" backgroundColor="#95cfe0">
                <image
                    col={0}
                    className="h-6 w-6 mr-2"
                    src="~/imagenes/left-arrow.png"
                    onTap={() => navigation.goBack()}
                />
                <label col={1} className="text-2xl font-bold text-center text-black">Logros</label>
            </gridLayout>

            <stackLayout row={1} className="p-4 bg-white border-b border-gray-200">
                <gridLayout columns="*, auto" className="mb-2">
                    <label col={0} className="text-lg font-bold text-black">Progreso General</label>
                    <label col={1} className="text-lg font-bold text-black">
                        {stats.percentage}%
                    </label>
                </gridLayout>
                <gridLayout className="bg-gray-200 rounded-full h-2">
                    <stackLayout 
                        className="h-2 rounded-full"
                        backgroundColor="#95cfe0"
                        horizontalAlignment="left"
                        width={`${stats.percentage}%`}
                    />
                </gridLayout>
                <label className="text-sm text-gray-600 mt-2">
                    {stats.completed} de {stats.total} logros completados
                    {achievements.filter(a => a.estado === 'en_progreso').length > 0 && 
                        ` • ${achievements.filter(a => a.estado === 'en_progreso').length} en progreso`}
                </label>
            </stackLayout>

            <gridLayout row={2} columns="*, *" className="px-4 pt-4">
                <button col={0} 
                        className={`${!showCompleted ? 'text-white' : 'bg-gray-200 text-gray-700'} p-4 rounded-lg mx-1`}
                        backgroundColor={!showCompleted ? "#95cfe0" : undefined}
                        onTap={() => setShowCompleted(false)}>
                    En Progreso ({achievements.filter(a => a.estado !== 'desbloqueado').length})
                </button>
                <button col={1}
                        className={`${showCompleted ? 'text-white' : 'bg-gray-200 text-gray-700'} p-4 rounded-lg mx-1`}
                        backgroundColor={showCompleted ? "#95cfe0" : undefined}
                        onTap={() => setShowCompleted(true)}>
                    Completados ({achievements.filter(a => a.estado === 'desbloqueado').length})
                </button>
            </gridLayout>

            <scrollView row={3} className="p-4">
                <stackLayout>
                    {filteredAchievements.length > 0 ? (
                        filteredAchievements.map((achievement) => (
                            <gridLayout key={achievement._id} 
                                      className="bg-white mb-4 p-6 rounded-lg">
                                <stackLayout>
                                    <gridLayout columns="auto, *, auto" className="mb-4">
                                        <label col={0} className="text-3xl mr-4">{getIconForAchievement(achievement.icono)}</label>
                                        <stackLayout col={1}>
                                            <label className="text-lg font-bold text-black">{achievement.nombre}</label>
                                            <label className="text-gray-600">{achievement.descripcion}</label>
                                        </stackLayout>
                                        <label col={2} className="text-lg font-bold text-black">{achievement.puntos}pts</label>
                                    </gridLayout>

                                    {achievement.estado !== 'desbloqueado' && (
                                        <stackLayout>
                                            <gridLayout className="bg-gray-200 rounded-full h-2 mt-2">
                                                <stackLayout 
                                                    className="h-2 rounded-full"
                                                    backgroundColor="#95cfe0"
                                                    horizontalAlignment="left"
                                                    width={`${achievement.progreso}%`}
                                                />
                                            </gridLayout>
                                            <gridLayout columns="*, auto" className="mt-1">
                                                <label col={0} className="text-sm text-gray-600">{achievement.criterios}</label>
                                                <label col={1} className="text-sm font-bold text-black">{achievement.progreso}%</label>
                                            </gridLayout>
                                        </stackLayout>
                                    )}

                                    {achievement.estado === 'desbloqueado' && achievement.fechaDesbloqueo && (
                                        <label className="text-sm text-gray-600 mt-2">
                                            Completado el {new Date(achievement.fechaDesbloqueo).toLocaleDateString('es-ES')}
                                        </label>
                                    )}
                                </stackLayout>
                            </gridLayout>
                        ))
                    ) : (
                        <label className="text-center text-gray-500 p-4">
                            No hay logros {showCompleted ? 'completados' : 'en progreso'} por el momento
                        </label>
                    )}
                </stackLayout>
            </scrollView>
        </gridLayout>
    );
}