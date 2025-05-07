import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import apiRouter from './routes/index.js'
import { Server } from 'socket.io'
import http from 'http'

// App Config
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api', apiRouter)

// Aktif görüşmeleri saklama
const activeChats = new Map();
// Admin socket'lerini saklama
const adminSockets = new Set();

// Socket.IO olayları
io.on('connection', (socket) => {
    console.log('Yeni bir kullanıcı bağlandı:', socket.id);
    
    // Admin giriş
    socket.on('admin_login', async (data) => {
        try {
            const { token } = data;
            
            // Token'ı doğrula (gerçek uygulamada doğrulama yapılmalı)
            console.log('Admin bağlandı:', socket.id);
            
            // Bu socket'i admin olarak işaretle
            adminSockets.add(socket.id);
            
            // Mevcut aktif sohbetleri gönder
            for (const [chatId, chatData] of activeChats.entries()) {
                socket.emit('admin_notification', {
                    type: chatData.type === 'user' ? 'user_connected' : 'guest_connected',
                    chatId,
                    timestamp: chatData.timestamp
                });
                
                // Bu sohbetin mesajlarını gönder
                if (chatData.messages && chatData.messages.length > 0) {
                    for (const msg of chatData.messages) {
                        socket.emit('admin_notification', {
                            type: 'new_message',
                            chatId,
                            sender: msg.sender,
                            message: msg.message,
                            timestamp: msg.timestamp
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Admin login hatası:', error);
        }
    });
    
    // Kullanıcı bağlantısı (oturum açmış)
    socket.on('user_connected', async (data) => {
        try {
            const { token } = data;
            
            // Token'ı doğrula ve kullanıcı bilgilerini al
            // Not: Gerçek bir uygulamada token doğrulaması yapıp kullanıcıyı tanımlamak gerekir
            
            // Örnek için basit bir chat ID oluştur
            const chatId = `user_${Date.now()}`;
            
            // Kullanıcıyı chat odasına kat
            socket.join(chatId);
            console.log(`Oturum açmış kullanıcı chat odasına katıldı: ${chatId}`);
            
            // Aktif görüşmelere ekle
            activeChats.set(chatId, {
                type: 'user',
                socketId: socket.id,
                timestamp: new Date().toISOString(),
                messages: []
            });
            
            // Chat ID'yi kullanıcıya gönder
            socket.emit('chat_id', { chatId });
            
            // Boş chat geçmişi gönder (gerçek uygulamada veritabanından yüklenir)
            socket.emit('chat_history', { messages: [] });
            
            // Admin'e kullanıcı bağlandı bildirimi
            for (const adminSocketId of adminSockets) {
                io.to(adminSocketId).emit('admin_notification', {
                    type: 'user_connected',
                    chatId,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('Kullanıcı bağlantı hatası:', error);
        }
    });
    
    // Misafir kullanıcı bağlantısı
    socket.on('guest_connected', (data) => {
        try {
            const { sessionId } = data;
            const chatId = sessionId || `guest_${Date.now()}`;
            
            // Kullanıcıyı chat odasına kat
            socket.join(chatId);
            console.log(`Misafir kullanıcı chat odasına katıldı: ${chatId}`);
            
            // Aktif görüşmelere ekle
            activeChats.set(chatId, {
                type: 'guest',
                socketId: socket.id,
                timestamp: new Date().toISOString(),
                messages: []
            });
            
            // Chat ID'yi kullanıcıya gönder
            socket.emit('chat_id', { chatId });
            
            // Boş chat geçmişi gönder (gerçek uygulamada veritabanından yüklenir)
            socket.emit('chat_history', { messages: [] });
            
            // Admin'e misafir bağlandı bildirimi
            for (const adminSocketId of adminSockets) {
                io.to(adminSocketId).emit('admin_notification', {
                    type: 'guest_connected',
                    chatId,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('Misafir bağlantı hatası:', error);
        }
    });
    
    // Mesaj gönderme
    socket.on('send_message', (data, callback) => {
        try {
            const { chatId, message, sender, timestamp } = data;
            
            if (!chatId || !message) {
                console.error('Eksik mesaj bilgileri:', data);
                if (callback) callback({ error: 'Eksik mesaj bilgileri' });
                return;
            }
            
            console.log(`Mesaj alındı - Oda: ${chatId}, Gönderen: ${sender}`);
            
            // Mesajı aynı chat odasındaki herkese gönder
            const messageData = {
                chatId,
                message,
                sender,
                timestamp: timestamp || new Date().toISOString()
            };
            
            // Önceki mesaja ekle
            if (activeChats.has(chatId)) {
                const chat = activeChats.get(chatId);
                chat.messages.push(messageData);
                activeChats.set(chatId, chat);
            }
            
            // Mesajı odadaki diğer kullanıcılara gönder (sender dışındakilere)
            socket.to(chatId).emit('receive_message', messageData);
            
            // Admin'e yeni mesaj bildirimi (eğer admin değilse)
            if (sender !== 'Admin') {
                for (const adminSocketId of adminSockets) {
                    io.to(adminSocketId).emit('admin_notification', {
                        type: 'new_message',
                        chatId,
                        sender,
                        message,
                        timestamp: timestamp || new Date().toISOString()
                    });
                }
            }
            
            // Gerçek bir uygulamada mesajı veritabanına kaydetmek gerekir
            if (callback) callback({ success: true });
        } catch (error) {
            console.error('Mesaj gönderme hatası:', error);
            if (callback) callback({ error: error.message });
        }
    });
    
    // Sohbete katılma (admin için)
    socket.on('join_chat', (data) => {
        try {
            const { chatId } = data;
            
            if (!chatId) {
                console.error('Chat ID eksik:', data);
                return;
            }
            
            socket.join(chatId);
            console.log(`Kullanıcı sohbete katıldı: ${chatId}`);
            
            // Aktif görüşmedeki mesajları gönder
            if (activeChats.has(chatId)) {
                const chat = activeChats.get(chatId);
                socket.emit('chat_history', { messages: chat.messages || [] });
            }
        } catch (error) {
            console.error('Sohbete katılma hatası:', error);
        }
    });

    // Bağlantı kesildiğinde
    socket.on('disconnect', () => {
        console.log('Kullanıcı ayrıldı:', socket.id);
        
        // Eğer admin ise, admin listesinden çıkar
        if (adminSockets.has(socket.id)) {
            adminSockets.delete(socket.id);
        }
        
        // Aktif görüşmelerden varsa, bu socket'e ait olanı kaldır
        for (const [chatId, chatData] of activeChats.entries()) {
            if (chatData.socketId === socket.id) {
                // Gerçek uygulamada mesajları saklayabilir veya başka işlemler yapabilirsiniz
                // Burada sadece bir süre sonra siliyoruz
                setTimeout(() => {
                    // Eğer başka bir socket bağlanmadıysa bu odaya, odayı sil
                    if (activeChats.has(chatId) && activeChats.get(chatId).socketId === socket.id) {
                        activeChats.delete(chatId);
                        console.log(`Chat odası silindi: ${chatId}`);
                    }
                }, 30000); // 30 saniye sonra sil (yeniden bağlanma şansı vermek için)
                break;
            }
        }
    });
})

app.get('/',(req,res)=>{
    res.send("API Working")
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`)
})