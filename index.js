const { Telegraf } = require('telegraf');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const http = require('http');

const BOT_TOKEN = '8744351193:AAHEXILIZ7IfjqzGHj-kdLRh4uPFn3o_znY';
const MY_ID = 7013389864; 

const bot = new Telegraf(BOT_TOKEN);
const tts = new MsEdgeTTS();

// إنشاء السيرفر مع معالجة أفضل للأخطاء
http.createServer((req, res) => { 
    res.writeHead(200);
    res.end('FENNTEL Studio is Online and Secure'); 
}).listen(process.env.PORT || 3000);

bot.on('text', async (ctx) => {
    if (ctx.from.id !== MY_ID) return;

    const text = ctx.message.text;
    // رسالة تنبيه واحدة فقط
    const statusMsg = await ctx.reply('⏳ جاري الإلقاء الفخم...');

    try {
        const buffer = await tts.getAudio(text, {
            voiceName: "en-GB-RyanNeural",
            outputFormat: OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
            rate: "-12%", 
            pitch: "-1Hz"
        });

        // إرسال الصوت وحذف رسالة الانتظار
        await ctx.replyWithAudio({ source: buffer }, { 
            title: "Ryan - British Voice", 
            performer: "FENNTEL AI",
            caption: "تم التوليد بنجاح ✅"
        });
        
        await ctx.deleteMessage(statusMsg.message_id).catch(() => {});

    } catch (err) {
        console.error("TTS Error:", err);
        await ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, null, '❌ حدث خطأ بسيط، أعد إرسال النص مرة أخرى.');
    }
});

bot.launch();
