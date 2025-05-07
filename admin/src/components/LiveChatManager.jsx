import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { FaComments, FaTimes, FaPaperPlane, FaUser, FaCircle } from 'react-icons/fa';

const LiveChatManager = ({ token }) => {
    const [activeChats, setActiveChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState({});
    const [connected, setConnected] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const socketRef = useRef();

    // Socket bağlantısını kur
    useEffect(() => {
        socketRef.current = io(backendUrl);

        socketRef.current.on('connect', () => {
            console.log('Socket.io bağlantısı kuruldu');
            setConnected(true);
            
            // Admin olarak giriş yap
            socketRef.current.emit('admin_login', { token });
        });
        
        socketRef.current.on('disconnect', () => {
            console.log('Socket.io bağlantısı kesildi');
            setConnected(false);
            toast.error("Canlı destek sunucusu ile bağlantı kesildi!");
        });
        
        // Admin bildirimlerini dinle
        socketRef.current.on('admin_notification', (data) => {
            console.log('Admin bildirimi alındı:', data);
            
            if (data.type === 'user_connected' || data.type === 'guest_connected') {
                // Yeni chat ekle
                setActiveChats(prev => {
                    // Zaten varsa ekleme
                    if (prev.some(chat => chat.chatId === data.chatId)) {
                        return prev;
                    }
                    
                    return [...prev, {
                        chatId: data.chatId,
                        lastMessage: 'Sohbet başlatıldı',
                        timestamp: data.timestamp,
                        unread: true,
                        type: data.type === 'user_connected' ? 'user' : 'guest'
                    }];
                });
                
                // Mesaj geçmişi için boş dizi oluştur
                setMessages(prev => ({
                    ...prev,
                    [data.chatId]: prev[data.chatId] || []
                }));
            }
            
            // Yeni mesaj bildirimi
            if (data.type === 'new_message') {
                // Mesaj geçmişini güncelle
                setMessages(prev => {
                    const chatMessages = prev[data.chatId] || [];
                    // Eğer aynı mesaj zaten varsa ekleme
                    if (chatMessages.some(msg => 
                        msg.message === data.message && 
                        msg.sender === data.sender &&
                        Math.abs(new Date(msg.timestamp) - new Date(data.timestamp)) < 1000
                    )) {
                        return prev;
                    }
                    
                    return {
                        ...prev,
                        [data.chatId]: [...chatMessages, {
                            message: data.message,
                            sender: data.sender,
                            timestamp: data.timestamp
                        }]
                    };
                });
                
                // Aktif sohbetleri güncelle
                setActiveChats(prev => {
                    const updatedChats = prev.map(chat => {
                        if (chat.chatId === data.chatId) {
                            return {
                                ...chat,
                                lastMessage: data.message,
                                timestamp: data.timestamp,
                                unread: selectedChat !== data.chatId
                            };
                        }
                        return chat;
                    });
                    
                    // Chat listede yoksa ekle
                    if (!prev.some(chat => chat.chatId === data.chatId)) {
                        updatedChats.push({
                            chatId: data.chatId,
                            lastMessage: data.message,
                            timestamp: data.timestamp,
                            unread: true,
                            type: 'unknown'
                        });
                    }
                    
                    return updatedChats;
                });
            }
        });
        
        // Mesaj alındığında
        socketRef.current.on('receive_message', (data) => {
            console.log('Mesaj alındı:', data);
            
            if (!data.chatId || !data.message) return;
            
            // Mesaj geçmişini güncelle
            setMessages(prev => {
                const chatMessages = prev[data.chatId] || [];
                // Eğer aynı mesaj zaten varsa ekleme
                if (chatMessages.some(msg => 
                    msg.message === data.message && 
                    msg.sender === data.sender &&
                    Math.abs(new Date(msg.timestamp) - new Date(data.timestamp)) < 1000
                )) {
                    return prev;
                }
                
                return {
                    ...prev,
                    [data.chatId]: [...chatMessages, {
                        message: data.message,
                        sender: data.sender,
                        timestamp: data.timestamp
                    }]
                };
            });
        });

        socketRef.current.on('chat_history', (data) => {
            console.log('Chat geçmişi alındı:', data);
            if (data.messages && selectedChat) {
                setMessages(prev => ({
                    ...prev,
                    [selectedChat]: data.messages
                }));
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [token, selectedChat]);

    // Mesajları otomatik kaydır
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, selectedChat]);

    // Chat seç
    const selectChat = (chatId) => {
        setSelectedChat(chatId);
        
        // Okundu olarak işaretle
        setActiveChats(prev => prev.map(chat => 
            chat.chatId === chatId ? { ...chat, unread: false } : chat
        ));
        
        // Chat odasına katıl
        socketRef.current.emit('join_chat', { chatId });
    };

    // Mesaj gönder
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedChat || !connected || isSending) return;
        
        const messageData = {
            chatId: selectedChat,
            message: message.trim(),
            sender: 'Admin',
            timestamp: new Date().toISOString()
        };
        
        setIsSending(true);
        
        // Mesajı gönder ve geri bildirim bekle
        socketRef.current.emit('send_message', messageData, (response) => {
            setIsSending(false);
            
            if (response && response.error) {
                toast.error(`Mesaj gönderilemedi: ${response.error}`);
                return;
            }
            
            // Mesajı başarıyla gönderdik, mesaj kutusunu temizle
            setMessage('');
        });
        
        // Mesajı hemen göster (optimistik güncelleme)
        setMessages(prev => {
            const chatMessages = prev[selectedChat] || [];
            return {
                ...prev,
                [selectedChat]: [...chatMessages, messageData]
            };
        });
    };

    // Zaman formatla
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        
        try {
            return new Date(timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } catch (error) {
            return '';
        }
    };
    
    // Tarih formatla
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        
        try {
            return new Date(timestamp).toLocaleDateString('tr-TR');
        } catch (error) {
            return '';
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
                <h1 className="text-xl font-bold">Canlı Destek Yönetimi</h1>
                <p className="text-gray-600">
                    {connected ? (
                        <span className="flex items-center text-green-600">
                            <FaCircle className="mr-2" size={10} /> Bağlı
                        </span>
                    ) : (
                        <span className="flex items-center text-red-600">
                            <FaCircle className="mr-2" size={10} /> Bağlantı Kesildi
                        </span>
                    )}
                </p>
            </div>
            
            <div className="flex-1 flex overflow-hidden bg-white shadow-sm rounded-lg">
                {/* Sol panel - Chat listesi */}
                <div className="w-1/3 border-r">
                    <div className="p-4 border-b">
                        <h2 className="font-medium">Aktif Görüşmeler</h2>
                    </div>
                    
                    <div className="overflow-y-auto h-[calc(100%-57px)]">
                        {activeChats.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                                <FaComments className="text-gray-300 mb-3" size={36} />
                                <p>Henüz aktif bir görüşme bulunmuyor.</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {activeChats.map(chat => (
                                    <div 
                                        key={chat.chatId}
                                        onClick={() => selectChat(chat.chatId)}
                                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                                            selectedChat === chat.chatId ? 'bg-blue-50' : ''
                                        } ${chat.unread ? 'font-medium' : ''}`}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                <FaUser className="text-gray-500" />
                                            </div>
                                            <div className="ml-3 flex-1 overflow-hidden">
                                                <div className="flex justify-between items-center">
                                                    <p className="truncate">
                                                        {chat.type === 'user' ? 'Kullanıcı' : 'Misafir'}
                                                    </p>
                                                    <span className="text-xs text-gray-500">
                                                        {formatTime(chat.timestamp)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                                            </div>
                                        </div>
                                        
                                        {chat.unread && (
                                            <div className="mt-1 flex justify-end">
                                                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                    Yeni
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Sağ panel - Mesajlar */}
                <div className="w-2/3 flex flex-col">
                    {selectedChat ? (
                        <>
                            <div className="p-4 border-b flex justify-between items-center">
                                <h2 className="font-medium">
                                    Sohbet ID: <span className="text-gray-600">{selectedChat}</span>
                                </h2>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages[selectedChat]?.length > 0 ? (
                                    messages[selectedChat].map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${
                                                msg.sender === 'Admin' ? 'justify-end' : 'justify-start'
                                            }`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-lg p-3 ${
                                                    msg.sender === 'Admin'
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                <p className="text-sm">{msg.message}</p>
                                                <div className="text-xs opacity-75 mt-1 flex justify-between">
                                                    <span>{msg.sender}</span>
                                                    <span>{formatTime(msg.timestamp)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-gray-500 text-center">
                                            Henüz mesaj yok. Görüşmeyi başlatmak için bir mesaj gönderin.
                                        </p>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            
                            <div className="p-4 border-t">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Mesajınızı yazın..."
                                        className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                        disabled={isSending || !connected}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!connected || !message.trim() || isSending}
                                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSending ? (
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <FaPaperPlane size={16} />
                                        )}
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center p-8">
                                <FaComments className="mx-auto text-gray-300 mb-4" size={48} />
                                <h3 className="text-xl font-medium mb-2">Canlı Destek</h3>
                                <p className="text-gray-600 mb-6">
                                    Görüşme başlatmak için sol taraftan bir sohbet seçin.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveChatManager; 