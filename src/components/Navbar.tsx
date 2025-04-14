import * as React from "react";
// No es necesario importar { Image } desde "react-nativescript"
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";

type NavbarProps = {
    currentRoute: string;
    navigation: (screenName: string) => void;
    row?: number;
};

export function Navbar({ currentRoute, navigation, row }: NavbarProps) {
    const handleNavigation = (screenName: string) => {
        if (navigation) {
            navigation(screenName);
        }
    };

    return (
        <gridLayout
            row={row}
            columns="*, *, *, *, *"
            className="bg-white border-t border-gray-200 p-2 elevation-3"
        >
            {/* Dashboard */}
            <gridLayout
                col={0}
                rows="*, auto"
                className={`${currentRoute === 'Dashboard' ? 'bg-blue-50' : ''} rounded-xl p-1`}
                onTap={() => handleNavigation("Dashboard")}
            >
                <image
                    row={0}
                    className="h-6 w-6 mx-auto"
                    src="~/imagenes/home-icon-silhouette.png"
                />
                
            </gridLayout>

            {/* Routines */}
            <gridLayout
                col={1}
                rows="*, auto"
                className={`${currentRoute === 'Routines' ? 'bg-blue-50' : ''} rounded-xl p-1`}
                onTap={() => handleNavigation("Routines")}
            >
               <image
                    row={0}
                    className="h-6 w-6 mx-auto"
                    src="~/imagenes/crossfit.png"
                />
            </gridLayout>

            {/* Nutrition */}
            <gridLayout
                col={2}
                rows="*, auto"
                className={`${currentRoute === 'Nutrition' ? 'bg-blue-50' : ''} rounded-xl p-1`}
                onTap={() => handleNavigation("Nutrition")}
            >
               <image
                    row={0}
                    className="h-6 w-6 mx-auto"
                    src="~/imagenes/diet.png"
                />
            </gridLayout>

            {/* Chat */}
            <gridLayout
                col={3}
                rows="*, auto"
                className={`${currentRoute === 'Chat' ? 'bg-blue-50' : ''} rounded-xl p-1`}
                onTap={() => handleNavigation("Chat")}
            >
                <image
                    row={0}
                    className="h-6 w-6 mx-auto"
                    src="~/imagenes/chatting.png"
                />
            </gridLayout>

            {/* Calendar */}
            <gridLayout
                col={4}
                rows="*, auto"
                className={`${currentRoute === 'Calendar' ? 'bg-blue-50' : ''} rounded-xl p-1`}
                onTap={() => handleNavigation("Calendar")}
            >
                <image
                    row={0}
                    className="h-6 w-6 mx-auto"
                    src="~/imagenes/calendar.png"
                />
            </gridLayout>
        </gridLayout>
    );
}
