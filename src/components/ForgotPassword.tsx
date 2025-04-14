import * as React from "react";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";

type ForgotPasswordProps = {
    navigation: FrameNavigationProp<MainStackParamList, "ForgotPassword">,
};

export function ForgotPassword({ navigation }: ForgotPasswordProps) {
    return (
        <gridLayout rows="*" columns="*" className="page">
            <image src="https://etenonfitness.com/wp-content/uploads/2019/10/boutique2-1024x768.jpg" stretch="aspectFill" />
            <scrollView verticalAlignment="center">
                <stackLayout className="px-4">
                    <gridLayout className="bg-black bg-opacity-50 rounded-3xl px-8 py-10">
                        <stackLayout>
                            {/* Header con botón de retroceso */}
                            <gridLayout columns="auto,*" className="mb-6">
                                <image
                                    col={0}
                                    className="h-8 w-8"
                                    src="~/imagenes/left-arrow-white.png"
                                    onTap={() => navigation.goBack()}
                                />
                            </gridLayout>

                            {/* Título y texto */}
                            <stackLayout className="px-4">
                                <label className="text-3xl font-bold text-white mb-6 text-center shadow-text" textWrap={true}>
                                    ¿Has olvidado tu contraseña?
                                </label>
                                
                                <label className="text-white text-center text-lg mb-8 shadow-text leading-6" textWrap={true}>
                                    No te preocupes, contacta con tu entrenador personal y él te ayudará a restablecer el acceso a tu cuenta de forma segura.
                                </label>

                                {/* Botón de acción */}
                                <button 
                                    className="bg-[#95cfe0] text-black py-3 px-6 rounded-full text-base font-bold elevation-3" 
                                    onTap={() => navigation.goBack()}
                                >
                                    Volver al inicio de sesión
                                </button>

                                {/* Footer */}
                                <label className="text-white/70 text-center text-sm mt-8">
                                    2024 Fitness Pro. Todos los derechos reservados.
                                </label>
                            </stackLayout>
                        </stackLayout>
                    </gridLayout>
                </stackLayout>
            </scrollView>
        </gridLayout>
    );
}