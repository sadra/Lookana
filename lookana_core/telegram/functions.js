/**
 * Created by sadra on 11/13/17.
 */
const keyboards = require('./keyboards');
let config = require('../assets/config');
let httpRequest = require('request-promise');
let sightengine = require('sightengine')(config.sightengine_key, config.sightengine_secret);
const download = require('image-downloader');
const path = require('path');
const fs = require('fs');
const clarifaiSDK = require('clarifai');
const clarifai = new clarifaiSDK.App({
    apiKey: config.clarifai_key
});
const Intlpedia = require('intl-wikipedia');
const database = require('../database/functions');
let errorController = require('../assets/controller/error');
const { Extra, Markup, Telegram} = require('telegraf');

let message = require('../assets/variables/message');
let error = require('../assets/controller/error');

let recommend = require('../recommend/app');



//Exports Module
let startBot = (context) => {
    checkUser(context);
    return context.replyWithHTML(message.start, keyboards.startupButton());
};

let aboutLookana = (context) => {
    context.replyWithPhoto(
        'AgADBAAD96sxG9XvUFBEyHKQ1qn4gvtW9RkABPDWMNt6lDQXhX8CAAEC',
        {caption : message.lookana.about}
    ).then(() => {
        context.reply(message.lookana.project)
    });

};

let startLookan = (context) => {
    checkUser(context);
    return context.reply(message.startLoockan, Markup.removeKeyboard().extra());
};

let processingSelfie = (context, bot) => {

    bot.telegram.getFileLink(context.message.photo[context.message.photo.length-1])
        .then((link) => {
            console.log(context.message.photo[context.message.photo.length-1]);
            console.log('image link: '+link);

            processingOnSelfie(context, link)
                .then(function (resolve) {
                    updateUserInfo(context, resolve.personInfo)
                }).catch(function (reject) {
                    context.reply(reject);
                })
        });

    waitForProcessing(context);

};

let locationRecieved  = (context) => {

    let location = context.message.location;

    database.updateUserLocation(context.from.id, location).then(function (res) {
        recommend.lookanaRecommendService(context, context.from.id);
        context.reply(message.success.locationProcess, Markup.removeKeyboard().extra());
    }).catch(function (err) {
        error.message('Wops, There is an error!', 500, "updateUserInfo Exception: "+err, updateUserInfo);
        context.reply(message.error.locationProblem, keyboards.requestForLocation());
    });

};

let recommendNextPlace = (context) => {
    context.editMessageReplyMarkup(Markup.removeKeyboard().extra());
    recommend.recommendNewPlace(context)
};

let getFavoritePlaceDetails = (context) => {

    database.getFavoritePlaceFromTemp(context.from.id).then(function (place) {

        let placeDetail = recommend.getPlaceCaption(context, place);

        context.editMessageCaption(placeDetail.name, Markup.removeKeyboard().extra());

        context.reply( placeDetail.moreInfo + placeDetail.info ).then(()=>{
            context.replyWithLocation(place.location.latitude, place.location.longitude).then(()=>{
                context.replyWithHTML(message.success.afterFavoritePlace, keyboards.startupButton())
            })
        });

    }).catch(function (err) {
        error.message('Wops, There is an error!', 500, "updateUserInfo Exception: "+err, getFavoritePlaceDetails);
        context.reply(message.success.errorInRecommendAcceptation);
    })

};


//Photo Processing
function processingOnSelfie (context, selfieURL){

    return new Promise(
        function (resolve, reject) {

            let options = {
                method: 'GET',
                uri: config.skybiometry_api+"faces/recognize.json"+"?api_key="+config.skybiometry_key+"&api_secret="+config.skybiometry_secret+"&urls="+selfieURL+"&uids=all@lookana"+"&attributes=gender,age,mood",
                headers: {
                    'Content-Type': 'application/json',
                },
                json: true,
            };

            httpRequest(options)
                .then(function (body) {

                    if( body.photos[0].tags.length > 0 ){

                        let attr = body.photos[0].tags[0].attributes;

                        let gender = attr.gender.value;
                        let age = parseInt(attr.age_est.value);
                        let mood = attr.mood.value;

                        resolve(
                            {
                                personInfo : {
                                    gender: gender,
                                    mood: mood,
                                    age: age
                                }
                            }
                        )

                    }else{
                        error.message('Wops, There is an error!', 500, "processingOnSelfie photoBody count is 0: "+ JSON.stringify(body), processingOnSelfie);
                        reject(message.error.selfieProblem);
                    }

                })
                .catch(function (err) {
                    error.message('Wops, There is an error!', 500, "processingOnSelfie Exception: "+err, processingOnSelfie);
                    reject(message.error.selfieProblem);
                });

        }
    );

}


//Database Function
function checkUser(context){

    database.saveUser(context.from)
        .then(function (fulfilled) {
            console.log(fulfilled);
        })
        .catch(function (error) {
            errorController.message('Wops, There is an error!', 500, error, start);
        });

}

function updateUserInfo(context, personInfo) {

    database.updateUserBasic(context.from.id, personInfo).then(function (res) {
            context.reply(message.success.selfieProcess).then(()=>{
                context.reply(message.order.sendLocation, keyboards.requestForLocation());
            });
        }).catch(function (err) {
            error.message('Wops, There is an error!', 500, "updateUserInfo Exception: "+err, updateUserInfo);
            reject(message.error.selfieProblem);
        });

}


//Helper Functions
let waitForProcessing = (context) =>  {
    return context.replyWithHTML(message.order.waiting);
};


module.exports = { startBot, waitForProcessing, processingOnSelfie, aboutLookana, startLookan, processingSelfie, locationRecieved, recommendNextPlace, getFavoritePlaceDetails };