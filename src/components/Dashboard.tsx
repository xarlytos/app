import { RouteProp } from '@react-navigation/core';
import * as React from 'react';
import { FrameNavigationProp } from 'react-nativescript-navigation';
import { MainStackParamList } from '../NavigationParamList';
import { ImageSource, ImageAsset, knownFolders, path } from '@nativescript/core';
import { Navbar } from './Navbar';
import { ProfileService, Profile } from '../api/ProfileService';
import { PhotoService } from '../api/PhotoService';
import { AchievementsService, Achievement } from '../api/AchievementsService';
import { RoutineService } from '../api/RoutineService';
import { FormService } from '../api/FormService';

type DashboardProps = {
  route: RouteProp<MainStackParamList, 'Dashboard'>;
  navigation: FrameNavigationProp<MainStackParamList, 'Dashboard'>;
};

const getDayName = () => {
  const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  const date = new Date();
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
};

const getIconForAchievement = (iconName: string) => {
  console.log('Dashboard: Obteniendo icono para:', iconName);
  const iconMap: { [key: string]: string } = {
    'first-class.png': '',
    'fitness-master.png': '',
    'nutrition-expert.png': ''
  };
  const icon = iconMap[iconName] || '';
  console.log('Dashboard: Icono seleccionado:', icon);
  return icon;
};

export function Dashboard({ navigation }: DashboardProps) {
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [oldestPhoto, setOldestPhoto] = React.useState<{ id: number; url: string; date: string } | null>(null);
  const [newestPhoto, setNewestPhoto] = React.useState<{ id: number; url: string; date: string } | null>(null);
  const [recentAchievements, setRecentAchievements] = React.useState<Achievement[]>([]);
  const [availableForms, setAvailableForms] = React.useState<number>(0);

  React.useEffect(() => {
    loadProfile();
    loadPhotos();
    loadAchievements();
    loadFormsCount();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await ProfileService.getCurrentProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadPhotos = async () => {
    try {
      const { oldest, newest } = await PhotoService.getOldestAndNewestPhotos();
      setOldestPhoto(oldest);
      setNewestPhoto(newest);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const loadAchievements = async () => {
    try {
      console.log('Dashboard: Cargando logros recientes...');
      const achievements = await AchievementsService.getRecentAchievements(3);
      console.log('Dashboard: Logros recientes recibidos:', achievements);
      setRecentAchievements(achievements);
    } catch (error) {
      console.error('Dashboard: Error cargando logros:', error);
    }
  };

  const loadFormsCount = async () => {
    const count = await FormService.getAvailableFormsCount();
    setAvailableForms(count);
  };

  const startWorkout = () => {
    const currentRoutine = RoutineService.getCurrentRoutine();
    const startDate = new Date(currentRoutine.fechaInicio);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekIndex = Math.floor(diffDays / 7);
    const dayIndex = diffDays % 7;

    if (weekIndex < currentRoutine.semanas.length && 
        currentRoutine.semanas[weekIndex].dias[dayIndex]) {
      navigation.navigate('WorkoutSession', { workout: currentRoutine });
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (!profile) {
    return (
      <gridLayout className="page">
        <label className="text-center text-gray-500">Cargando...</label>
      </gridLayout>
    );
  }

  const currentRoutine = RoutineService.getCurrentRoutine();

  return (
    <gridLayout rows="auto, *, auto" columns="*" className="page">
      <image src="" stretch="aspectFill" className="w-full h-full" />
      <gridLayout rows="auto, *, auto" columns="*" className="w-full h-full">
        <gridLayout
          row={0}
          columns="*, auto"
          className="p-4"
          backgroundColor="#95cfe0"
        >
          <stackLayout col={0}>
            <label className="text-sm text-black">{getDayName()}</label>
            <label className="text-4xl font-bold text-black">ASTROFIT</label>
          </stackLayout>
          <gridLayout
            col={1}
            className="w-10 h-10 rounded-full overflow-hidden"
            onTap={() => navigation.navigate('Profile')}
          >
            <image src={profile.fotoPerfil} stretch="aspectFill" />
          </gridLayout>
        </gridLayout>

        <scrollView row={1} className="p-4">
          <stackLayout>
            <stackLayout className="bg-white/70 rounded-lg shadow-md p-6 mb-6">
              <label className="text-2xl font-bold text-black-700 mb-2">
                {currentRoutine.nombre}
              </label>
              <image
                src="https://img.freepik.com/foto-gratis/joven-ropa-deportiva-clase-ejercicios-gimnasio_1150-12372.jpg"
                className="w-full h-48 rounded-lg mb-4"
                stretch="aspectFill"
              />
              <label className="text-lg text-gray-600 mb-4">
                {currentRoutine.descripcion}
              </label>
              <button className="bg-blue-500 text-white p-4 rounded-lg text-center font-bold"
                      onTap={startWorkout}>
                COMENZAR ENTRENAMIENTO
              </button>
            </stackLayout>

            <stackLayout className="bg-white/70 rounded-lg shadow-md p-6 mb-6">
              <gridLayout columns="*, auto" className="mb-4">
                <label col={0} className="text-2xl font-bold text-gray-800">
                  Tu progreso
                </label>
                <label
                  col={1}
                  className="text-purple-700 text-right"
                  onTap={() => navigation.navigate('PhotoGallery')}
                >
                  Ver todo
                </label>
              </gridLayout>
              <gridLayout columns="*, *" className="mb-4">
                {oldestPhoto && (
                  <stackLayout col={0} className="mr-2">
                    <label className="text-center text-sm text-gray-600 mb-2">
                      {formatDisplayDate(oldestPhoto.date)}
                    </label>
                    <image
                      src={oldestPhoto.url}
                      className="w-full h-48 rounded-lg"
                      stretch="aspectFill"
                    />
                    <label className="text-center text-gray-600 mt-2">Inicio</label>
                  </stackLayout>
                )}
                {newestPhoto && (
                  <stackLayout col={1} className="ml-2">
                    <label className="text-center text-sm text-gray-600 mb-2">
                      {formatDisplayDate(newestPhoto.date)}
                    </label>
                    <image
                      src={newestPhoto.url}
                      className="w-full h-48 rounded-lg"
                      stretch="aspectFill"
                    />
                    <label className="text-center text-gray-600 mt-2">Actual</label>
                  </stackLayout>
                )}
              </gridLayout>
              <button
                className="bg-purple-700 text-white p-4 rounded-lg text-center font-bold"
                onTap={() => navigation.navigate('PhotoGallery')}
              >
                AÑADIR FOTO
              </button>
            </stackLayout>

            {recentAchievements.length > 0 && (
              <stackLayout className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <gridLayout columns="*, auto" className="mb-4">
                  <label col={0} className="text-lg font-bold text-black">Logros Recientes</label>
                  <button col={1} 
                          className="text-sm color-primary"
                          onTap={() => navigation.navigate('Achievements')}>
                    Ver Todos
                  </button>
                </gridLayout>
                
                {recentAchievements.map((achievement) => (
                  <gridLayout key={achievement._id} 
                            className="bg-gray-100 p-4 rounded-lg mb-2">
                    <stackLayout>
                      <gridLayout columns="auto,*,auto" className="mb-2">
                        <label col={0} className="text-2xl mr-2">
                          {getIconForAchievement(achievement.icono)}
                        </label>
                        <stackLayout col={1}>
                          <label className="font-bold text-black">{achievement.nombre}</label>
                          <label className="text-sm text-gray-600">{achievement.descripcion}</label>
                        </stackLayout>
                        <label col={2} className="text-sm font-bold text-black">{achievement.puntos}pts</label>
                      </gridLayout>
                      
                      {achievement.estado === 'en_progreso' && (
                        <stackLayout>
                          <gridLayout className="bg-gray-200 rounded-full h-2">
                            <stackLayout 
                              className="h-2 rounded-full"
                              backgroundColor="#95cfe0"
                              horizontalAlignment="left"
                              width={`${achievement.progreso}%`}
                            />
                          </gridLayout>
                          <label className="text-xs text-gray-600 text-right mt-1">
                            {achievement.progreso}%
                          </label>
                        </stackLayout>
                      )}
                    </stackLayout>
                  </gridLayout>
                ))}
              </stackLayout>
            )}

            {/* Forms Section */}
            <stackLayout className="bg-white/70 rounded-lg shadow-md p-6 mb-6">
                <gridLayout columns="*, auto" className="mb-4">
                    <stackLayout col={0}>
                        <label className="text-2xl font-bold text-gray-800">
                            Formularios
                        </label>
                        <label className="text-gray-600">
                            {availableForms} formularios pendientes
                        </label>
                    </stackLayout>
                    <button
                        col={1}
                        text="EMPEZAR"
                        className="bg-blue-500 text-white p-4 rounded-lg font-bold"
                        onTap={() => navigation.navigate('Forms')}
                    />
                </gridLayout>
                <image
                    src="~/imagenes/formularioimagen.png"
                    className="w-full h-32 rounded-lg mb-4"
                    stretch="aspectFill"
                />
            </stackLayout>
          </stackLayout>
        </scrollView>

        <Navbar row={2} navigation={navigation} currentRoute="Dashboard" />
      </gridLayout>
    </gridLayout>
  );
}