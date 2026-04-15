const { Telegraf, Markup } = require('telegraf');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const http = require('http');

const BOT_TOKEN = '8744351193:AAHEXILIZ7IfjqzGHj-kdLRh4uPFn3o_znY';
const bot = new Telegraf(BOT_TOKEN);
const tts = new MsEdgeTTS();

let ADMIN_ID = null; 
const userTextCache = new Map();

// سيرفر Render
http.createServer((req, res) => { res.end('Active'); }).listen(process.env.PORT || 3000);

bot.start((ctx) => {
    ADMIN_ID = ctx.from.id;
    ctx.reply('مرحباً بك يا مدير. أرسل النص الإنجليزي الآن.');
});

bot.on('text', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    userTextCache.set(ctx.from.id, ctx.message.text);
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('صوت بريطاني أنيق (Ryan) 🎙️', 'gen_ryan')],
        [Markup.button.callback('صوت بريطاني واثق (Thomas) 🏛️', 'gen_thomas')]
    ]);
    ctx.reply('اختر الشخصية الصوتية:', keyboard);
});

bot.action(/gen_(ryan|thomas)/, async (ctx) => {
    const voiceType = ctx.match[1] === 'ryan' ? "en-GB-RyanNeural" : "en-GB-ThomasNeural";
    const text = userTextCache.get(ctx.from.id);

    try {
        await ctx.answerCbQuery('جاري تحويل النص إلى صوت...');
        
        // محاولة توليد الصوت مع ضبط الوقت المستغرق
        const buffer = await tts.getAudio(text, {
            voiceName: voiceType,
            outputFormat: OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
            rate: "-10%"
        });

        if (buffer) {
            await ctx.replyWithAudio({ source: buffer }, { 
                title: "FENNTEL Voice", 
                performer: "British Accent" 
            });
        }
    } catch (err) {
        console.error("TTS Error:", err);
        ctx.reply('حدث خطأ. حاول تقصير النص قليلاً أو المحاولة مرة أخرى.');
    }
});

bot.launch();
