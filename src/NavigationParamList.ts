export type MainStackParamList = {
  Login: {};
  Dashboard: {};
  Routines: {};
  Nutrition: {};
  Chat: {};
  Settings: {};
  Profile: {};
  PhotoGallery: {};
  WorkoutSession: { workout: any };
  ExerciseDetails: { exercise: any };
  Wall: {};
  MealDetails: { meal: any };
  Calendar: {};
  EventDetails: { event: CalendarEvent };
  Achievements: {};
  Forms: undefined;
  FormDetail: {
    formId: string;
  };
};

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  trainer: string;
  participants: number;
  maxParticipants: number;
  type: 'class' | 'personal' | 'appointment';
}