import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";

type SettingsProps = {
    route: RouteProp<MainStackParamList, "Settings">,
    navigation: FrameNavigationProp<MainStackParamList, "Settings">,
};

export function Settings({ navigation }: SettingsProps) {
    const [expandedSection, setExpandedSection] = React.useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = React.useState("Español");
    const [notifications, setNotifications] = React.useState({
        messages: true,
        reminders: true,
        updates: false
    });

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const selectLanguage = (language: string) => {
        setSelectedLanguage(language);
        // Aquí iría la lógica para cambiar el idioma de la app
    };

    const toggleNotification = (type: 'messages' | 'reminders' | 'updates') => {
        setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
        // Aquí iría la lógica para activar/desactivar notificaciones
    };

    const handleLogout = () => {
        navigation.navigate("Login");
    };

    return (
        <gridLayout rows="auto, *, auto" columns="*" className="page bg-gray-100">
            <gridLayout row={0} columns="auto, *" className="p-4" backgroundColor="#95cfe0">
    <image
        col={0}
        className="h-6 w-6"
        src="~/imagenes/left-arrow.png"
        onTap={() => navigation.goBack()}
    />
    <label col={1} className="text-2xl font-bold text-center text-black">Ajustes</label>
</gridLayout>

            
            <scrollView row={1} className="px-4">
                <stackLayout className="mt-4">
                    <gridLayout columns="*, auto" className="bg-white p-4 rounded-lg mb-3 shadow-md" onTap={() => toggleSection('idioma')}>
                        <label col={0} className="text-lg text-black">Idioma</label>
                        <label col={1} className="text-lg text-gray-500">{expandedSection === 'idioma' ? '▲' : '▼'}</label>
                    </gridLayout>
                    {expandedSection === 'idioma' && (
                        <stackLayout className="bg-white p-4 rounded-lg mb-3 shadow-md">
                            {['Español', 'English', 'Français'].map((lang) => (
                                <gridLayout key={lang} columns="*, auto" className="p-2" onTap={() => selectLanguage(lang)}>
                                    <label col={0} className="text-lg text-black">{lang}</label>
                                    <switch col={1} checked={selectedLanguage === lang} onCheckedChange={() => selectLanguage(lang)} color="#95cfe0" />
                                </gridLayout>
                            ))}
                        </stackLayout>
                    )}
                    
                    <gridLayout columns="*, auto" className="bg-white p-4 rounded-lg mb-3 shadow-md" onTap={() => toggleSection('notificaciones')}>
                        <label col={0} className="text-lg text-black">Notificaciones</label>
                        <label col={1} className="text-lg text-gray-500">{expandedSection === 'notificaciones' ? '▲' : '▼'}</label>
                    </gridLayout>
                    {expandedSection === 'notificaciones' && (
                        <stackLayout className="bg-white p-4 rounded-lg mb-3 shadow-md">
                            {[
                                { key: 'messages', label: 'Mensajes' },
                                { key: 'reminders', label: 'Recordatorios' },
                                { key: 'updates', label: 'Actualizaciones' }
                            ].map((item) => (
                                <gridLayout key={item.key} columns="*, auto" className="p-2" onTap={() => toggleNotification(item.key as 'messages' | 'reminders' | 'updates')}>
                                    <label col={0} className="text-lg text-black">{item.label}</label>
                                    <switch col={1} checked={notifications[item.key]} color="#95cfe0" />
                                </gridLayout>
                            ))}
                        </stackLayout>
                    )}
                    
                    <gridLayout columns="*, auto" className="bg-white p-4 rounded-lg mb-3 shadow-md" onTap={() => toggleSection('contacto')}>
                        <label col={0} className="text-lg text-black">Contacta con nosotros</label>
                        <label col={1} className="text-lg text-gray-500">{expandedSection === 'contacto' ? '▲' : '▼'}</label>
                    </gridLayout>
                    {expandedSection === 'contacto' && (
                        <stackLayout className="bg-white p-4 rounded-lg mb-3 shadow-md">
                            <label className="text-lg text-black p-2">Email: soporte@astrofit.com</label>
                            <label className="text-lg text-black p-2">Teléfono: +34 123 456 789</label>
                            <button className="bg-purple-700 text-white p-3 rounded-lg text-center mt-2">Chat en vivo</button>
                        </stackLayout>
                    )}
                </stackLayout>
            </scrollView>

            <gridLayout row={2} className="p-4 bg-white border-t border-gray-200">
                <button className="bg-red-500 text-white p-4 rounded-lg text-center font-bold" onTap={handleLogout}>
                    CERRAR SESIÓN
                </button>
            </gridLayout>
        </gridLayout>
    );
}