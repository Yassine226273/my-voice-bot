const { Telegraf } = require('telegraf');
const axios = require('axios');
const http = require('http');

const BOT_TOKEN = '8744351193:AAHEXILIZ7IfjqzGHj-kdLRh4uPFn3o_znY';
const MY_ID = 7013389864; 

const bot = new Telegraf(BOT_TOKEN);

http.createServer((req, res) => { res.end('FENNTEL Audio Engine Fixed'); }).listen(process.env.PORT || 3000);

bot.on('text', async (ctx) => {
    if (ctx.from.id !== MY_ID) return;

    const text = ctx.message.text;
    const statusMsg = await ctx.reply('⏳ جاري استدعاء الإلقاء البريطاني... (الرجاء الانتظار)');

    try {
        const voice = 'Brian';
        const url = `https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=${encodeURIComponent(text)}`;

        // تحميل البيانات الصوتية الفعلية
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const audioBuffer = Buffer.from(response.data, 'binary');

        // إرسال البيانات كملف صوتي حقيقي
        await ctx.replyWithAudio({ source: audioBuffer }, { 
            title: "Brian - British Excellence", 
            performer: "FENNTEL AI",
            filename: "voice.mp3"
        });

        await ctx.deleteMessage(statusMsg.message_id).catch(() => {});

    } catch (err) {
        console.error(err);
        ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, null, '❌ فشل في جلب الصوت، حاول مرة أخرى.');
    }
});

bot.launch();
