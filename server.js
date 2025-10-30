// 1. KERAKLI DASTURLARNI CHAQIRAMIZ
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
const PORT = 10000;

// 2. BOT TOKENINI QO'YAMIZ
const TOKEN = '8346445483:AAHz9i-ytrWo242zjdn94Ydp1FUg8MIGcX0';
const bot = new TelegramBot(TOKEN, { polling: true });

// 3. ADMINLAR RO'YXATI
const ADMINS = [5985723887, 382697989];

// 4. RASMLAR VA HTML FAYLLAR UCHUN
app.use(express.static('public'));

// 5. JSON MA'LUMOTLARNI O'QISH
app.use(express.json());

// 6. ASOSIY SAHIFA
app.get('/', (req, res) => {
    res.send('🕌 ISLOMXON MASJIDI Boti ishlayapti!');
});

// 7. /start KOMANDASI
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    console.log('Foydalanuvchi:', userId, 'start bosdi');
    
    if (ADMINS.includes(userId)) {
        // ADMINLAR UCHUN
        bot.sendMessage(chatId, `👋 Admin, xush kelibsiz!\n\nNamoz vaqtlarini kiritish uchun WebApp dan foydalaning:`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📱 Namoz Vaqtlarini Kiriting", web_app: { url: "https://your-app.onrender.com" } }]
                ]
            }
        });
    } else {
        // ODDIY FOYDALANUVCHILAR UCHUN
        bot.sendMessage(chatId, `🕌 ISLOMXON JOME MASJIDI\n\n📢 Kanal: @Islomxon_masjidi\n\n🤖 Bot faqat adminlar uchun`);
    }
});

// 8. KANALGA POST YUBORISH
app.post('/submit-times', async (req, res) => {
    try {
        const { bomdod, quyosh, peshin, asr, shom, xufton } = req.body;
        
        // POST MATNI
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

        // RASM YUBORISH (assets/banner.jpg)
        await bot.sendPhoto('@Islomxon_masjidi', 'https://your-app.onrender.com/assets/banner.jpg', {
            caption: postText,
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "🗺️ Manzil", url: "https://maps.google.com/?q=Islomxon+masjidi+Toshkent" },
                        { text: "📅 Kalendar", url: "https://your-app.onrender.com/calendar" }
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

// 9. TUGMALARGA JAVOB
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    
    if (query.data === 'quran') {
        bot.sendMessage(chatId, '📖 "Namozni toʻliq ado eting');
    } else if (query.data === 'reminder') {
        bot.sendMessage(chatId, '🔔 Eslatma: Har namozdan 10 daqiqa oldin eslatma olish uchun /reminder buyrugʻini bering');
    }
});

// 10. SERVERNI ISHGA TUSHIRISH
app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT} portda ishga tushdi`);
    console.log(`🤖 Bot ishlayapti: @Islomxon_Masjidi_Namoz_Vaqti_Bot`);
});
