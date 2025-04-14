import { BaseNavigationContainer } from '@react-navigation/core';
import * as React from "react";
import { stackNavigatorFactory } from "react-nativescript-navigation";
import { Navbar } from "./Navbar";
import { AuthProvider, useAuth } from "../context/AuthContext";

import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { Routines } from "./Routines";
import { Nutrition } from "./Nutrition";
import { Chat } from "./Chat";
import { Settings } from "./Settings";
import { Profile } from "./Profile";
import { PhotoGallery } from "./PhotoGallery";
import { WorkoutSession } from "./WorkoutSession";
import { ExerciseDetails } from "./ExerciseDetails";
import { Wall } from "./Wall";
import { MealDetails } from "./MealDetails";
import { ForgotPassword } from "./ForgotPassword";
import { Calendar } from "./Calendar";
import { EventDetails } from "./EventDetails";
import { Achievements } from "./Achievements";
import { Forms } from "./Forms";
import { FormDetail } from "./FormDetail";

const StackNavigator = stackNavigatorFactory();

// Create a separate component for the navigator
const MainNavigator = () => {
    const [currentRoute, setCurrentRoute] = React.useState<string>("Login");
    const navigationRef = React.useRef<any>(null);
    const { isAuthenticated } = useAuth();

    const hideNavbarRoutes = ["Login", "ForgotPassword", "WorkoutSession", "ExerciseDetails", "MealDetails", "EventDetails", "Profile", "PhotoGallery", "Chat", "Settings", "Achievements", "FormDetail"];

    const navigate = (screenName: string) => {
        if (navigationRef.current) {
            navigationRef.current.navigate(screenName);
            setCurrentRoute(screenName);
        }
    };

    React.useEffect(() => {
        const unsubscribe = navigationRef.current?.addListener('state', (e: any) => {
            if (e.data.state.routes.length > 0) {
                const routes = e.data.state.routes;
                const currentRouteName = routes[routes.length - 1].name;
                setCurrentRoute(currentRouteName);
            }
        });

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    // Effect to redirect to Dashboard if authenticated or Login if not
    React.useEffect(() => {
        if (isAuthenticated && currentRoute === "Login") {
            navigate("Dashboard");
        } else if (!isAuthenticated && currentRoute !== "Login" && currentRoute !== "ForgotPassword") {
            navigate("Login");
        }
    }, [isAuthenticated, currentRoute]);

    return (
        <BaseNavigationContainer ref={navigationRef}>
            <gridLayout rows="*, auto">
                <StackNavigator.Navigator
                    row={0}
                    initialRouteName="Login"
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <StackNavigator.Screen name="Login" component={Login} />
                    <StackNavigator.Screen name="Dashboard" component={Dashboard} />
                    <StackNavigator.Screen name="Routines" component={Routines} />
                    <StackNavigator.Screen name="Nutrition" component={Nutrition} />
                    <StackNavigator.Screen name="Chat" component={Chat} />
                    <StackNavigator.Screen name="Settings" component={Settings} />
                    <StackNavigator.Screen name="Profile" component={Profile} />
                    <StackNavigator.Screen name="PhotoGallery" component={PhotoGallery} />
                    <StackNavigator.Screen name="WorkoutSession" component={WorkoutSession} />
                    <StackNavigator.Screen name="ExerciseDetails" component={ExerciseDetails} />
                    <StackNavigator.Screen name="Wall" component={Wall} />
                    <StackNavigator.Screen name="MealDetails" component={MealDetails} />
                    <StackNavigator.Screen name="ForgotPassword" component={ForgotPassword} />
                    <StackNavigator.Screen name="Calendar" component={Calendar} />
                    <StackNavigator.Screen name="EventDetails" component={EventDetails} />
                    <StackNavigator.Screen name="Achievements" component={Achievements} />
                    <StackNavigator.Screen name="Forms" component={Forms} />
                    <StackNavigator.Screen name="FormDetail" component={FormDetail} />
                </StackNavigator.Navigator>
                {!hideNavbarRoutes.includes(currentRoute) && (
                    <Navbar 
                        row={1} 
                        currentRoute={currentRoute} 
                        navigation={navigate} 
                    />
                )}
            </gridLayout>
        </BaseNavigationContainer>
    );
};

// Wrap the main component with AuthProvider
export const MainStack = () => {
    return (
        <AuthProvider>
            <MainNavigator />
        </AuthProvider>
    );
};