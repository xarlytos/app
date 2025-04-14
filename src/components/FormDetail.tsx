import * as React from 'react';
import { RouteProp } from '@react-navigation/core';
import { FrameNavigationProp } from 'react-nativescript-navigation';
import { MainStackParamList } from '../NavigationParamList';
import { Navbar } from './Navbar';
import { FormService, Form, Question } from '../api/FormService';

type FormDetailProps = {
    route: RouteProp<MainStackParamList, 'FormDetail'>;
    navigation: FrameNavigationProp<MainStackParamList, 'FormDetail'>;
};

export function FormDetail({ route, navigation }: FormDetailProps) {
    const [form, setForm] = React.useState<Form | undefined>();
    const [answers, setAnswers] = React.useState<{ [key: string]: string }>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);

    React.useEffect(() => {
        loadForm();
    }, []);

    const loadForm = async () => {
        const formData = await FormService.getFormById(route.params.formId);
        setForm(formData);
    };

    const handleAnswer = (questionId: string, answer: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const renderQuestion = (question: Question) => {
        switch (question.type) {
            case 'text':
                return (
                    <textField
                        hint="Escribe tu respuesta aquí"
                        text={answers[question.id] || ''}
                        fontSize={16}
                        padding={10}
                        backgroundColor="#f8f9fa"
                        borderRadius={8}
                        marginTop={10}
                        onTextChange={(args) => handleAnswer(question.id, args.object.text)}
                    />
                );
            case 'multiple_choice':
                return (
                    <stackLayout marginTop={10}>
                        {question.options?.map((option, index) => (
                            <button
                                key={index}
                                text={option}
                                className={answers[question.id] === option ? '-primary' : '-outline'}
                                margin={{ top: 5, bottom: 5 }}
                                onTap={() => handleAnswer(question.id, option)}
                            />
                        ))}
                    </stackLayout>
                );
            case 'yes_no':
                return (
                    <gridLayout 
                        columns="*, *"
                        marginTop={10}
                    >
                        <button
                            col={0}
                            text="Sí"
                            className={answers[question.id] === 'Sí' ? '-primary' : '-outline'}
                            margin={5}
                            onTap={() => handleAnswer(question.id, 'Sí')}
                        />
                        <button
                            col={1}
                            text="No"
                            className={answers[question.id] === 'No' ? '-primary' : '-outline'}
                            margin={5}
                            onTap={() => handleAnswer(question.id, 'No')}
                        />
                    </gridLayout>
                );
            default:
                return null;
        }
    };

    const isFormComplete = () => {
        return form?.questions.every(q => answers[q.id]);
    };

    const handleSubmit = async () => {
        if (form && isFormComplete()) {
            await FormService.completeForm(form.id, answers);
            navigation.navigate('Forms');
        }
    };

    const goToNextQuestion = () => {
        if (form && currentQuestionIndex < form.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    if (!form) {
        return (
            <gridLayout rows="auto, *" className="page">
                <gridLayout row={0} rows="auto, auto" columns="*" className="bg-[#95cfe0] p-4">
                    <gridLayout row={0} columns="auto, *, auto" className="mb-4">
                        <image
                            col={0}
                            className="h-6 w-6 mr-2"
                            src="~/imagenes/left-arrow.png"
                            onTap={() => navigation.goBack()}
                        />
                        <label col={1} className="text-2xl font-bold text-center text-black">Cargando...</label>
                        <label col={2} text="" />
                    </gridLayout>
                </gridLayout>
                <gridLayout row={1} className="bg-white">
                    <stackLayout className="p-20">
                        <activityIndicator 
                            busy={true} 
                            className="h-8 w-8"
                            color="#95cfe0"
                        />
                        <label className="text-gray-500 text-center mt-4 text-sm">
                            Cargando formulario...
                        </label>
                    </stackLayout>
                </gridLayout>
            </gridLayout>
        );
    }

    const currentQuestion = form.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === form.questions.length - 1;
    const canAdvance = answers[currentQuestion.id] !== undefined;

    return (
        <gridLayout rows="auto, *" className="page bg-white">
            {/* Header */}
            <gridLayout row={0} rows="auto, auto" columns="*" className="bg-[#95cfe0] p-4">
                <gridLayout row={0} columns="auto, *, auto" className="mb-4">
                    <image
                        col={0}
                        className="h-6 w-6 mr-2"
                        src="~/imagenes/left-arrow.png"
                        onTap={() => navigation.goBack()}
                    />
                    <label col={1} className="text-2xl font-bold text-center text-black">{form.title}</label>
                    <label col={2} text="" />
                </gridLayout>
            </gridLayout>

            {/* Content */}
            <scrollView row={1} className="bg-gray-50">
                <stackLayout className="p-4">
                    {/* Progress Bar */}
                    <gridLayout className="h-2 bg-gray-200 rounded-full mb-4">
                        <gridLayout
                            className="bg-[#95cfe0] rounded-full h-2"
                            horizontalAlignment="left"
                            width={`${((currentQuestionIndex + 1) / form.questions.length) * 100}%`}
                        />
                    </gridLayout>

                    <label
                        className="text-sm text-gray-600 mb-4 text-center"
                        text={`Pregunta ${currentQuestionIndex + 1} de ${form.questions.length}`}
                    />

                    {/* Question Card */}
                    <gridLayout className="bg-white rounded-xl p-6 shadow-sm mb-4">
                        <stackLayout>
                            <label
                                text={currentQuestion.text}
                                className="text-lg font-bold text-[#2D3748] mb-6"
                                textWrap={true}
                            />
                            
                            {/* Question Input */}
                            {currentQuestion.type === 'text' ? (
                                <textField
                                    hint="Escribe tu respuesta aquí"
                                    text={answers[currentQuestion.id] || ''}
                                    className="bg-gray-50 rounded-lg p-4 text-base text-gray-700"
                                    onTextChange={(args) => handleAnswer(currentQuestion.id, args.object.text)}
                                />
                            ) : currentQuestion.type === 'multiple_choice' ? (
                                <stackLayout>
                                    {currentQuestion.options?.map((option, index) => (
                                        <button
                                            key={index}
                                            className={`p-4 rounded-lg mb-3 ${
                                                answers[currentQuestion.id] === option 
                                                    ? 'bg-[#95cfe0] text-white' 
                                                    : 'bg-gray-50 text-gray-700'
                                            }`}
                                            onTap={() => handleAnswer(currentQuestion.id, option)}
                                        >
                                            <formattedString>
                                                <span className="font-medium">{option}</span>
                                            </formattedString>
                                        </button>
                                    ))}
                                </stackLayout>
                            ) : (
                                <gridLayout columns="*, *" className="mt-2">
                                    <button
                                        col={0}
                                        className={`mx-2 p-4 rounded-lg ${
                                            answers[currentQuestion.id] === 'Sí'
                                                ? 'bg-[#95cfe0] text-white'
                                                : 'bg-gray-50 text-gray-700'
                                        }`}
                                        onTap={() => handleAnswer(currentQuestion.id, 'Sí')}
                                    >
                                        <formattedString>
                                            <span className="font-medium">Sí</span>
                                        </formattedString>
                                    </button>
                                    <button
                                        col={1}
                                        className={`mx-2 p-4 rounded-lg ${
                                            answers[currentQuestion.id] === 'No'
                                                ? 'bg-[#95cfe0] text-white'
                                                : 'bg-gray-50 text-gray-700'
                                        }`}
                                        onTap={() => handleAnswer(currentQuestion.id, 'No')}
                                    >
                                        <formattedString>
                                            <span className="font-medium">No</span>
                                        </formattedString>
                                    </button>
                                </gridLayout>
                            )}
                        </stackLayout>
                    </gridLayout>

                    {/* Navigation Buttons */}
                    <gridLayout columns="auto, *" className="mt-4">
                        <button
                            col={0}
                            className={`px-6 py-3 rounded-lg ${
                                currentQuestionIndex > 0
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'bg-gray-50 text-gray-400'
                            }`}
                            isEnabled={currentQuestionIndex > 0}
                            onTap={goToPreviousQuestion}
                        >
                            <formattedString>
                                <span className="font-medium">ANTERIOR</span>
                            </formattedString>
                        </button>
                        {isLastQuestion ? (
                            <button
                                col={1}
                                className={`ml-3 px-6 py-3 rounded-lg ${
                                    isFormComplete()
                                        ? 'bg-[#95cfe0] text-white'
                                        : 'bg-gray-100 text-gray-400'
                                }`}
                                isEnabled={isFormComplete()}
                                onTap={handleSubmit}
                            >
                                <formattedString>
                                    <span className="font-medium">FINALIZAR</span>
                                </formattedString>
                            </button>
                        ) : (
                            <button
                                col={1}
                                className={`ml-3 px-6 py-3 rounded-lg ${
                                    canAdvance
                                        ? 'bg-[#95cfe0] text-white'
                                        : 'bg-gray-100 text-gray-400'
                                }`}
                                isEnabled={canAdvance}
                                onTap={goToNextQuestion}
                            >
                                <formattedString>
                                    <span className="font-medium">SIGUIENTE</span>
                                </formattedString>
                            </button>
                        )}
                    </gridLayout>
                </stackLayout>
            </scrollView>
        </gridLayout>
    );
}
