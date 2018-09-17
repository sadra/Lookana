/**
 * Created by sadra on 11/13/17.
 */
let config = require('../assets/config');
const Telegraf = require('telegraf');
const TelegrafFlow = require('telegraf-flow');
const { Scene, enter } = TelegrafFlow;
const flow = new TelegrafFlow();
const TelegrafI18n = require('telegraf-i18n');
const bot = new Telegraf(config.telegram_token);
const { Extra, Markup, Telegram} = Telegraf;
let functions = require('./functions');
let keyboards = require('./keyboards');
let message = require('../assets/variables/message');
let button = require('../assets/variables/button');

//---- Telegraf Command -------
bot.use((context, next) => {
    const start = new Date();
    return next().then(() => {
        const ms = new Date() - start;
        console.log('Response time %sms', ms)
    })
});
bot.use(Telegraf.session());


//Controllers
bot.command('start', (context) => {
    functions.startBot(context)
});

bot.hears(button.start_button.about, (context) => {
    functions.aboutLookana(context);
});

bot.hears(button.start_button.recommend, (context) => {
    functions.startLookan(context);
});

bot.on('photo', (context) => {
    functions.processingSelfie(context, bot);
});

bot.on('text', (context) => {

    let response = context.message.text;

    switch (response){
        case "➡ برگرد":
            return context.replyWithHTML("سلام، چه کاری می‌تونم واست بکنم؟ ☺️", keyboards.taskButtons());
            break;
        default:
            return context.replyWithHTML(message.error.undefinedCommand, keyboards.startupButton());
            break;
    }

});

bot.on('location', (context) => {
    functions.locationRecieved(context);
});

bot.action(button.recommend_place.like.code, (context) => {

    functions.getFavoritePlaceDetails(context);
});

bot.action(button.recommend_place.hate.code, (context) => {

    functions.recommendNextPlace(context);

});


bot.startPolling();

module.exports = {
    tlBot : bot
};