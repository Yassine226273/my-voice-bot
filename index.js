const { Telegraf, Markup } = require('telegraf');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

// ضع التوكن الخاص بك هنا
const BOT_TOKEN = '8744351193:AAHEXILIZ7IfjqzGHj-kdLRh4uPFn3o_znY';
// ضع معرف التلجرام الخاص بك (سيتم التعرف عليه تلقائياً عند أول رسالة)
let ADMIN_ID = null; 

const bot = new Telegraf(BOT_TOKEN);
const tts = new MsEdgeTTS();

bot.start((ctx) => {
    if (!ADMIN_ID) {
        ADMIN_ID = ctx.from.id;
        ctx.reply('مرحباً بك يا مدير. تم قفل البوت على حسابك بنجاح! أرسل لي أي نص إنجليزي لتحويله لصوت بريطاني فخم.');
    } else if (ctx.from.id !== ADMIN_ID) {
        ctx.reply('عذراً، هذا البوت خاص ومشفر.');
    }
});

bot.on('text', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;

    const text = ctx.message.text;
    
    // لوحة تحكم عربية
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('توليد الصوت البريطاني 🎙️', 'generate_uk')],
        [Markup.button.callback('نبرة أعمق وأبطأ (أكثر إقناعاً) 🏛️', 'generate_uk_slow')]
    ]);

    ctx.reply('اختر نمط الإلقاء المطلوب:', keyboard);
});

bot.action(/generate_uk(_slow)?/, async (ctx) => {
    const isSlow = ctx.match[1] === '_slow';
    const text = ctx.callbackQuery.message.reply_to_message.text;

    try {
        await ctx.answerCbQuery('جاري تحضير الصوت الفخم...');
        
        const config = {
            voiceName: "en-GB-RyanNeural",
            outputFormat: OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
            pitch: "+0Hz",
            rate: isSlow ? "-15%" : "-5%" // إبطاء بسيط للوقار
        };

        const buffer = await tts.getAudio(text, config);
        
        await ctx.replyWithAudio({ source: buffer }, { 
            title: "British Elegant Voice",
            performer: "FENNTEL AI",
            caption: "جاهز للمونتاج على تيك توك ✅"
        });
    } catch (error) {
        ctx.reply('حدث خطأ، تأكد من أن النص بالإنجليزية.');
    }
});

// تشغيل البوت
bot.launch();
console.log('Bot is running...');
