const { Telegraf, Markup } = require('telegraf');
const gTTS = require('gtts');
const http = require('http');
const fs = require('fs');

const BOT_TOKEN = '8744351193:AAHEXILIZ7IfjqzGHj-kdLRh4uPFn3o_znY';
const bot = new Telegraf(BOT_TOKEN);

let ADMIN_ID = null;
const userTextCache = new Map();

// سيرفر Render لضمان التشغيل ومنع النوم
http.createServer((req, res) => { res.end('FENNTEL Studio Online'); }).listen(process.env.PORT || 3000);

bot.start((ctx) => {
    ADMIN_ID = ctx.from.id;
    ctx.reply('مرحباً بك يا مدير. أرسل النص الإنجليزي الآن وسأحوله لصوت بريطاني فوراً.');
});

bot.on('text', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    userTextCache.set(ctx.from.id, ctx.message.text);
    
    ctx.reply('جاري التوليد باللكنة البريطانية... 🎙️');
    
    const text = ctx.message.text;
    const gtts = new gTTS(text, 'en-uk'); // اللكنة البريطانية
    const fileName = `voice_${ctx.from.id}.mp3`;

    gtts.save(fileName, async (err) => {
        if (err) {
            console.error(err);
            return ctx.reply('حدث خطأ فني، حاول مرة أخرى.');
        }
        
        await ctx.replyWithAudio({ source: fileName }, { 
            title: "FENNTEL British Voice", 
            performer: "Success Voice" 
        });

        // مسح الملف بعد الإرسال لتوفير مساحة السيرفر
        fs.unlinkSync(fileName);
    });
});

bot.launch();
