import React, { useState, useEffect, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import { FaComments, FaTimes, FaPaperPlane, FaRegSmile, FaSpinner } from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const LiveChat = () => {
    const { token, backendUrl } = useContext(ShopContext);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const [chatId, setChatId] = useState(null);
    const [connecting, setConnecting] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const socketRef = useRef();
    const chatContainerRef = useRef(null);

    // Socket bağlantısını kur
    useEffect(() => {
        if (!socketRef.current && !connecting) {
            try {
                setConnecting(true);
                console.log('Socket.io bağlantısı kuruluyor...');
                socketRef.current = io(backendUrl, {
                    reconnection: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                    timeout: 10000
                });
                
                socketRef.current.on('connect', () => {
                    console.log('Socket.io bağlantısı kuruldu');
                    setConnected(true);
                    setConnecting(false);
                    
                    // Token varsa kullanıcı bilgilerini gönder
                    if (token) {
                        socketRef.current.emit('user_connected', { token });
                    } else {
                        // Token yoksa geçici bir oturum ID'si oluştur
                        const sessionId = 'guest_' + Math.random().toString(36).substring(2, 15);
                        setChatId(sessionId);
                        socketRef.current.emit('guest_connected', { sessionId });
                    }
                });
                
                socketRef.current.on('connect_error', (error) => {
                    console.error('Socket.io bağlantı hatası:', error);
                    setConnecting(false);
                    setConnected(false);
                });
                
                socketRef.current.on('disconnect', () => {
                    console.log('Socket.io bağlantısı kesildi');
                    setConnected(false);
                });
                
                socketRef.current.on('chat_id', (data) => {
                    console.log('Chat ID alındı:', data.chatId);
                    setChatId(data.chatId);
                });
                
                socketRef.current.on('chat_history', (data) => {
                    console.log('Chat geçmişi alındı:', data.messages);
                    setMessages(data.messages || []);
                });
                
                socketRef.current.on('receive_message', (data) => {
                    console.log('Mesaj alındı:', data);
                    if (data && data.message) {
                        if (data.sender === 'Müşteri' && isSending) {
                            setIsSending(false);
                            return;
                        }
                        
                        setMessages(prev => [...prev, data]);
                    }
                });
                
                socketRef.current.on('error', (error) => {
                    console.error('Socket.io hata:', error);
                    if (isOpen) {
                        toast.error('Bağlantı hatası: ' + error.message);
                    }
                });
            } catch (error) {
                console.error('Socket.io bağlantı hatası:', error);
                setConnecting(false);
                if (isOpen) {
                    toast.error('Canlı destek sunucusuna bağlanılamadı');
                }
            }
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [backendUrl, token, isOpen]);

    // Mesajları otomatik kaydır
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Chat açıldığında bağlantı yoksa yeniden bağlanmayı dene
    useEffect(() => {
        if (isOpen && !connected && !socketRef.current && !connecting) {
            // Chat açıldı ve bağlantı yok, yeniden bağlanmayı dene
            socketRef.current = null; // Referansı sıfırla
            console.log('Chat açıldı, bağlantı yeniden kuruluyor...');
        }
    }, [isOpen, connected, connecting]);

    // Mesaj gönderme
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) {
            return;
        }
        
        if (!connected || !socketRef.current) {
            toast.error('Sunucuya bağlantı kurulamadı. Lütfen sayfayı yenileyip tekrar deneyin.');
            return;
        }
        
        if (!chatId) {
            toast.error('Oturum bilgisi alınamadı. Lütfen bir kaç saniye sonra tekrar deneyin.');
            return;
        }

        const messageData = {
            chatId,
            message: message.trim(),
            sender: 'Müşteri',
            timestamp: new Date().toISOString()
        };

        console.log('Mesaj gönderiliyor:', messageData);
        
        try {
            setIsSending(true);
            
            socketRef.current.emit('send_message', messageData, (response) => {
                if (response && response.error) {
                    toast.error('Mesaj gönderilemedi: ' + response.error);
                    setIsSending(false);
                    return;
                }
                
                console.log('Mesaj başarıyla gönderildi');
            });
            
            setMessages(prev => [...prev, messageData]);
            setMessage('');
            
            setTimeout(() => {
                setIsSending(false);
            }, 2000);
        } catch (error) {
            console.error('Mesaj gönderme hatası:', error);
            toast.error('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
            setIsSending(false);
        }
    };

    // Saat formatını ayarla
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="fixed bottom-4 left-4 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:bg-indigo-700 transition-all duration-300 transform hover:scale-110 animate-pulse"
                    aria-label="Canlı Desteği Aç"
                >
                    <FaComments size={24} />
                </button>
            ) : (
                <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 h-[450px] flex flex-col border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">Canlı Destek</h3>
                            <p className="text-xs text-indigo-200">
                                {connected ? 'Bağlı' : 'Bağlanıyor...'}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:text-gray-200 bg-white/10 rounded-full p-2 transition-colors"
                            aria-label="Canlı Desteği Kapat"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div 
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
                    >
                        {!connected ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <FaSpinner className="animate-spin mx-auto text-indigo-500 text-2xl mb-3" />
                                    <p className="text-gray-500">
                                        Sunucuya bağlanıyor...<br />
                                        Lütfen bekleyin.
                                    </p>
                                </div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center bg-white p-6 rounded-xl shadow-sm max-w-xs">
                                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaComments className="text-indigo-500 text-2xl" />
                                    </div>
                                    <h4 className="font-bold text-gray-800 mb-2">Merhaba!</h4>
                                    <p className="text-gray-600 text-sm">
                                        Size nasıl yardımcı olabiliriz? Lütfen mesajınızı yazın.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        msg.sender === 'Müşteri' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-xl p-3 shadow-sm ${
                                            msg.sender === 'Müşteri'
                                                ? 'bg-indigo-600 text-white rounded-br-none'
                                                : 'bg-white text-gray-800 rounded-bl-none'
                                        }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                        <div className={`text-xs mt-1 text-right ${
                                            msg.sender === 'Müşteri' ? 'text-indigo-100' : 'text-gray-500'
                                        }`}>
                                            {formatTime(msg.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t bg-white">
                        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Mesajınızı yazın..."
                                className="flex-1 p-3 rounded-full border border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 focus:outline-none text-sm"
                                disabled={!connected || isSending}
                            />
                            <button
                                type="button"
                                className="text-indigo-500 p-2 hover:text-indigo-700 transition-colors"
                                aria-label="Emoji Ekle"
                                disabled={!connected || isSending}
                            >
                                <FaRegSmile size={20} />
                            </button>
                            <button
                                type="submit"
                                disabled={!connected || !message.trim() || isSending}
                                className={`p-3 rounded-full transition-colors ${
                                    connected && message.trim() && !isSending
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                                aria-label="Mesaj Gönder"
                            >
                                {isSending ? <FaSpinner className="animate-spin" size={16} /> : <FaPaperPlane size={16} />}
                            </button>
                        </form>
                    </div>
                    
                    {/* Footer */}
                    <div className="px-3 py-2 bg-gray-50 border-t text-[10px] text-center text-gray-500">
                        Forever Mağazası Canlı Destek © {new Date().getFullYear()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveChat; 