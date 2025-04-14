import * as React from "react";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";
import { TextField, Color, ApplicationSettings } from "@nativescript/core";
import { AuthService } from "../api/AuthService";
// Add this import at the top of your Login.tsx file
import { useAuth } from "../context/AuthContext";

type LoginProps = {
    navigation: FrameNavigationProp<MainStackParamList, "Login">,
};

export function Login({ navigation }: LoginProps) {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    // Then modify your handleLogin function in the Login component:
    const { login } = useAuth();
    
    const handleLogin = async () => {
        if (!email || !password) {
            setError("Por favor, introduce email y contraseña");
            return;
        }
    
        setIsLoading(true);
        setError("");
    
        try {
            const response = await AuthService.login({ email, password });
            
            // Use the login function from AuthContext
            login(response.token, response.user);
            
            // Navigation will be handled by the effect in MainStack
        } catch (err) {
            setError("Usuario o contraseña incorrectos");
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <gridLayout rows="*" columns="*" className="page">
            <image src="https://etenonfitness.com/wp-content/uploads/2019/10/boutique2-1024x768.jpg" stretch="aspectFill" />
            <scrollView>
                <stackLayout className="px-4">
                    <gridLayout className="bg-black bg-opacity-50 rounded-3xl px-8 py-10 mt-20">
                        <stackLayout>
                            {/* Logo y título */}
                            <stackLayout className="mb-12">
                                <image
                                    src="~/imagenes/logo.png"
                                    className="h-20 w-20 mb-4 place-self-center"
                                    horizontalAlignment="center"
                                />
                                <label className="text-3xl font-bold text-white text-center shadow-text">
                                    FITNESS PRO
                                </label>
                                <label className="text-lg text-white/90 text-center mt-2 shadow-text">
                                    ¡Bienvenido de nuevo!
                                </label>
                            </stackLayout>

                            {/* Campos de entrada */}
                            <stackLayout className="space-y-4">
                                {/* Email (cambiado de Usuario) */}
                                <gridLayout className="bg-white/10 rounded-2xl elevation-2" rows="auto" columns="auto,*">
                                    <image 
                                        col={0}
                                        src="~/imagenes/user.png"
                                        className="h-5 w-5 ml-4 opacity-70"
                                    />
                                    <textField 
                                        col={1}
                                        hint="Email" 
                                        text={email} 
                                        keyboardType="email"
                                        autocorrect={false}
                                        autocapitalizationType="none"
                                        onTextChange={(args) => setEmail(args.value)}
                                        className="text-base text-white placeholder-white/50 pl-4 pr-6 py-4"
                                        color={new Color("white")}
                                        placeholderColor={new Color("rgba(255,255,255,0.5)")}
                                    />
                                </gridLayout>

                                {/* Contraseña */}
                                <gridLayout className="bg-white/10 rounded-2xl elevation-2" rows="auto" columns="auto,*,auto">
                                    <image 
                                        col={0}
                                        src="~/imagenes/lock.png"
                                        className="h-5 w-5 ml-4 opacity-70"
                                    />
                                    <textField 
                                        col={1}
                                        hint="Contraseña" 
                                        text={password} 
                                        secure={!showPassword}
                                        onTextChange={(args) => setPassword(args.value)}
                                        className="text-base text-white placeholder-white/50 pl-4 pr-2 py-4"
                                        color={new Color("white")}
                                        placeholderColor={new Color("rgba(255,255,255,0.5)")}
                                    />
                                    <gridLayout 
                                        col={2}
                                        className="px-4"
                                        onTap={() => setShowPassword(!showPassword)}
                                    >
                                        <image 
                                            src={showPassword ? "~/imagenes/eye-off.png" : "~/imagenes/eye.png"}
                                            className="h-5 w-5 opacity-70"
                                        />
                                    </gridLayout>
                                </gridLayout>

                                {/* Mensaje de error */}
                                {error ? (
                                    <label className="text-red-400 text-center text-base shadow-text" textWrap={true}>
                                        {error}
                                    </label>
                                ) : null}

                                {/* Botón de inicio de sesión */}
                                <button 
                                    className="bg-[#95cfe0] text-black py-4 rounded-2xl text-base font-bold elevation-3 mt-4" 
                                    onTap={handleLogin}
                                    isEnabled={!isLoading}
                                >
                                    {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                                </button>

                                {/* Enlace de contraseña olvidada */}
                                <button 
                                    className="text-white/90 text-center text-base mt-4" 
                                    onTap={() => navigation.navigate("ForgotPassword")}
                                >
                                    ¿Has olvidado tu contraseña?
                                </button>
                            </stackLayout>

                            {/* Footer */}
                            <label className="text-white/70 text-center text-sm mt-12">
                                2024 Fitness Pro. Todos los derechos reservados.
                            </label>
                        </stackLayout>
                    </gridLayout>
                </stackLayout>
            </scrollView>
        </gridLayout>
    );
}