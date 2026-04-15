const { Telegraf } = require('telegraf');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const http = require('http');

const BOT_TOKEN = '8744351193:AAHEXILIZ7IfjqzGHj-kdLRh4uPFn3o_znY';
const bot = new Telegraf(BOT_TOKEN);
const tts = new MsEdgeTTS();

// سيرفر Render
http.createServer((req, res) => { res.end('FENNTEL Luxury Audio Active'); }).listen(process.env.PORT || 3000);

bot.on('text', async (ctx) => {
    // التأكد من أنك أنت فقط من يستخدم البوت
    const text = ctx.message.text;
    
    await ctx.reply('جاري تحضير الإلقاء البريطاني الفخم... 🏛️');

    try {
        // استخدام صوت Ryan البريطاني (رجل) بجودة عالية
        const buffer = await tts.getAudio(text, {
            voiceName: "en-GB-RyanNeural", 
            outputFormat: OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
            rate: "-10%", // إبطاء بسيط للوقار
            pitch: "-2Hz" // جعل الصوت أعمق قليلاً
        });

        await ctx.replyWithAudio({ source: buffer }, { 
            title: "Ryan - British Excellence", 
            performer: "FENNTEL AI" 
        });
    } catch (err) {
        ctx.reply('حدث ضغط على المحرك، يرجى المحاولة بعد ثوانٍ قليلة.');
        console.error(err);
    }
});

bot.launch();
