const { Telegraf, Markup } = require('telegraf');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const http = require('http');

const BOT_TOKEN = '8744351193:AAHEXILIZ7IfjqzGHj-kdLRh4uPFn3o_znY';
const bot = new Telegraf(BOT_TOKEN);
const tts = new MsEdgeTTS();

let ADMIN_ID = null; 
// ذاكرة مؤقتة لحفظ النص لكل مستخدم
const userTextCache = new Map();

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('FENNTEL Studio Active');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);

setInterval(() => {
    http.get("https://my-voice-bot-s9b0.onrender.com").on('error', (e) => console.log('Ping error'));
}, 10 * 60 * 1000);

bot.start((ctx) => {
    if (!ADMIN_ID) ADMIN_ID = ctx.from.id;
    if (ctx.from.id === ADMIN_ID) {
        ctx.reply('مرحباً بك في استوديو FENNTEL الصوتي. أرسل النص الإنجليزي الآن.');
    }
});

bot.on('text', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    
    // حفظ النص في الذاكرة المؤقتة للمستخدم
    userTextCache.set(ctx.from.id, ctx.message.text);

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('صوت بريطاني أنيق (Ryan) 🎙️', 'gen_ryan')],
        [Markup.button.callback('صوت بريطاني واثق (Thomas) 🏛️', 'gen_thomas')]
    ]);
    ctx.reply('اختر الشخصية الصوتية المقنعة:', keyboard);
});

bot.action(/gen_(ryan|thomas)/, async (ctx) => {
    const voiceType = ctx.match[1] === 'ryan' ? "en-GB-RyanNeural" : "en-GB-ThomasNeural";
    // جلب النص من الذاكرة المؤقتة
    const text = userTextCache.get(ctx.from.id);

    if (!text) {
        return ctx.reply('عذراً، انتهت جلسة النص. يرجى إعادة إرسال النص مرة أخرى.');
    }

    try {
        await ctx.answerCbQuery('جاري التوليد بجودة عالية...');
        const buffer = await tts.getAudio(text, {
            voiceName: voiceType,
            outputFormat: OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
            rate: "-8%"
        });

        await ctx.replyWithAudio({ source: buffer }, { 
            title: "FENNTEL Voice", 
            performer: "British Elegant" 
        });
    } catch (err) {
        console.error(err);
        ctx.reply('حدث خطأ أثناء معالجة الصوت.');
    }
});

bot.catch((err) => console.log('Error:', err));
bot.launch();
