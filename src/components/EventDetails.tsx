import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";
import { Dialogs } from "@nativescript/core";
import { CalendarEvent } from '../types/calendar';

type EventDetailsProps = {
    route: RouteProp<MainStackParamList, "EventDetails">,
    navigation: FrameNavigationProp<MainStackParamList, "EventDetails">,
};

export function EventDetails({ route, navigation }: EventDetailsProps) {
    const { event } = route.params;
    console.log('[EventDetails] Received event data:', event);

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        
        return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`;
    };

    const formatTime = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const getEventTypeColor = (type: string): { bg: string, text: string } => {
        switch (type.toLowerCase()) {
            case 'nutrition':
                return { bg: 'bg-green-100', text: 'text-green-800' };
            case 'training':
                return { bg: 'bg-blue-100', text: 'text-blue-800' };
            case 'evaluation':
                return { bg: 'bg-purple-100', text: 'text-purple-800' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-800' };
        }
    };

    const colors = getEventTypeColor(event.type);

    console.log('[EventDetails] Rendering component with event:', event);

    return (
        <gridLayout rows="auto, *" columns="*" className="page bg-gray-50">
            {/* Header */}
            <gridLayout row={0} columns="auto, *" className="bg-[#95cfe0] p-4">
                <image
                    col={0}
                    className="h-6 w-6 mr-2"
                    src="~/imagenes/left-arrow.png"
                    onTap={() => navigation.goBack()}
                />
                <stackLayout col={1}>
                    <label className="text-2xl font-bold text-black">{event.title}</label>
                    {event.description && (
                        <label className="text-base text-black">{event.description}</label>
                    )}
                </stackLayout>
            </gridLayout>

            {/* Content */}
            <scrollView row={1}>
                <stackLayout className="p-4">
                    {/* Event Type Badge */}
                    <gridLayout columns="auto" className="mb-4">
                        <label col={0} className={`px-3 py-1 rounded-full mr-2 ${colors.bg} ${colors.text}`}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </label>
                    </gridLayout>

                    {/* Date and Time */}
                    <stackLayout className="bg-white p-4 rounded-xl mb-4">
                        <label className="text-lg font-bold mb-2">Fecha y Hora</label>
                        <label className="text-gray-600">{formatDate(event.start)}</label>
                        <label className="text-gray-600">{formatTime(event.start)} - {formatTime(event.end)}</label>
                    </stackLayout>

                    {/* Client Info */}
                    {event.client && (
                        <stackLayout className="bg-white p-4 rounded-xl mb-4">
                            <label className="text-lg font-bold mb-2">Cliente</label>
                            <label className="text-gray-600">Nombre: {event.client.name}</label>
                        </stackLayout>
                    )}

                    {/* Description */}
                    {event.description && (
                        <stackLayout className="bg-white p-4 rounded-xl mb-4">
                            <label className="text-lg font-bold mb-2">Descripción</label>
                            <label className="text-gray-600">{event.description}</label>
                        </stackLayout>
                    )}
                </stackLayout>
            </scrollView>
        </gridLayout>
    );
}