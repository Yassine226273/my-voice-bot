const { Telegraf } = require('telegraf');
const https = require('https');
const http = require('http');

const BOT_TOKEN = '8744351193:AAHEXILIZ7IfjqzGHj-kdLRh4uPFn3o_znY';
const MY_ID = 7013389864; 

const bot = new Telegraf(BOT_TOKEN);

http.createServer((req, res) => { res.end('FENNTEL Engine Active'); }).listen(process.env.PORT || 3000);

bot.on('text', async (ctx) => {
    if (ctx.from.id !== MY_ID) return;

    const text = ctx.message.text;
    const statusMsg = await ctx.reply('⏳ جاري تحويل النص إلى صوت (George)...');

    // هنا يمكنك اختيار الصوت: 'George' للصوت الرسمي أو 'Brian' للصوت الملكي
    const voice = 'George'; 
    const url = `https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=${encodeURIComponent(text)}`;

    ctx.replyWithAudio({ url: url }, { 
        title: "Microsoft George - British Classic", 
        performer: "FENNTEL AI" 
    }).then(() => {
        ctx.deleteMessage(statusMsg.message_id).catch(() => {});
    }).catch((err) => {
        ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, null, '❌ حدث خطأ، حاول مرة أخرى.');
    });
});

bot.launch();
