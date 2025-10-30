const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
const PORT = 10000;

const TOKEN = '8353179858:AAFMgCR5KLWOh7-4Tid-A4x1RAwPd3-Y9xE';
const bot = new TelegramBot(TOKEN, { polling: true });
const ADMINS = [5985723887, 382697989];

// Static fayllar
app.use(express.static('public'));
app.use(express.json());

// Asosiy sahifa
app.get('/', (req, res) => {
    res.send('🕌 ISLOMXON MASJIDI Boti ishlayapti!');
});

// /start komandasi
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (ADMINS.includes(userId)) {
        const webAppUrl = `https://masjid-g8xh.onrender.com`;
        
        bot.sendMessage(chatId, `👋 Admin, xush kelibsiz!\n\nNamoz vaqtlarini kiritish uchun WebApp dan foydalaning:`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📱 Namoz Vaqtlarini Kiriting", web_app: { url: webAppUrl } }]
                ]
            }
        });
    } else {
        bot.sendMessage(chatId, `🕌 ISLOMXON JOME MASJIDI\n\n📢 Kanal: @Islomxon_masjidi\n\n🤖 Bot faqat adminlar uchun`);
    }
});

// Kanalga post yuborish
app.post('/submit-times', async (req, res) => {
    try {
        const { bomdod, quyosh, peshin, asr, shom, xufton } = req.body;
        
        const postText = `🕌 ISLOMXON JOME MASJIDI
📅 ${new Date().toLocaleDateString('uz-UZ')}

🕐 Namoz Vaqtlari:

🌄 Bomdod: ${bomdod}
☀️ Quyosh: ${quyosh}
🏙 Peshin: ${peshin}
🌅 Asr: ${asr}
🌇 Shom: ${shom}  
🌙 Xufton: ${xufton}

🎯 Namozni vaqtida ado eting!`;

        // Internetdagi rasm ishlatamiz (placeholder)
        const imageUrl = 'https://images.unsplash.com/photo-1560983074-8c6f5f2d8e4f?w=500';
        
        await bot.sendPhoto('@Islomxon_masjidi', imageUrl, {
            caption: postText,
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "🗺️ Manzil", url: "https://maps.google.com/?q=Toshkent+masjid" },
                        { text: "📅 Kalendar", url: "https://masjid-g8xh.onrender.com" }
                    ],
                    [
                        { text: "📖 Quran Oyatlari", callback_data: "quran" },
                        { text: "🔔 Eslatma", callback_data: "reminder" }
                    ]
                ]
            }
        });

        res.json({ success: true, message: '✅ Post kanalga muvaffaqiyatli joylandi!' });

    } catch (error) {
        console.error('Xatolik:', error);
        res.json({ success: false, message: '❌ Xatolik: ' + error.message });
    }
});

// Tugmalarga javob
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    
    if (query.data === 'quran') {
        bot.sendMessage(chatId, '📖 "Namozni toʻliq ado eting va Allohga boʻlingan shukrni bajaring" (Quran, 2:43)');
    } else if (query.data === 'reminder') {
        bot.sendMessage(chatId, '🔔 Eslatma: Har namozdan 10 daqiqa oldin eslatma sozlash uchun botga /reminder bering');
    }
});

// Serverni ishga tushirish
app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT} portda ishga tushdi`);
    console.log(`🌐 WebApp: https://masjid-g8xh.onrender.com`);
});
