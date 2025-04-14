import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";
import { ImageSource, Dialogs, ListPicker, GestureTypes, PanGestureEventData, PinchGestureEventData, Screen, ImageAsset } from "@nativescript/core";
import { PhotoService } from '../api/PhotoService';

type PhotoGalleryProps = {
    route: RouteProp<MainStackParamList, "PhotoGallery">,
    navigation: FrameNavigationProp<MainStackParamList, "PhotoGallery">,
};

interface PhotoScale {
    scale: number;
    translateX: number;
    translateY: number;
}

export function PhotoGallery({ navigation }: PhotoGalleryProps) {
    const [photos, setPhotos] = React.useState<Array<{ id: number; url: string; date: string }>>([]);
    const [selectedPhotos, setSelectedPhotos] = React.useState<number[]>([]);
    const [filterType, setFilterType] = React.useState<'all' | 'month' | 'year'>('all');
    const [selectedYear, setSelectedYear] = React.useState<number>(new Date().getFullYear());
    const [tempSelectedYear, setTempSelectedYear] = React.useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = React.useState<number>(new Date().getMonth());
    const [tempSelectedMonth, setTempSelectedMonth] = React.useState<number>(new Date().getMonth());
    const [comparingPhotos, setComparingPhotos] = React.useState<number[]>([]);
    const [isComparing, setIsComparing] = React.useState(false);
    const [showMonthPicker, setShowMonthPicker] = React.useState(false);
    const [showYearPicker, setShowYearPicker] = React.useState(false);
    const [photoScales, setPhotoScales] = React.useState<{ [key: number]: PhotoScale }>({});
    const [expandedPhoto, setExpandedPhoto] = React.useState<number | null>(null);

    React.useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        try {
            const photoData = await PhotoService.getPhotos();
            const sortedPhotos = photoData.sort((a, b) => 
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            setPhotos(sortedPhotos);
        } catch (error) {
            console.error('Error loading photos:', error);
            Dialogs.alert({
                title: "Error",
                message: "No se pudieron cargar las fotos",
                okButtonText: "OK"
            });
        }
    };

    const addPhoto = async () => {
        try {
            const selection = await ImageAsset.pickImage({ allowsEditing: true });
            if (selection) {
                const imageSource = new ImageSource();
                await imageSource.fromAsset(selection);

                const photo = {
                    uri: selection.android ? selection.android : selection.ios,
                    type: 'image/jpeg',
                    fileName: `photo_${Date.now()}.jpg`
                };

                await PhotoService.addPhoto(photo);
                await loadPhotos();
                Dialogs.alert({
                    title: "Éxito",
                    message: "Foto subida correctamente",
                    okButtonText: "OK"
                });
            }
        } catch (error) {
            console.error('Error al añadir la foto:', error);
            Dialogs.alert({
                title: "Error",
                message: "No se pudo subir la foto",
                okButtonText: "OK"
            });
        }
    };

    const deleteSelectedPhotos = async () => {
        if (selectedPhotos.length === 0) return;

        try {
            const result = await Dialogs.confirm({
                title: "Confirmar eliminación",
                message: "¿Estás seguro de que quieres eliminar las fotos seleccionadas?",
                okButtonText: "Sí",
                cancelButtonText: "No"
            });

            if (result) {
                await PhotoService.deletePhotos(selectedPhotos);
                await loadPhotos();
                setSelectedPhotos([]);
                Dialogs.alert({
                    title: "Éxito",
                    message: "Fotos eliminadas correctamente",
                    okButtonText: "OK"
                });
            }
        } catch (error) {
            console.error('Error al eliminar las fotos:', error);
            Dialogs.alert({
                title: "Error",
                message: "No se pudieron eliminar las fotos",
                okButtonText: "OK"
            });
        }
    };

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

    const onPinchPhoto = (photoId: number, args: PinchGestureEventData) => {
        const currentScale = photoScales[photoId]?.scale || 1;
        let newScale = currentScale * args.scale;
        newScale = Math.max(0.5, Math.min(3, newScale));
        
        setPhotoScales(prev => ({
            ...prev,
            [photoId]: {
                scale: newScale,
                translateX: prev[photoId]?.translateX || 0,
                translateY: prev[photoId]?.translateY || 0
            }
        }));
    };

    const onPanPhoto = (photoId: number, args: PanGestureEventData) => {
        if (!photoScales[photoId] || photoScales[photoId].scale <= 1) return;

        setPhotoScales(prev => ({
            ...prev,
            [photoId]: {
                ...prev[photoId],
                translateX: (prev[photoId]?.translateX || 0) + args.deltaX,
                translateY: (prev[photoId]?.translateY || 0) + args.deltaY
            }
        }));
    };

    const resetPhotoScale = (photoId: number) => {
        setPhotoScales(prev => ({
            ...prev,
            [photoId]: {
                scale: 1,
                translateX: 0,
                translateY: 0
            }
        }));
    };

    const togglePhotoSelection = (id: number) => {
        if (isComparing) return;
        setSelectedPhotos(prev => 
            prev.includes(id) ? prev.filter(photoId => photoId !== id) : [...prev, id]
        );
    };

    const handlePhotoTap = (id: number) => {
        setExpandedPhoto(id);
        resetPhotoScale(id);
    };

    const comparePhotos = () => {
        if (selectedPhotos.length !== 2) {
            Dialogs.alert({
                title: "Selección incorrecta",
                message: "Selecciona exactamente 2 fotos para comparar.",
                okButtonText: "OK"
            });
            return;
        }

        setIsComparing(true);
        setComparingPhotos(selectedPhotos);
        setPhotoScales({});
    };

    const closeComparison = () => {
        setIsComparing(false);
        setComparingPhotos([]);
        setSelectedPhotos([]);
        setPhotoScales({});
    };

    const handleMonthSelected = (args: any) => {
        setTempSelectedMonth(args.newIndex);
    };

    const handleYearSelected = (args: any) => {
        setTempSelectedYear(parseInt(years[args.newIndex]));
    };

    const applyMonthFilter = () => {
        setSelectedMonth(tempSelectedMonth);
        setFilterType('month');
        setShowMonthPicker(false);
    };

    const applyYearFilter = () => {
        setSelectedYear(tempSelectedYear);
        setFilterType('year');
        setShowYearPicker(false);
    };

    const filteredPhotos = React.useMemo(() => {
        return photos.filter(photo => {
            const photoDate = new Date(photo.date);
            
            switch (filterType) {
                case 'month':
                    return photoDate.getMonth() === selectedMonth && 
                           photoDate.getFullYear() === selectedYear;
                case 'year':
                    return photoDate.getFullYear() === selectedYear;
                default:
                    return true;
            }
        });
    }, [photos, filterType, selectedYear, selectedMonth]);

    const screenWidth = Screen.mainScreen.widthDIPs;
    const screenHeight = Screen.mainScreen.heightDIPs;
    const imageSize = (screenWidth - 24) / 2;

    const resetMonthPicker = () => {
        setTempSelectedMonth(selectedMonth);
    };

    const resetYearPicker = () => {
        setTempSelectedYear(selectedYear);
    };

    const formatDisplayDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <gridLayout rows="auto, auto, *, auto" columns="*" className="page p-4">
            <gridLayout row={0} columns="auto, *, auto" className="mb-4">
    <image
        col={0}
        className="h-6 w-6 mr-2"
        src="~/imagenes/left-arrow.png"
        onTap={() => {
            if (isComparing) {
                closeComparison();
            } else if (expandedPhoto) {
                setExpandedPhoto(null);
            } else {
                navigation.goBack();
            }
        }}
    />
    <label col={1} className="text-2xl font-bold text-center text-black">
        {isComparing ? 'Comparando fotos' :
         expandedPhoto ? 'Vista detallada' :
         filterType === 'all' ? 'Todas las fotos' : 
         filterType === 'month' ? `${months[selectedMonth]} ${selectedYear}` :
         `Año ${selectedYear}`}
    </label>
    <stackLayout col={2} />
</gridLayout>


            {!isComparing && !expandedPhoto && (
                <gridLayout row={1} rows="auto, auto" columns="*, *, *" className="mb-4">
                    <button col={0} className={`mx-1 p-3 rounded-xl text-center ${filterType === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`} onTap={() => {
                        setFilterType('all');
                        setShowMonthPicker(false);
                        setShowYearPicker(false);
                    }}>Todas</button>
                    <button col={1} className={`mx-1 p-3 rounded-xl text-center ${filterType === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`} onTap={() => {
                        if (showMonthPicker) {
                            setShowMonthPicker(false);
                            setFilterType('all');
                        } else {
                            setShowMonthPicker(true);
                            setShowYearPicker(false);
                            resetMonthPicker();
                        }
                    }}>Mes</button>
                    <button col={2} className={`mx-1 p-3 rounded-xl text-center ${filterType === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`} onTap={() => {
                        if (showYearPicker) {
                            setShowYearPicker(false);
                            setFilterType('all');
                        } else {
                            setShowYearPicker(true);
                            setShowMonthPicker(false);
                            resetYearPicker();
                        }
                    }}>Año</button>

                    {showMonthPicker && (
                        <gridLayout row={1} colSpan={3} className="bg-white rounded-xl shadow-lg mt-2">
                            <stackLayout>
                                <listPicker items={months} selectedIndex={tempSelectedMonth} onSelectedIndexChange={handleMonthSelected} className="p-2" />
                                <button className="bg-blue-500 text-white p-3 m-2 rounded-xl" onTap={applyMonthFilter}>
                                    Aplicar
                                </button>
                            </stackLayout>
                        </gridLayout>
                    )}

                    {showYearPicker && (
                        <gridLayout row={1} colSpan={3} className="bg-white rounded-xl shadow-lg mt-2">
                            <stackLayout>
                                <listPicker items={years} selectedIndex={0} onSelectedIndexChange={handleYearSelected} className="p-2" />
                                <button className="bg-blue-500 text-white p-3 m-2 rounded-xl" onTap={applyYearFilter}>
                                    Aplicar
                                </button>
                            </stackLayout>
                        </gridLayout>
                    )}
                </gridLayout>
            )}

            {isComparing ? (
                <gridLayout row={2} rowSpan={2} rows="*, *">
                    {comparingPhotos.map((photoId, index) => {
                        const photo = photos.find(p => p.id === photoId);
                        if (!photo) return null;
                        const scale = photoScales[photoId] || { scale: 1, translateX: 0, translateY: 0 };
                        return (
                            <stackLayout key={photoId} row={index} className="p-2">
                                <label className="text-sm font-bold text-black text-center mb-2">
                                    {formatDisplayDate(photo.date)}
                                </label>
                                <gridLayout className="bg-white rounded-xl shadow-lg p-2">
                                    <gridLayout
                                        on:pinch={(args: PinchGestureEventData) => onPinchPhoto(photoId, args)}
                                        on:pan={(args: PanGestureEventData) => onPanPhoto(photoId, args)}
                                        on:doubleTap={() => resetPhotoScale(photoId)}
                                    >
                                        <image src={photo.url} 
                                               height={screenHeight * 0.35}
                                               className="rounded-lg" 
                                               stretch="aspectFit"
                                               scaleX={scale.scale}
                                               scaleY={scale.scale}
                                               translateX={scale.translateX}
                                               translateY={scale.translateY} />
                                    </gridLayout>
                                </gridLayout>
                            </stackLayout>
                        );
                    })}
                </gridLayout>
            ) : expandedPhoto ? (
                <gridLayout row={2} rowSpan={2}>
                    {(() => {
                        const photo = photos.find(p => p.id === expandedPhoto);
                        if (!photo) return null;
                        const scale = photoScales[expandedPhoto] || { scale: 1, translateX: 0, translateY: 0 };
                        return (
                            <stackLayout>
                                <gridLayout
                                    on:pinch={(args: PinchGestureEventData) => onPinchPhoto(expandedPhoto, args)}
                                    on:pan={(args: PanGestureEventData) => onPanPhoto(expandedPhoto, args)}
                                    on:doubleTap={() => resetPhotoScale(expandedPhoto)}
                                >
                                    <image src={photo.url} 
                                           height={screenHeight * 0.8}
                                           className="rounded-lg" 
                                           stretch="aspectFit"
                                           scaleX={scale.scale}
                                           scaleY={scale.scale}
                                           translateX={scale.translateX}
                                           translateY={scale.translateY} />
                                </gridLayout>
                                <label className="text-center text-sm text-gray-600 mt-2">
                                    {formatDisplayDate(photo.date)}
                                </label>
                            </stackLayout>
                        );
                    })()}
                </gridLayout>
            ) : (
                <>
                    <gridLayout row={2}>
                        <scrollView>
                            <gridLayout rows="auto, auto, auto" columns="*, *">
                                {filteredPhotos.length > 0 ? (
                                    filteredPhotos.map((photo, index) => (
                                        <stackLayout key={photo.id} 
                                                   row={Math.floor(index / 2)} 
                                                   col={index % 2} 
                                                   className="m-1">
                                            <gridLayout>
                                                <image src={photo.url} 
                                                       width={imageSize - 2} 
                                                       height={imageSize - 2} 
                                                       className="rounded-xl" 
                                                       stretch="aspectFill"
                                                       onTap={() => handlePhotoTap(photo.id)} />
                                                <gridLayout horizontalAlignment="right" verticalAlignment="top" 
                                                          className="m-2 w-6 h-6"
                                                          onTap={() => togglePhotoSelection(photo.id)}>
                                                    <gridLayout className={`w-6 h-6 rounded-lg border-2 border-white ${selectedPhotos.includes(photo.id) ? 'bg-blue-500' : 'bg-black/30'}`}>
                                                        {selectedPhotos.includes(photo.id) && (
                                                            <label className="text-white text-center font-bold">✓</label>
                                                        )}
                                                    </gridLayout>
                                                </gridLayout>
                                            </gridLayout>
                                            <label className="text-center text-sm text-gray-600 mt-1">
                                                {formatDisplayDate(photo.date)}
                                            </label>
                                        </stackLayout>
                                    ))
                                ) : (
                                    <gridLayout colSpan={2} className="p-8">
                                        <label className="text-gray-500 text-center text-lg">
                                            No hay fotos disponibles para este período
                                        </label>
                                    </gridLayout>
                                )}
                            </gridLayout>
                        </scrollView>
                    </gridLayout>

                    <gridLayout row={3} columns="*, *, *" className="mt-4">
                        <button col={0} 
                                className={`mx-1 p-3 rounded-xl text-center ${selectedPhotos.length === 0 ? 'bg-gray-300 text-gray-500' : 'bg-red-500 text-white'}`} 
                                onTap={deleteSelectedPhotos} 
                                isEnabled={selectedPhotos.length > 0}>
                            Borrar
                        </button>
                        <button col={1} 
                                className={`mx-1 p-3 rounded-xl text-center ${selectedPhotos.length !== 2 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white'}`} 
                                onTap={comparePhotos} 
                                isEnabled={selectedPhotos.length === 2}>
                            Comparar
                        </button>
                        <button col={2} className="mx-1 p-3 rounded-xl text-center bg-green-500 text-white" onTap={addPhoto}>
                            Añadir
                        </button>
                    </gridLayout>
                </>
            )}
        </gridLayout>
    );
}