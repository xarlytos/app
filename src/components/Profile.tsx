import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";
import { ImageSource, ImageAsset, Dialogs } from "@nativescript/core";
import { ProfileService, Profile } from '../api/ProfileService';

type ProfileProps = {
    route: RouteProp<MainStackParamList, "Profile">,
    navigation: FrameNavigationProp<MainStackParamList, "Profile">,
};

export function Profile({ navigation }: ProfileProps) {
    const [profileImage, setProfileImage] = React.useState<ImageSource | null>(null);
    const [profile, setProfile] = React.useState<Profile | null>(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [formData, setFormData] = React.useState({
        nombre: '',
        email: '',
        telefono: '',
        genero: '',
        altura: 0,
        peso: 0
    });
    
    // Add state for social media editing
    const [isEditingSocial, setIsEditingSocial] = React.useState(false);
    const [socialFormData, setSocialFormData] = React.useState<{nombre: string, url: string}[]>([]);
    const [newSocial, setNewSocial] = React.useState({nombre: '', url: ''});
    
    React.useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            console.log('Cargando perfil...');
            const profileData = await ProfileService.getCurrentProfile();
            console.log('Perfil cargado:', profileData);
            setProfile(profileData);
            setFormData({
                nombre: profileData.nombre,
                email: profileData.email,
                telefono: profileData.telefono,
                genero: profileData.genero,
                altura: profileData.altura,
                peso: profileData.peso
            });
            // Initialize social media form data
            setSocialFormData([...profileData.redesSociales]);
        } catch (error) {
            console.error('Error loading profile:', error);
            Dialogs.alert({
                title: "Error",
                message: "No se pudo cargar el perfil",
                okButtonText: "OK"
            });
        }
    };

    const stats = [
        { label: "Altura", value: profile?.altura + " cm", icon: "📏" },
        { label: "Peso", value: profile?.peso + " kg", icon: "⚖️" }
    ];

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            const updatedProfile = await ProfileService.updateProfile(formData);
            setProfile(updatedProfile);
            setIsEditing(false);
            Dialogs.alert({
                title: "Éxito",
                message: "Perfil actualizado correctamente",
                okButtonText: "OK"
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            Dialogs.alert({
                title: "Error",
                message: "No se pudo actualizar el perfil",
                okButtonText: "OK"
            });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateIMC = (weight: number, height: number) => {
        const imc = weight / (height / 100) ** 2;
        return imc.toFixed(2);
    };

    const handleSocialInputChange = (index: number, field: string, value: string) => {
        setSocialFormData(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleAddSocial = () => {
        if (newSocial.nombre && newSocial.url) {
            setSocialFormData(prev => [...prev, { ...newSocial }]);
            setNewSocial({ nombre: '', url: '' });
        }
    };

    const handleRemoveSocial = (index: number) => {
        setSocialFormData(prev => prev.filter((_, i) => i !== index));
    };

    const handleSaveSocial = async () => {
        try {
            // Assuming your API has a method to update social media
            const updatedProfile = await ProfileService.updateSocialMedia(socialFormData);
            setProfile(updatedProfile);
            setIsEditingSocial(false);
            Dialogs.alert({
                title: "Éxito",
                message: "Redes sociales actualizadas correctamente",
                okButtonText: "OK"
            });
        } catch (error) {
            console.error('Error updating social media:', error);
            Dialogs.alert({
                title: "Error",
                message: "No se pudieron actualizar las redes sociales",
                okButtonText: "OK"
            });
        }
    };

    return (
        <gridLayout rows="auto,*" className="page bg-gray-100">
            {/* Header - unchanged */}
            <gridLayout row={0} className="bg-[#95cfe0] p-4">
                <gridLayout columns="auto,*" className="mb-2">
                    <image
                        col={0}
                        className="h-6 w-6 mr-2"
                        src="~/imagenes/left-arrow.png"
                        onTap={() => navigation.goBack()}
                    />
                    <label col={1} className="text-2xl font-bold text-center text-black">Perfil</label>
                </gridLayout>
            </gridLayout>

            {/* Content */}
            <scrollView row={1} className="bg-gray-100">
                {profile ? (
                    <stackLayout>
                        {/* Profile Header Card - Removed profile image */}
                        <stackLayout className="bg-white m-4 rounded-3xl elevation-2 p-4">
                            <stackLayout>
                                <label className="text-2xl font-bold text-black" text={profile.nombre} />
                                <label className="text-gray-600" text={profile.email} />
                                <gridLayout columns="auto,*" className="mt-2">
                                    <label col={0} className="text-sm font-medium text-[#95cfe0] bg-blue-50 px-3 py-1 rounded-full">
                                        {profile.tags[0] || "Cliente"}
                                    </label>
                                </gridLayout>
                            </stackLayout>

                            {/* Stats Bar - unchanged */}
                            <gridLayout columns="*,*,*" className="bg-gray-50 p-4 rounded-xl mt-4">
                                <stackLayout col={0} className="text-center">
                                    <label className="text-lg font-bold text-black">{profile.altura} cm</label>
                                    <label className="text-xs text-gray-600">Altura</label>
                                </stackLayout>
                                <stackLayout col={1} className="text-center border-l border-r border-gray-200">
                                    <label className="text-lg font-bold text-black">{profile.peso} kg</label>
                                    <label className="text-xs text-gray-600">Peso</label>
                                </stackLayout>
                                <stackLayout col={2} className="text-center">
                                    <label className="text-lg font-bold text-black">{calculateIMC(profile.peso, profile.altura)}</label>
                                    <label className="text-xs text-gray-600">IMC</label>
                                </stackLayout>
                            </gridLayout>
                        </stackLayout>

                        {/* Information Card - Renamed and expanded editing */}
                        <stackLayout className="bg-white mx-4 mb-4 p-6 rounded-3xl elevation-2">
                            <gridLayout columns="*,auto" className="mb-4">
                                <label col={0} className="text-xl font-bold text-black">Información</label>
                                <button 
                                    col={1}
                                    className="text-sm text-purple-700 bg-white/20 rounded-xl px-4 py-2 text-center font-bold"
                                    onTap={() => {
                                        if (isEditing) {
                                            handleSave();
                                        } else {
                                            setIsEditing(true);
                                        }
                                    }}
                                >
                                    {isEditing ? "Guardar" : "Editar"}
                                </button>
                            </gridLayout>
                            {isEditing ? (
                                <stackLayout>
                                    <textField
                                        text={formData.nombre}
                                        hint="Nombre"
                                        className="input p-3 bg-gray-50 rounded-xl mb-3"
                                        onTextChange={(args) => handleInputChange('nombre', args.value)}
                                    />
                                    <textField
                                        text={formData.email}
                                        hint="Email"
                                        className="input p-3 bg-gray-50 rounded-xl mb-3"
                                        onTextChange={(args) => handleInputChange('email', args.value)}
                                    />
                                    <textField
                                        text={formData.telefono}
                                        hint="Teléfono"
                                        className="input p-3 bg-gray-50 rounded-xl mb-3"
                                        onTextChange={(args) => handleInputChange('telefono', args.value)}
                                    />
                                    <textField
                                        text={formData.genero}
                                        hint="Género"
                                        className="input p-3 bg-gray-50 rounded-xl mb-3"
                                        onTextChange={(args) => handleInputChange('genero', args.value)}
                                    />
                                    <gridLayout columns="*,*" className="mb-3">
                                        <textField
                                            col={0}
                                            text={formData.altura.toString()}
                                            hint="Altura (cm)"
                                            className="input p-3 bg-gray-50 rounded-xl mr-1"
                                            keyboardType="number"
                                            onTextChange={(args) => handleInputChange('altura', parseInt(args.value) || 0)}
                                        />
                                        <textField
                                            col={1}
                                            text={formData.peso.toString()}
                                            hint="Peso (kg)"
                                            className="input p-3 bg-gray-50 rounded-xl ml-1"
                                            keyboardType="number"
                                            onTextChange={(args) => handleInputChange('peso', parseInt(args.value) || 0)}
                                        />
                                    </gridLayout>
                                </stackLayout>
                            ) : (
                                <stackLayout>
                                    <stackLayout className="mt-2">
                                        <label text={profile.telefono} className="text-lg text-black" />
                                        <label text="Teléfono" className="text-sm text-gray-600 mb-4" />
                                        
                                        <label text={`${profile.direccion.calle} ${profile.direccion.numero}`} className="text-lg text-black mt-2" />
                                        <label text={`${profile.direccion.codigoPostal}, ${profile.direccion.ciudad}`} className="text-sm text-gray-600 mb-4" />
                                        
                                        <label text={formatDate(profile.fechaNacimiento)} className="text-lg text-black mt-2" />
                                        <label text="Fecha de nacimiento" className="text-sm text-gray-600 mb-4" />
                                        
                                        <label text={profile.condicionesMedicas.join(", ") || "Sin condiciones médicas"} className="text-lg text-black mt-2" textWrap={true} />
                                        <label text="Condiciones médicas" className="text-sm text-gray-600" />
                                    </stackLayout>
                                </stackLayout>
                            )}
                        </stackLayout>

                        {/* Social Media Card - Added editing capability */}
                        <stackLayout className="bg-white mx-4 mb-4 p-6 rounded-3xl elevation-2">
                            <gridLayout columns="*,auto" className="mb-4">
                                <label col={0} className="text-xl font-bold text-black">Redes Sociales</label>
                                <button 
                                    col={1}
                                    className="text-sm text-purple-700 bg-white/20 rounded-xl px-4 py-2 text-center font-bold"
                                    onTap={() => {
                                        if (isEditingSocial) {
                                            handleSaveSocial();
                                        } else {
                                            setIsEditingSocial(true);
                                        }
                                    }}
                                >
                                    {isEditingSocial ? "Guardar" : "Editar"}
                                </button>
                            </gridLayout>
                            
                            {isEditingSocial ? (
                                <stackLayout>
                                    {/* Existing social networks */}
                                    {socialFormData.map((red, index) => (
                                        <gridLayout key={index} columns="*,auto" className="mb-3">
                                            <stackLayout col={0}>
                                                <textField
                                                    text={red.nombre}
                                                    hint="Red social"
                                                    className="input p-3 bg-gray-50 rounded-xl mb-2"
                                                    onTextChange={(args) => handleSocialInputChange(index, 'nombre', args.value)}
                                                />
                                                <textField
                                                    text={red.url}
                                                    hint="URL o usuario"
                                                    className="input p-3 bg-gray-50 rounded-xl"
                                                    onTextChange={(args) => handleSocialInputChange(index, 'url', args.value)}
                                                />
                                            </stackLayout>
                                            <button 
                                                col={1}
                                                className="text-sm text-red-600 bg-white/20 rounded-xl px-3 py-2 text-center font-bold self-center ml-2"
                                                onTap={() => handleRemoveSocial(index)}
                                            >
                                                X
                                            </button>
                                        </gridLayout>
                                    ))}
                                    
                                    {/* Add new social network */}
                                    <stackLayout className="mt-4 p-4 bg-gray-50 rounded-xl">
                                        <label className="text-lg font-bold text-black mb-2">Añadir red social</label>
                                        <textField
                                            text={newSocial.nombre}
                                            hint="Red social"
                                            className="input p-3 bg-white rounded-xl mb-2"
                                            onTextChange={(args) => setNewSocial(prev => ({...prev, nombre: args.value}))}
                                        />
                                        <textField
                                            text={newSocial.url}
                                            hint="URL o usuario"
                                            className="input p-3 bg-white rounded-xl mb-2"
                                            onTextChange={(args) => setNewSocial(prev => ({...prev, url: args.value}))}
                                        />
                                        <button 
                                            className="text-sm text-white bg-[#95cfe0] rounded-xl px-4 py-3 text-center font-bold"
                                            onTap={handleAddSocial}
                                        >
                                            Añadir
                                        </button>
                                    </stackLayout>
                                </stackLayout>
                            ) : (
                                <stackLayout>
                                    {profile.redesSociales.length > 0 ? (
                                        profile.redesSociales.map((red, index) => (
                                            <stackLayout key={index} className="mb-3">
                                                <label text={red.nombre} className="text-sm text-gray-600" />
                                                <label text={red.url} className="text-lg text-black" />
                                            </stackLayout>
                                        ))
                                    ) : (
                                        <label className="text-gray-500 text-center">No hay redes sociales configuradas</label>
                                    )}
                                </stackLayout>
                            )}
                        </stackLayout>
                        
                        {/* Session History and Subscription Plan sections removed */}
                    </stackLayout>
                ) : (
                    <activityIndicator busy={true} className="m-20" />
                )}
            </scrollView>
        </gridLayout>
    );
}