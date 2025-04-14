import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";
import { ImageSource, Screen, Application, Color, isAndroid, KeyboardType, TextField, isIOS } from "@nativescript/core";
import { ChatService, ChatMessage } from '../api/ChatService';
import { TrainerService, Trainer } from '../api/TrainerService';

type ChatProps = {
    route: RouteProp<MainStackParamList, "Chat">,
    navigation: FrameNavigationProp<MainStackParamList, "Chat">,
};

export function Chat({ navigation }: ChatProps) {
    const [messages, setMessages] = React.useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = React.useState("");
    const [trainer, setTrainer] = React.useState<Trainer | null>(null);
    const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);
    const scrollViewRef = React.useRef(null);
    const textFieldRef = React.useRef(null);

    // Simplified useEffect to reduce potential issues
    React.useEffect(() => {
        loadMessages();
        loadTrainerProfile();
        
        if (isAndroid) {
            Application.android.on(Application.android.activityBackPressedEvent, onBackButtonPress);
            return () => {
                Application.android.off(Application.android.activityBackPressedEvent, onBackButtonPress);
            };
        }
    }, []);

    // Handle back button press to dismiss keyboard if visible
    const onBackButtonPress = () => {
        if (isKeyboardVisible && textFieldRef.current) {
            textFieldRef.current.dismissSoftInput();
            return true;
        }
        return false;
    };

    const handleTextFieldFocus = () => {
        setIsKeyboardVisible(true);
        // Ensure the view scrolls to show the input field
        setTimeout(() => {
            try {
                if (scrollViewRef.current) {
                    // Use the correct scrolling method
                    if (typeof scrollViewRef.current.scrollToVerticalOffset === 'function') {
                        scrollViewRef.current.scrollToVerticalOffset(scrollViewRef.current.scrollableHeight, false);
                    } else if (scrollViewRef.current.nativeView) {
                        // Alternative approach for iOS
                        const scrollView = scrollViewRef.current.nativeView;
                        scrollView.scrollToVerticalOffset(scrollView.contentSize.height, false);
                    }
                }
            } catch (error) {
                console.error("Error scrolling on focus:", error);
            }
        }, 300);
    };

    // Also update the scroll effect with the same fix
    React.useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                try {
                    if (scrollViewRef.current) {
                        // Use the correct scrolling method
                        if (typeof scrollViewRef.current.scrollToVerticalOffset === 'function') {
                            scrollViewRef.current.scrollToVerticalOffset(scrollViewRef.current.scrollableHeight, false);
                        } else if (scrollViewRef.current.nativeView) {
                            // Alternative approach for iOS
                            const scrollView = scrollViewRef.current.nativeView;
                            scrollView.scrollToVerticalOffset(scrollView.contentSize.height, false);
                        }
                    }
                } catch (error) {
                    console.error("Error in scroll effect:", error);
                }
            }, 100);
        }
    }, [messages]);

    const handleTextFieldBlur = () => {
        setIsKeyboardVisible(false);
    };

    // Simplified scroll effect
    React.useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                try {
                    if (scrollViewRef.current) {
                        scrollViewRef.current.scrollToVerticalOffset(scrollViewRef.current.scrollableHeight, false);
                    }
                } catch (error) {
                    console.error("Error in scroll effect:", error);
                }
            }, 100);
        }
    }, [messages]);

    const loadTrainerProfile = async () => {
        try {
            const trainerData = await TrainerService.getTrainerProfile();
            setTrainer(trainerData);
        } catch (error) {
            console.error('Error loading trainer profile:', error);
        }
    };

    const loadMessages = async () => {
        try {
            const chatMessages = await ChatService.getMessages();
            setMessages(chatMessages);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const sendMessage = async () => {
        try {
            if (newMessage.trim() !== "") {
                try {
                    const sentMessage = await ChatService.sendMessage(newMessage);
                    setMessages(prev => [...prev, sentMessage]);
                    setNewMessage("");
                    
                    // Dismiss keyboard after sending
                    if (textFieldRef.current) {
                        textFieldRef.current.dismissSoftInput();
                    }
                } catch (error) {
                    console.error('Error sending message:', error);
                }
            }
        } catch (error) {
            console.error("Error in sendMessage:", error);
        }
    };

    const formatTime = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false
            });
        } catch (error) {
            console.error("Error formatting time:", error);
            return "";
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const options: Intl.DateTimeFormatOptions = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            return date.toLocaleDateString('es-ES', options);
        } catch (error) {
            console.error("Error formatting date:", error);
            return "";
        }
    };

    const groupMessagesByDate = (messages: ChatMessage[]) => {
        try {
            const groups: { [key: string]: ChatMessage[] } = {};
            messages.forEach(message => {
                const dateKey = new Date(message.timestamp).toDateString();
                if (!groups[dateKey]) {
                    groups[dateKey] = [];
                }
                groups[dateKey].push(message);
            });
            return groups;
        } catch (error) {
            console.error("Error grouping messages:", error);
            return {};
        }
    };

    const messageGroups = React.useMemo(() => groupMessagesByDate(messages), [messages]);

    // Simplified UI structure - removed page element
    return (
        <gridLayout rows="auto, *, auto" columns="*" className="page">
            {/* Header */}
            <gridLayout row={0} columns="auto, *, auto" className="p-4" backgroundColor="#95cfe0">
                <image
                    col={0}
                    className="h-6 w-6 mr-2"
                    src="~/imagenes/left-arrow.png"
                    onTap={() => navigation.goBack()}
                />
                <stackLayout col={1} orientation="horizontal" className="items-center">
                    <image src={trainer?.profile_picture || ""} className="w-11 h-11 rounded-full mr-2" />
                    <label className="text-black text-lg font-bold">{trainer ? `${trainer.name} ${trainer.surname}` : 'Cargando...'}</label>
                </stackLayout>
            </gridLayout>

            {/* Chat messages - Simplified structure */}
            <scrollView row={1} className="px-4" backgroundColor="#ECE5DD" ref={scrollViewRef}>
                <stackLayout>
                    {Object.entries(messageGroups || {}).map(([date, msgs], dateIndex) => (
                        <stackLayout key={`date-${dateIndex}`}>
                            <label className="text-center text-xs bg-white rounded-lg px-2 py-1 my-2">
                                {msgs && msgs.length > 0 ? formatDate(msgs[0].timestamp) : ''}
                            </label>
                            {msgs && msgs.map((msg, msgIndex) => (
                                <gridLayout key={`msg-${msgIndex}`} columns="*" className={`mb-2 ${msg.sender === 'Cliente' ? 'justify-end' : 'justify-start'}`}>
                                    <stackLayout className={`p-3 rounded-lg max-w-2/3 ${msg.sender === 'Cliente' ? 'bg-green-200 ml-4' : 'bg-white mr-4'}`}>
                                        <label className="text-black" textWrap={true}>{msg.message}</label>
                                        <label className="text-xs text-gray-500 text-right">
                                            {formatTime(msg.timestamp)}
                                        </label>
                                    </stackLayout>
                                </gridLayout>
                            ))}
                        </stackLayout>
                    ))}
                </stackLayout>
            </scrollView>

            {/* Message input - Simplified */}
            <gridLayout row={2} columns="*, auto" className="bg-gray-200 p-2">
                <textField col={0} 
                          hint="Escribe un mensaje..." 
                          text={newMessage} 
                          onTextChange={(args) => setNewMessage(args.value)} 
                          returnKeyType="send" 
                          onReturnPress={sendMessage}
                          onFocus={handleTextFieldFocus}
                          onBlur={handleTextFieldBlur}
                          ref={textFieldRef}
                          className="bg-white rounded-full px-4 py-2 text-black" />
                <button col={1} 
                        text="➤"
                        className="ml-2 w-12 h-12 rounded-full bg-green-500 text-white text-center" 
                        onTap={sendMessage} />
            </gridLayout>
        </gridLayout>
    );
}