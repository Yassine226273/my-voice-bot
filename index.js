const { Telegraf, Markup } = require('telegraf');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const http = require('http');

const BOT_TOKEN = '8744351193:AAHEXILIZ7IfjqzGHj-kdLRh4uPFn3o_znY';
const bot = new Telegraf(BOT_TOKEN);
const tts = new MsEdgeTTS();

// --- نظام الحماية (أدخل معرفك هنا إذا كنت تعرفه، أو سيعينه البوت لأول من يراسلُه) ---
let ADMIN_ID = null; 

// --- سيرفر لإبقاء البوت حياً وتلبية شروط Render ---
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('FENNTEL Voice Studio is Online');
});

// Render يطلب الاستماع للمنفذ الذي يحدده هو
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// منع النوم كل 10 دقائق
setInterval(() => {
    http.get("https://my-voice-bot-s9b0.onrender.com");
}, 10 * 60 * 1000);

// --- أوامر البوت ---
bot.start((ctx) => {
    if (!ADMIN_ID) ADMIN_ID = ctx.from.id;
    if (ctx.from.id === ADMIN_ID) {
        ctx.reply('مرحباً بك في استوديو FENNTEL الصوتي. أرسل النص الإنجليزي الآن.');
    }
});

bot.on('text', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('صوت بريطاني أنيق (Ryan) 🎙️', 'gen_ryan')],
        [Markup.button.callback('صوت بريطاني واثق (Thomas) 🏛️', 'gen_thomas')]
    ]);
    ctx.reply('اختر الشخصية الصوتية المقنعة:', keyboard);
});

bot.action(/gen_(ryan|thomas)/, async (ctx) => {
    const voiceType = ctx.match[1] === 'ryan' ? "en-GB-RyanNeural" : "en-GB-ThomasNeural";
    const text = ctx.callbackQuery.message.reply_to_message?.text;

    if (!text) return ctx.reply('عذراً، لم أجد النص. أرسله مرة أخرى.');

    try {
        await ctx.answerCbQuery('جاري التوليد بجودة عالية...');
        const buffer = await tts.getAudio(text, {
            voiceName: voiceType,
            outputFormat: OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
            rate: "-8%" // سرعة هادئة لإعطاء هيبة
        });

        await ctx.replyWithAudio({ source: buffer }, { 
            title: "British Voice", 
            performer: "FENNTEL AI" 
        });
    } catch (err) {
        console.error(err);
        ctx.reply('حدث خطأ فني، قد يكون النص طويلاً جداً أو غير مدعوم.');
    }
});

// صائد الأخطاء لضمان عدم توقف البوت
bot.catch((err) => {
    console.log('Telegraf Error:', err);
});

bot.launch();
