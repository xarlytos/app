import * as React from 'react';
import { RouteProp } from '@react-navigation/core';
import { FrameNavigationProp } from 'react-nativescript-navigation';
import { MainStackParamList } from '../NavigationParamList';
import { FormService, Form } from '../api/FormService';

type FormsProps = {
    route: RouteProp<MainStackParamList, 'Forms'>;
    navigation: FrameNavigationProp<MainStackParamList, 'Forms'>;
};

export function Forms({ navigation }: FormsProps) {
    const [pendingForms, setPendingForms] = React.useState<Form[]>([]);
    const [completedForms, setCompletedForms] = React.useState<Form[]>([]);
    const [activeTab, setActiveTab] = React.useState<'pending' | 'completed'>('pending');
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        console.log('Forms: Loading forms...');
        loadForms();
    }, []);

    const loadForms = async () => {
        try {
            setLoading(true);
            console.log('Forms: Fetching forms...');
            const pending = await FormService.getPendingForms();
            const completed = await FormService.getCompletedForms();
            console.log('Forms: Pending forms:', pending);
            console.log('Forms: Completed forms:', completed);
            setPendingForms(pending);
            setCompletedForms(completed);
        } catch (error) {
            console.error('Error loading forms:', error);
        } finally {
            setLoading(false);
        }
    };

    const startForm = (form: Form) => {
        navigation.navigate('FormDetail', { formId: form.id });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return `${date.getDate()} de ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    return (
        <gridLayout rows="auto, auto, *" className="page bg-gray-50">
            {/* Header */}
            <gridLayout row={0} rows="auto, auto" columns="*" className="bg-[#95cfe0] p-4">
                <gridLayout row={0} columns="auto, *, auto" className="mb-4">
                    <image
                        col={0}
                        className="h-6 w-6 mr-2"
                        src="~/imagenes/left-arrow.png"
                        onTap={() => navigation.goBack()}
                    />
                    <label col={1} className="text-2xl font-bold text-center text-black">Formularios</label>
                    <label col={2} text="" />
                </gridLayout>
            </gridLayout>
            
            {/* Tabs */}
            <gridLayout 
                row={1} 
                columns="*, *" 
                className="p-4 bg-white"
            >
                <button
                    col={0}
                    className={`mx-1 py-2.5 rounded-lg ${
                        activeTab === 'pending' 
                            ? 'bg-[#95cfe0] text-white' 
                            : 'bg-gray-100 text-gray-600'
                    }`}
                    onTap={() => setActiveTab('pending')}
                >
                    <formattedString>
                        <span className="font-medium">PENDIENTES</span>
                    </formattedString>
                </button>
                <button
                    col={1}
                    className={`mx-1 py-2.5 rounded-lg ${
                        activeTab === 'completed' 
                            ? 'bg-[#95cfe0] text-white' 
                            : 'bg-gray-100 text-gray-600'
                    }`}
                    onTap={() => setActiveTab('completed')}
                >
                    <formattedString>
                        <span className="font-medium">COMPLETADOS</span>
                    </formattedString>
                </button>
            </gridLayout>
            
            {/* Content */}
            {loading ? (
                <gridLayout row={2} className="bg-gray-50">
                    <stackLayout className="p-20">
                        <activityIndicator 
                            busy={true} 
                            className="h-8 w-8"
                            color="#95cfe0"
                        />
                        <label className="text-gray-500 text-center mt-4 text-sm">
                            Cargando formularios...
                        </label>
                    </stackLayout>
                </gridLayout>
            ) : (
                <scrollView row={2} className="bg-gray-50">
                    <stackLayout className="p-4">
                        {activeTab === 'pending' && pendingForms.length > 0 && (
                            <stackLayout>
                                {pendingForms.map(form => (
                                    <gridLayout
                                        key={form.id}
                                        rows="auto, auto"
                                        columns="*, auto"
                                        className="bg-white rounded-xl p-5 mb-3 shadow-sm"
                                    >
                                        <stackLayout row={0} col={0}>
                                            <label
                                                text={form.title || ''}
                                                className="text-lg font-semibold text-[#2D3748]"
                                                textWrap={true}
                                            />
                                        </stackLayout>
                                        <stackLayout row={1} col={0} className="mt-2">
                                            <gridLayout columns="auto, auto" className="mt-1">
                                                <image col={0} src="~/imagenes/calendar.png" className="w-4 h-4 mr-2" />
                                                <label
                                                    col={1}
                                                    text={formatDate(form.dateCreated)}
                                                    className="text-sm text-gray-500"
                                                />
                                            </gridLayout>
                                            <gridLayout columns="auto, auto" className="mt-1">
                                                <image col={0} src="~/imagenes/question.png" className="w-4 h-4 mr-2" />
                                                <label
                                                    col={1}
                                                    text={`${form.questions.length} preguntas`}
                                                    className="text-sm text-gray-500"
                                                />
                                            </gridLayout>
                                        </stackLayout>
                                        <button
                                            row={0}
                                            col={1}
                                            rowSpan={2}
                                            className="bg-[#95cfe0] text-white px-6 py-3 rounded-lg shadow-sm"
                                            onTap={() => startForm(form)}
                                        >
                                            <formattedString>
                                                <span className="font-semibold">EMPEZAR</span>
                                            </formattedString>
                                        </button>
                                    </gridLayout>
                                ))}
                            </stackLayout>
                        )}
                        
                        {/* Empty and completed states with similar styling improvements */}
                        {activeTab === 'pending' && pendingForms.length === 0 && (
                            <gridLayout className="bg-white rounded-xl p-8 shadow-sm">
                                <stackLayout verticalAlignment="middle">
                                    <image 
                                        src="~/imagenes/formularioimagen.png" 
                                        stretch="aspectFit"
                                        className="h-48 w-48" 
                                        horizontalAlignment="center"
                                        loadMode="async"
                                    />
                                    <label
                                        text="No hay formularios pendientes"
                                        className="text-center text-gray-500 font-medium mt-4"
                                    />
                                </stackLayout>
                            </gridLayout>
                        )}

                        {/* Similar improvements for completed forms section */}
                        {activeTab === 'completed' && completedForms.length > 0 && (
                            <stackLayout>
                                {completedForms.map(form => (
                                    <gridLayout
                                        key={form.id}
                                        rows="auto, auto"
                                        className="bg-white rounded-xl p-5 mb-3 shadow-sm"
                                    >
                                        <stackLayout row={0}>
                                            <label
                                                text={form.title || ''}
                                                className="text-lg font-semibold text-[#2D3748]"
                                                textWrap={true}
                                            />
                                        </stackLayout>
                                        <stackLayout row={1} className="mt-2">
                                            <gridLayout columns="auto, auto" className="mt-1">
                                                <image col={0} src="~/imagenes/calendar.png" className="w-4 h-4 mr-2" />
                                                <label
                                                    col={1}
                                                    text={`Creado: ${formatDate(form.dateCreated)}`}
                                                    className="text-sm text-gray-500"
                                                />
                                            </gridLayout>
                                            <gridLayout columns="auto, auto" className="mt-1">
                                                <image col={0} src="~/imagenes/check.png" className="w-4 h-4 mr-2" />
                                                <label
                                                    col={1}
                                                    text={`Completado: ${formatDate(form.dateCompleted || '')}`}
                                                    className="text-sm text-green-600"
                                                />
                                            </gridLayout>
                                            <gridLayout columns="auto, auto" className="mt-1">
                                                <image col={0} src="~/imagenes/question.png" className="w-4 h-4 mr-2" />
                                                <label
                                                    col={1}
                                                    text={`${form.questions.length} preguntas respondidas`}
                                                    className="text-sm text-gray-500"
                                                />
                                            </gridLayout>
                                        </stackLayout>
                                    </gridLayout>
                                ))}
                            </stackLayout>
                        )}
                        
                        {activeTab === 'completed' && completedForms.length === 0 && (
                            <gridLayout className="bg-white rounded-xl p-8 shadow-sm">
                                <stackLayout verticalAlignment="middle">
                                    <image 
                                        src="~/imagenes/formularioimagen.png" 
                                        stretch="aspectFit"
                                        className="h-48 w-48" 
                                        horizontalAlignment="center"
                                        loadMode="async"
                                    />
                                    <label
                                        text="No hay formularios completados"
                                        className="text-center text-gray-500 font-medium mt-4"
                                    />
                                </stackLayout>
                            </gridLayout>
                        )}
                    </stackLayout>
                </scrollView>
            )}
        </gridLayout>
    );
}
