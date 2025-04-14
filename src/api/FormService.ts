import { knownFolders } from '@nativescript/core';

export interface Form {
    id: string;
    title: string;
    questions: Question[];
    completed: boolean;
    dateCreated: string;
    dateCompleted?: string;
}

export interface Question {
    id: string;
    text: string;
    type: 'text' | 'multiple_choice' | 'yes_no';
    options?: string[];
    answer?: string;
}

class FormServiceClass {
    private forms: Form[] = [
        {
            id: '1',
            title: 'Evaluación Inicial de Fitness',
            questions: [
                {
                    id: 'q1',
                    text: '¿Cuál es tu objetivo principal de fitness?',
                    type: 'multiple_choice',
                    options: ['Pérdida de peso', 'Ganancia muscular', 'Resistencia', 'Flexibilidad']
                },
                {
                    id: 'q2',
                    text: '¿Tienes alguna lesión o condición médica?',
                    type: 'yes_no'
                },
                {
                    id: 'q3',
                    text: '¿Cuántos días a la semana puedes entrenar?',
                    type: 'multiple_choice',
                    options: ['1-2 días', '3-4 días', '5-6 días', 'Todos los días']
                }
            ],
            completed: false,
            dateCreated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 días atrás
        },
        {
            id: '2',
            title: 'Seguimiento Nutricional',
            questions: [
                {
                    id: 'q1',
                    text: '¿Cuántas comidas haces al día?',
                    type: 'multiple_choice',
                    options: ['2-3', '4-5', '6 o más']
                },
                {
                    id: 'q2',
                    text: '¿Sigues alguna dieta específica?',
                    type: 'multiple_choice',
                    options: ['Ninguna', 'Vegetariana', 'Vegana', 'Keto', 'Otra']
                },
                {
                    id: 'q3',
                    text: '¿Cuántos litros de agua bebes al día?',
                    type: 'text'
                }
            ],
            completed: false,
            dateCreated: new Date().toISOString()
        },
        {
            id: '3',
            title: 'Evaluación de Progreso',
            questions: [
                {
                    id: 'q1',
                    text: '¿Has notado mejoras en tu rendimiento?',
                    type: 'yes_no'
                },
                {
                    id: 'q2',
                    text: '¿Qué aspectos te gustaría mejorar?',
                    type: 'multiple_choice',
                    options: ['Fuerza', 'Resistencia', 'Flexibilidad', 'Nutrición']
                }
            ],
            completed: true,
            dateCreated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 días atrás
            dateCompleted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 días atrás
        }
    ];

    async getAllForms(): Promise<Form[]> {
        console.log('FormService: Getting all forms:', this.forms);
        return this.forms;
    }

    async getCompletedForms(): Promise<Form[]> {
        const completed = this.forms.filter(form => form.completed);
        console.log('FormService: Getting completed forms:', completed);
        return completed;
    }

    async getPendingForms(): Promise<Form[]> {
        const pending = this.forms.filter(form => !form.completed);
        console.log('FormService: Getting pending forms:', pending);
        return pending;
    }

    async getFormById(id: string): Promise<Form | undefined> {
        return this.forms.find(form => form.id === id);
    }

    async completeForm(formId: string, answers: { [key: string]: string }): Promise<void> {
        const formIndex = this.forms.findIndex(form => form.id === formId);
        if (formIndex !== -1) {
            this.forms[formIndex].questions.forEach(question => {
                question.answer = answers[question.id];
            });
            this.forms[formIndex].completed = true;
            this.forms[formIndex].dateCompleted = new Date().toISOString();
        }
    }

    getAvailableFormsCount(): number {
        const count = this.forms.filter(form => !form.completed).length;
        console.log('FormService: Getting available forms count:', count);
        return count;
    }
}

export const FormService = new FormServiceClass();
