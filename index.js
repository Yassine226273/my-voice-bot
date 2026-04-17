const { Telegraf } = require('telegraf');
const axios = require('axios'); // تأكد من إضافة هذه المكتبة
const http = require('http');

const BOT_TOKEN = '8744351193:AAHEXILIZ7IfjqzGHj-kdLRh4uPFn3o_znY';
const MY_ID = 7013389864; 

const bot = new Telegraf(BOT_TOKEN);

// استوديو FENNTEL الصوتي
http.createServer((req, res) => { res.end('FENNTEL Studio is Online'); }).listen(process.env.PORT || 3000);

bot.on('text', async (ctx) => {
    if (ctx.from.id !== MY_ID) return;

    const text = ctx.message.text;
    const statusMsg = await ctx.reply('⏳ جاري تجهيز الإلقاء الفخم...');

    try {
        // نستخدم Microsoft George بناءً على طلبك الأخير
        const voice = 'George'; 
        const url = `https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=${encodeURIComponent(text)}`;

        // تحميل البيانات الصوتية الفعلية بدلاً من إرسال الرابط فقط
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const audioBuffer = Buffer.from(response.data, 'binary');

        // إرسال الصوت كملف حقيقي ليعمل على الهاتف
        await ctx.replyWithAudio({ source: audioBuffer }, { 
            title: "Microsoft George - British Classic", 
            performer: "FENNTEL AI",
            filename: "voice.mp3"
        });

        await ctx.deleteMessage(statusMsg.message_id).catch(() => {});

    } catch (err) {
        console.error(err);
        await ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, null, '❌ فشل التوليد، السيرفر مضغوط حالياً.');
    }
});

bot.launch();
