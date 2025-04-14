import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";
import { Screen, Color } from "@nativescript/core";
import { CalendarService } from '../api/CalendarService';
import { CalendarEvent } from '../types/calendar';

type CalendarProps = {
    route: RouteProp<MainStackParamList, "Calendar">,
    navigation: FrameNavigationProp<MainStackParamList, "Calendar">,
};

export function Calendar({ navigation }: CalendarProps) {
    const [currentWeek, setCurrentWeek] = React.useState(new Date());
    const [events, setEvents] = React.useState<CalendarEvent[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        loadEvents();
    }, [currentWeek]);

    const loadEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('[Calendar] Getting week dates for:', currentWeek);
            const weekDates = getWeekDates(currentWeek);
            const startDate = weekDates[0];
            const endDate = weekDates[6];
            console.log('[Calendar] Fetching events for range:', { startDate, endDate });
            const weekEvents = await CalendarService.getEventsByDateRange(startDate, endDate);
            console.log('[Calendar] Events received:', weekEvents);
            setEvents(weekEvents);
        } catch (error) {
            console.error('[Calendar] Error loading events:', error);
            setError('Error al cargar los eventos. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const getWeekDates = (date: Date): Date[] => {
        const week: Date[] = [];
        const current = new Date(date);
        
        // Ajustar al domingo de la semana
        current.setDate(current.getDate() - current.getDay());
        
        // Resetear la hora a medianoche
        current.setHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            week.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        console.log('[Calendar] Week dates:', week.map(d => d.toISOString()));
        return week;
    };

    const changeWeek = (delta: number) => {
        const newDate = new Date(currentWeek);
        newDate.setDate(newDate.getDate() + (delta * 7));
        setCurrentWeek(newDate);
    };

    const getEventsForDate = (date: Date): CalendarEvent[] => {
        console.log('[Calendar] Filtering events for date:', date.toISOString());
        const filteredEvents = events.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate.toDateString() === date.toDateString();
        });
        console.log('[Calendar] Filtered events for date:', filteredEvents);
        return filteredEvents;
    };

    const formatWeekRange = (date: Date): string => {
        const weekDates = getWeekDates(date);
        const startDate = weekDates[0];
        const endDate = weekDates[6];
        const days = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
        
        return `${days[startDate.getDay()]} ${startDate.getDate()} - ${days[endDate.getDay()]} ${endDate.getDate()}`;
    };

    const getWeekNumber = (date: Date): number => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    const formatDayHeader = (date: Date): string => {
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        return days[date.getDay()];
    };

    const formatDayNumber = (date: Date): string => {
        return date.getDate().toString();
    };

    const isToday = (date: Date): boolean => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const formatTime = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const getEventTypeColor = (type: string): { bg: string, text: string, dot: string } => {
        switch (type.toLowerCase()) {
            case 'nutrition':
                return {
                    bg: 'bg-green-50',
                    text: 'text-green-800',
                    dot: 'bg-green-500'
                };
            case 'training':
                return {
                    bg: 'bg-blue-50',
                    text: 'text-blue-800',
                    dot: 'bg-blue-500'
                };
            case 'evaluation':
                return {
                    bg: 'bg-purple-50',
                    text: 'text-purple-800',
                    dot: 'bg-purple-500'
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    text: 'text-gray-800',
                    dot: 'bg-gray-500'
                };
        }
    };

    const goToToday = () => {
        setCurrentWeek(new Date());
    };

    const navigateToEventDetails = (event: CalendarEvent) => {
        navigation.navigate('EventDetails', { event });
    };

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
                    <label col={1} className="text-2xl font-bold text-center text-black">Calendario</label>
                    <button col={2} className="text-sm text-purple-700 bg-white/20 rounded-xl w-10 h-10 text-center font-bold" onTap={goToToday}>
                        HOY
                    </button>
                </gridLayout>

                <gridLayout row={1} columns="auto, *, auto" className="bg-white rounded-full p-2">
                    <image
                        col={0}
                        className="h-7 w-7 bg-gray-200 rounded-full"
                        src="~/imagenes/left.png"
                        onTap={() => changeWeek(-1)}
                    />
                    <label col={1} className="text-lg text-center text-black font-medium">
                        {formatWeekRange(currentWeek)}
                    </label>
                    <image
                        col={2}
                        className="h-7 w-7 bg-gray-200 rounded-full"
                        src="~/imagenes/next.png"
                        onTap={() => changeWeek(1)}
                    />
                </gridLayout>
            </gridLayout>

            {/* Calendar Content */}
            <scrollView row={1} className="bg-gray-100">
                <stackLayout className="p-4">
                    {loading ? (
                        <stackLayout className="p-20">
                            <activityIndicator busy={true} className="h-8 w-8" color={new Color('#3B82F6')} />
                            <label className="text-gray-500 text-center mt-4">Cargando eventos...</label>
                        </stackLayout>
                    ) : error ? (
                        <stackLayout className="p-8 bg-white rounded-xl m-4">
                            <label className="text-red-500 text-center font-medium mb-4">{error}</label>
                            <button 
                                className="bg-blue-500 text-white p-4 rounded-xl font-medium" 
                                onTap={loadEvents}
                            >
                                Reintentar
                            </button>
                        </stackLayout>
                    ) : (
                        getWeekDates(currentWeek).map((date, index) => (
                            <stackLayout key={index} className="mb-6">
                                <gridLayout columns="auto, *" className="mb-2">
                                    <stackLayout col={0} className="mr-4">
                                        <label className={`text-lg font-bold ${isToday(date) ? 'text-blue-500' : 'text-black'}`}>
                                            {formatDayNumber(date)}
                                        </label>
                                        <label className="text-sm text-gray-500">{formatDayHeader(date)}</label>
                                    </stackLayout>
                                    <stackLayout col={1}>
                                        {getEventsForDate(date).length > 0 ? (
                                            getEventsForDate(date).map((event, eventIndex) => {
                                                const colors = getEventTypeColor(event.type);
                                                return (
                                                    <gridLayout 
                                                        key={eventIndex} 
                                                        className={`${colors.bg} p-4 rounded-xl mb-2 shadow-sm border border-gray-100`} 
                                                        onTap={() => navigateToEventDetails(event)}
                                                    >
                                                        <stackLayout>
                                                            <gridLayout columns="auto, *, auto" className="mb-2">
                                                                <stackLayout col={0} className="mr-2">
                                                                    <label className={`h-2 w-2 rounded-full ${colors.dot}`} />
                                                                </stackLayout>
                                                                <label col={1} className={`font-medium ${colors.text}`}>
                                                                    {event.title}
                                                                </label>
                                                                <label col={2} className="text-gray-500 text-sm">
                                                                    {formatTime(event.start)}
                                                                </label>
                                                            </gridLayout>
                                                            {event.client && (
                                                                <label className="text-sm text-gray-500 ml-4">
                                                                    {event.client.name}
                                                                </label>
                                                            )}
                                                        </stackLayout>
                                                    </gridLayout>
                                                );
                                            })
                                        ) : (
                                            <label className="text-gray-400 text-sm p-4 text-center">
                                                No hay eventos programados
                                            </label>
                                        )}
                                    </stackLayout>
                                </gridLayout>
                            </stackLayout>
                        ))
                    )}
                </stackLayout>
            </scrollView>
        </gridLayout>
    );
}