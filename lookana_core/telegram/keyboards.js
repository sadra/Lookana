/**
 * Created by sadra on 11/13/17.
 */
const Telegraf = require('telegraf');
const { Extra, Markup, Telegram} = Telegraf;
const button = require('../assets/variables/button');

let startupButton =  () => {
    return Extra.markup(
        Markup.keyboard([[ button.start_button.about, button.start_button.recommend ]])
            .resize()
    );
};

let requestForLocation =  () => {
    return Extra.markup(
        Markup.keyboard([Markup.locationRequestButton(button.request.sendLocation)])
            .oneTime()
            .resize()
    );
};

let taskButtons = () => {
    return startupButton();
};

let processingResultButton = (celebName) => {

    console.log("name: "+celebName);

    return Extra.markup(
        Markup.keyboard([[ "بگو "+celebName+" کیه؟ 🤔"], ["➡ برگرد"]])
            .oneTime()
            .resize()
    );
};

let recommendPlace =  () => {
    return Extra.markup(Markup.inlineKeyboard([
        Markup.callbackButton(button.recommend_place.like.name, button.recommend_place.like.code),
        Markup.callbackButton(button.recommend_place.hate.name, button.recommend_place.hate.code)
    ]));
};

module.exports = {taskButtons, processingResultButton, startupButton, requestForLocation, recommendPlace};
