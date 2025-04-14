export interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    type: string;
    description?: string;
    client?: {
        id: string;
        name: string;
    };
}
