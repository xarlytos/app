import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";
import { ObservableArray, Modal, View, GestureTypes, PinchGestureEventData, Screen } from '@nativescript/core';
import { TrainerService, Trainer } from '../api/TrainerService';

type WallProps = {
    route: RouteProp<MainStackParamList, "Wall">,
    navigation: FrameNavigationProp<MainStackParamList, "Wall">,
};

interface Post {
    id: string;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    timestamp: Date;
    isLiked: boolean;
}

export function Wall({ navigation }: WallProps) {
    const [trainer, setTrainer] = React.useState<Trainer | null>(null);
    const [posts, setPosts] = React.useState<Post[]>([
        {
            id: '1',
            content: '¡Nuevo récord de sentadillas! 💪 Recuerda, la consistencia es clave para el progreso.',
            image: 'https://fitsoul.com.mx/wp-content/uploads/2021/01/Como-tomar-la-proteina-Whey-Fit-Soul.jpg',
            likes: 24,
            comments: 5,
            timestamp: new Date(2023, 5, 15, 10, 30),
            isLiked: false
        },
        {
            id: '2',
            content: 'Tip del día: Mantén una buena hidratación durante tus entrenamientos. 💧',
            likes: 18,
            comments: 3,
            timestamp: new Date(2023, 5, 14, 16, 45),
            isLiked: false
        },
        {
            id: '3',
            content: 'Nueva rutina de cardio disponible. ¡Prepárate para sudar! 🏃‍♂️',
            image: 'https://www.basic-fit.com/on/demandware.static/-/Library-Sites-basic-fit-shared-library/default/dw12cd98f1/Roots/Blog/Blog-Header/1088x612/18-01-Blog-Fitness-Information-personal-trainer.jpg',
            likes: 32,
            comments: 7,
            timestamp: new Date(2023, 5, 13, 9, 15),
            isLiked: false
        }
    ]);

    React.useEffect(() => {
        loadTrainerProfile();
    }, []);

    const loadTrainerProfile = async () => {
        try {
            const trainerData = await TrainerService.getTrainerProfile();
            setTrainer(trainerData);
        } catch (error) {
            console.error('Error loading trainer profile:', error);
        }
    };

    const [filter, setFilter] = React.useState('all');
    const [fullscreenImage, setFullscreenImage] = React.useState<string | null>(null);
    const [scale, setScale] = React.useState(1);

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return `Hace ${diffInSeconds} segundos`;
        if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
        if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
        return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
    };

    const toggleLike = (postId: string) => {
        setPosts(posts.map(post => 
            post.id === postId 
                ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked } 
                : post
        ));
    };

    const openComments = (postId: string) => {
        console.log(`Abrir comentarios para el post ${postId}`);
    };

    const showFullscreenImage = (imageUrl: string) => {
        setFullscreenImage(imageUrl);
        setScale(1);
    };

    const closeFullscreenImage = () => {
        setFullscreenImage(null);
        setScale(1);
    };

    const onPinch = (args: PinchGestureEventData) => {
        setScale(prevScale => {
            let newScale = prevScale * args.scale;
            newScale = Math.min(Math.max(newScale, 0.5), 3);
            return newScale;
        });
    };

    const filteredPosts = React.useMemo(() => {
        if (filter === 'all') return posts;
        if (filter === 'images') return posts.filter(post => post.image);
        return posts;
    }, [posts, filter]);

    return (
        <gridLayout rows="auto, auto, *, auto" columns="*" className="page" backgroundColor="#F0F2F5">
            <gridLayout row={0} columns="auto, *, auto" className="p-4" backgroundColor="#95cfe0">
                <button col={0} className="text-2xl text-purple-700" onTap={() => navigation.goBack()}>
                    ⬅️
                </button>
                <label col={1} className="text-2xl font-bold text-center text-black">
                    Muro de {trainer ? `${trainer.name} ${trainer.surname}` : 'Cargando...'}
                </label>
                <button col={2} className="text-xl text-purple-700">🔍</button>
            </gridLayout>

            <gridLayout row={1} columns="*, *" className="bg-white p-2 border-b border-gray-200">
                <button col={0} className={`${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} p-3 rounded-full m-1 font-bold`} onTap={() => setFilter('all')}>
                    Todos
                </button>
                <button col={1} className={`${filter === 'images' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} p-3 rounded-full m-1 font-bold`} onTap={() => setFilter('images')}>
                    Con Imágenes
                </button>
            </gridLayout>

            <scrollView row={2} className="p-4">
                <stackLayout>
                    {filteredPosts.map(post => (
                        <gridLayout key={post.id} className="bg-white mb-6 rounded-2xl shadow-lg" rows="auto, auto, auto, auto" columns="auto, *">
                            <gridLayout row={0} colSpan={2} columns="auto, *, auto" className="p-4 border-b border-gray-200">
                                <image col={0} src={trainer?.profile_picture} className="w-12 h-12 rounded-full" />
                                <stackLayout col={1} className="ml-3">
                                    <label className="font-bold text-lg text-black">{trainer ? `${trainer.name} ${trainer.surname}` : 'Cargando...'}</label>
                                    <label className="text-xs text-gray-500">{formatTimestamp(post.timestamp)}</label>
                                </stackLayout>
                                <button col={2} className="text-xl text-gray-500">⋯</button>
                            </gridLayout>
                            <label row={1} colSpan={2} textWrap={true} className="text-black px-4 py-3 text-lg">{post.content}</label>
                            {post.image && (
                                <image row={2} colSpan={2} src={post.image} className="w-full h-64 rounded-lg mt-2" stretch="aspectFill" onTap={() => showFullscreenImage(post.image!)} />
                            )}
                            <gridLayout row={3} colSpan={2} columns="auto, auto, *" className="p-4 border-t border-gray-200">
                                <button col={0} className={`${post.isLiked ? 'text-red-500' : 'text-blue-500'} font-bold`} onTap={() => toggleLike(post.id)}>
                                    {post.isLiked ? '❤️' : '🤍'} {post.likes}
                                </button>
                                <button col={1} className="text-blue-500 ml-6 font-bold" onTap={() => openComments(post.id)}>
                                    💬 {post.comments}
                                </button>
                                <button col={2} className="text-blue-500 text-right font-bold">
                                    📤 Compartir
                                </button>
                            </gridLayout>
                        </gridLayout>
                    ))}
                </stackLayout>
            </scrollView>

            <gridLayout row={3} columns="*, *, *, *" className="bg-white border-t border-gray-200 p-2">
                <button col={0} className="nav-button" onTap={() => navigation.navigate("Dashboard")}>
                    <stackLayout>
                        <label className="text-2xl">🏠</label>
                        <label className="text-xs text-gray-600">Inicio</label>
                    </stackLayout>
                </button>
                <button col={1} className="nav-button" onTap={() => navigation.navigate("Routines")}>
                    <stackLayout>
                        <label className="text-2xl">💪</label>
                        <label className="text-xs text-gray-600">Rutinas</label>
                    </stackLayout>
                </button>
                <button col={2} className="nav-button" onTap={() => navigation.navigate("Nutrition")}>
                    <stackLayout>
                        <label className="text-2xl">🍎</label>
                        <label className="text-xs text-gray-600">Nutrición</label>
                    </stackLayout>
                </button>
                <button col={3} className="nav-button" onTap={() => navigation.navigate("Chat")}>
                    <stackLayout>
                        <label className="text-2xl">💬</label>
                        <label className="text-xs text-gray-600">Chat</label>
                    </stackLayout>
                </button>
            </gridLayout>

            {fullscreenImage && (
                <absoluteLayout class="w-full h-full">
                    <gridLayout rows="*, auto" columns="*" class="w-full h-full bg-black">
                        <image row={0} src={fullscreenImage} class="w-full h-full" stretch="aspectFit" 
                               scaleX={scale} scaleY={scale}
                               on:pinch={onPinch} />
                        <button row={1} text="Cerrar" class="bg-blue-500 text-white p-4 m-4 rounded-full font-bold" onTap={closeFullscreenImage} />
                    </gridLayout>
                </absoluteLayout>
            )}
        </gridLayout>
    );
}