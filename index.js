const { Telegraf } = require('telegraf');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const http = require('http');

// إعدادات البوت والمدير
const BOT_TOKEN = '8744351193:AAHEXILIZ7IfjqzGHj-kdLRh4uPFn3o_znY';
const MY_ID = 7013389864; 

const bot = new Telegraf(BOT_TOKEN);
const tts = new MsEdgeTTS();

// سيرفر Render لضمان الاستقرار
http.createServer((req, res) => { 
    res.end('FENNTEL Secure Audio Studio is Online'); 
}).listen(process.env.PORT || 3000);

// منع النوم (Self-Ping)
setInterval(() => {
    http.get("https://my-voice-bot-s9b0.onrender.com").on('error', () => {});
}, 10 * 60 * 1000);

bot.on('text', async (ctx) => {
    // التحقق من الهوية (الخصوصية المطلقة)
    if (ctx.from.id !== MY_ID) {
        return; // لن يرد البوت على أي شخص غريب
    }

    const text = ctx.message.text;
    await ctx.reply('جاري تحويل النص إلى إلقاء بريطاني فخم... 🏛️');

    try {
        // توليد الصوت باستخدام أفضل إعدادات للفخامة والوقار
        const buffer = await tts.getAudio(text, {
            voiceName: "en-GB-RyanNeural",
            outputFormat: OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
            rate: "-12%", // بطء قليل لزيادة التأثير والإقناع
            pitch: "-1Hz"  // نبرة رجولية أعمق قليلاً
        });

        await ctx.replyWithAudio({ source: buffer }, { 
            title: "Ryan - British Transformation", 
            performer: "FENNTEL AI" 
        });
    } catch (err) {
        console.error(err);
        ctx.reply('حدث تداخل بسيط في الطلبات، يرجى إعادة إرسال النص.');
    }
});

bot.launch();
console.log('Secure Bot is Running...');
