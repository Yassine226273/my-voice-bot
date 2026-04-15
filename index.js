const { Telegraf } = require('telegraf');
const axios = require('axios');
const http = require('http');

const BOT_TOKEN = '8744351193:AAHEXILIZ7IfjqzGHj-kdLRh4uPFn3o_znY';
const MY_ID = 7013389864; 

const bot = new Telegraf(BOT_TOKEN);

// سيرفر Render للبقاء متصلاً
http.createServer((req, res) => { res.end('FENNTEL StreamElements Engine'); }).listen(process.env.PORT || 3000);

bot.on('text', async (ctx) => {
    if (ctx.from.id !== MY_ID) return;

    const text = ctx.message.text;
    const statusMsg = await ctx.reply('⏳ جاري استدعاء الإلقاء البريطاني (Brian)...');

    try {
        // الربط المباشر مع StreamElements API
        const voice = 'Brian';
        const url = `https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=${encodeURIComponent(text)}`;

        // إرسال الصوت كملف MP3 فوراً
        await ctx.replyWithAudio({ url: url }, { 
            title: "Brian - British Classic", 
            performer: "FENNTEL AI" 
        });

        await ctx.deleteMessage(statusMsg.message_id).catch(() => {});

    } catch (err) {
        console.error(err);
        ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, null, '❌ فشل الاتصال، حاول تقصير النص قليلاً.');
    }
});

bot.launch();
