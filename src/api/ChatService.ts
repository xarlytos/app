export interface ChatMessage {
    id: number;
    sender: string;
    message: string;
    timestamp: string;
}

const mockMessages: ChatMessage[] = [
    {
        id: 1,
        sender: "Entrenador",
        message: "Hola María, ¿cómo te encuentras hoy?",
        timestamp: "2023-10-22T09:00:00Z"
    },
    {
        id: 2,
        sender: "Cliente",
        message: "Hola David, me siento bien, un poco cansada pero lista para entrenar.",
        timestamp: "2023-10-22T09:01:00Z"
    },
    {
        id: 3,
        sender: "Entrenador",
        message: "Excelente. ¿Tienes alguna molestia o dolor que deba saber antes de empezar?",
        timestamp: "2023-10-22T09:02:00Z"
    },
    {
        id: 4,
        sender: "Cliente",
        message: "Solo un poco de tensión en los hombros, pero nada serio.",
        timestamp: "2023-10-22T09:03:00Z"
    },
    {
        id: 5,
        sender: "Entrenador",
        message: "Entiendo. Haremos un calentamiento enfocado en esa área. Comencemos con unos estiramientos suaves.",
        timestamp: "2023-10-22T09:04:00Z"
    },
    {
        id: 6,
        sender: "Cliente",
        message: "Perfecto, suena bien.",
        timestamp: "2023-10-22T09:05:00Z"
    },
    {
        id: 7,
        sender: "Entrenador",
        message: "¿Cómo se sienten tus hombros ahora después de los estiramientos?",
        timestamp: "2023-10-22T09:20:00Z"
    },
    {
        id: 8,
        sender: "Cliente",
        message: "Mucho mejor, la tensión ha disminuido.",
        timestamp: "2023-10-22T09:21:00Z"
    },
    {
        id: 9,
        sender: "Entrenador",
        message: "Genial. Entonces, pasemos a los ejercicios de fuerza que tenemos programados.",
        timestamp: "2023-10-22T09:22:00Z"
    },
    {
        id: 10,
        sender: "Cliente",
        message: "De acuerdo, estoy lista.",
        timestamp: "2023-10-22T09:23:00Z"
    },
    {
        id: 11,
        sender: "Entrenador",
        message: "Recuerda mantener la postura correcta durante las sentadillas. Si sientes alguna molestia, avísame.",
        timestamp: "2023-10-22T09:24:00Z"
    },
    {
        id: 12,
        sender: "Cliente",
        message: "Sí, lo tendré en cuenta.",
        timestamp: "2023-10-22T09:25:00Z"
    },
    {
        id: 13,
        sender: "Entrenador",
        message: "Excelente trabajo hoy, María. Has mejorado mucho.",
        timestamp: "2023-10-22T10:00:00Z"
    },
    {
        id: 14,
        sender: "Cliente",
        message: "Gracias, David. Me siento más fuerte cada semana.",
        timestamp: "2023-10-22T10:01:00Z"
    },
    {
        id: 15,
        sender: "Entrenador",
        message: "Nos vemos en la próxima sesión. No olvides hacer los estiramientos en casa.",
        timestamp: "2023-10-22T10:02:00Z"
    },
    {
        id: 16,
        sender: "Cliente",
        message: "Claro, lo haré. ¡Hasta luego!",
        timestamp: "2023-10-22T10:03:00Z"
    }
];

export const ChatService = {
    getMessages: (): Promise<ChatMessage[]> => {
        return Promise.resolve(mockMessages);
    },

    sendMessage: (message: string): Promise<ChatMessage> => {
        const newMessage: ChatMessage = {
            id: mockMessages.length + 1,
            sender: "Cliente",
            message,
            timestamp: new Date().toISOString()
        };
        mockMessages.push(newMessage);
        return Promise.resolve(newMessage);
    }
};