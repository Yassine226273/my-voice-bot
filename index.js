const { Telegraf } = require('telegraf');
const axios = require('axios');
const http = require('http');

const BOT_TOKEN = '8744351193:AAHEXILIZ7IfjqzGHj-kdLRh4uPFn3o_znY';
const MY_ID = 7013389864;

const bot = new Telegraf(BOT_TOKEN);

// الحفاظ على نشاط السيرفر
http.createServer((req, res) => { res.end('FENNTEL Audio System Active'); }).listen(process.env.PORT || 3000);

bot.on('text', async (ctx) => {
    if (ctx.from.id !== MY_ID) return;

    const text = ctx.message.text;
    const statusMsg = await ctx.reply('⏳ جاري استدعاء الإلقاء البريطاني الفخم... (George)');

    try {
        const voice = 'George';
        const url = `https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=${encodeURIComponent(text)}`;

        // تحميل الصوت بالكامل كبيانات خام (Buffer)
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const audioBuffer = Buffer.from(response.data, 'binary');

        // إرسال الملف الصوتي الحقيقي
        await ctx.replyWithAudio({ source: audioBuffer }, { 
            title: "FENNTEL - British Class", 
            performer: "Microsoft George"
        });

        await ctx.deleteMessage(statusMsg.message_id).catch(() => {});

    } catch (err) {
        console.error(err);
        await ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, null, '❌ فشل في جلب الصوت، حاول مرة أخرى بنص أقصر.');
    }
});

bot.launch();
