import { CalendarEvent } from '../types/calendar';

export class CalendarService {
    private static mockEvents: CalendarEvent[] = [
        {
            id: '1',
            title: 'Consulta Nutrición',
            start: '2025-02-20T10:00:00',
            end: '2025-02-20T11:00:00',
            type: 'nutrition',
            description: 'Primera consulta de nutrición',
            client: {
                id: 'c1',
                name: 'Juan Pérez'
            }
        },
        {
            id: '2',
            title: 'Entrenamiento Personal',
            start: '2025-02-20T15:00:00',
            end: '2025-02-20T16:00:00',
            type: 'training',
            description: 'Sesión de entrenamiento personal',
            client: {
                id: 'c2',
                name: 'María García'
            }
        },
        {
            id: '3',
            title: 'Evaluación Física',
            start: '2025-02-21T09:00:00',
            end: '2025-02-21T10:00:00',
            type: 'evaluation',
            description: 'Evaluación física trimestral',
            client: {
                id: 'c3',
                name: 'Carlos Rodríguez'
            }
        }
    ];

    static async getEventsByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
        console.log('getEventsByDateRange called with:', { 
            startDate: startDate.toISOString(), 
            endDate: endDate.toISOString() 
        });
        
        // Simulamos un delay de red
        await new Promise(resolve => setTimeout(resolve, 500));

        // Resetear las horas para comparar solo fechas
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        console.log('Adjusted date range:', {
            start: start.toISOString(),
            end: end.toISOString()
        });

        const filteredEvents = this.mockEvents.filter(event => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
            
            console.log('Comparing event:', {
                event: event.title,
                eventStart: eventStart.toISOString(),
                eventEnd: eventEnd.toISOString(),
                isInRange: eventStart >= start && eventEnd <= end
            });

            return eventStart >= start && eventEnd <= end;
        });

        console.log('Filtered events:', filteredEvents);
        return filteredEvents;
    }

    static async addEvent(event: CalendarEvent): Promise<CalendarEvent> {
        console.log('addEvent called with:', event);
        await new Promise(resolve => setTimeout(resolve, 500));
        this.mockEvents.push(event);
        return event;
    }

    static async updateEvent(event: CalendarEvent): Promise<CalendarEvent> {
        console.log('updateEvent called with:', event);
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = this.mockEvents.findIndex(e => e.id === event.id);
        if (index !== -1) {
            this.mockEvents[index] = event;
            return event;
        }
        throw new Error('Evento no encontrado');
    }

    static async deleteEvent(eventId: string): Promise<void> {
        console.log('deleteEvent called with:', eventId);
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = this.mockEvents.findIndex(e => e.id === eventId);
        if (index !== -1) {
            this.mockEvents.splice(index, 1);
            return;
        }
        throw new Error('Evento no encontrado');
    }
}
