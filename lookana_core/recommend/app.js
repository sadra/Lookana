/**
 * Created by sadra on 12/29/17.
 */
let config = require('../assets/config');
let googleMapsClient = require('@google/maps').createClient({
    key: config.googleMap.key
});
let database = require('../database/functions');
let message = require('../assets/variables/message');
let error = require('../assets/controller/error');
let keyboard = require('../telegram/keyboards');
let dataStore = require('../database/dataStore');

let filter = require("./filter");
let sort = require("./sort");
let regular = require("./regular");


const { Extra, Markup, Telegram} = require('telegraf');


//Moduler Function
let lookanaRecommendService = (context, userID) => {

    database.findUser(userID).then(function (user) {
        console.log("user info: "+JSON.stringify(user));
        findLocationHandler(context, user, config.placeRadar.radiusMin)
    }).catch(function (err) {
        context.reply(message.error.locationProblem, keyboard.requestForLocation());
    });

};

let recommendNewPlace = (context) => {

    database.findUser(context.from.id).then(function (user) {

        getRecommendPlace(user).then(function (recommendedPlace) {
            recommendPlace(context, recommendedPlace);
        }).catch(function (err) {
            error.message('Wops, There is an error!', 500, err, findLocationHandler);
            context.reply(message.error.notLocationFound, keyboard.requestForLocation());
        });

    }).catch(function (err) {
        context.reply(message.error.notLocationFound, keyboard.requestForLocation());
    });

};

let getPlaceCaption = (context, recommendedPlace) => {

    let place = recommendedPlace;

    //info
    let info = message.recommend.distance + (place.distance.measure).replace("km", "کیلومتر").replace("m", "متر")+ "\n" +
        message.recommend.duration + (place.duration.measure).replace("mins", "دقیقه").replace("hours", "ساعت").replace("days", "روز")+ "\n";

    if(place.rating !== undefined){
        let star="";
        for (let i=0; i<place.rating; i++){
            star = star + "⭐️"
        }
        info = info + message.recommend.rating + star + "\n"
    }


    //More info
    let moreInfo = "دوست من، " + context.from.first_name + " عزیز، مشخصات این مکان انتخاب شده به شرح زیر است:" + "\n";

    if(place.vicinity !== undefined){
        moreInfo += "آدرس: " + place.vicinity + "\n";
    }

    if(place.price_level !== undefined){
        let money="";
        for (let i=0; i<place.price_level; i++){
            money = money + "💵️"
        }
        moreInfo = moreInfo + message.recommend.price_level + money + "\n"
    }

    return {
        name : place.name + "\n",
        info : info,
        moreInfo : moreInfo,
    };

};


//Functions
function findLocationHandler(context, userInfo, radius) {
    findLocations(userInfo.meta.location, radius).then(function (res) {
        if(res.length >= config.placeRadar.minCount){
            processOnPlaces(context, res, userInfo)
        }else if(radius < config.placeRadar.radiusMax){
            findLocationHandler(context, userInfo, radius + 500)
        }else{
            context.reply(message.error.notLocationFound, keyboard.startupButton());
        }
    }).catch(function (err) {
        error.message('Wops, There is an error!', 500, err, findLocationHandler);
        context.reply(message.error.locationProblem, keyboard.requestForLocation());
    })

}

function findLocations(location, radius) {

    return new Promise(function (resolve, reject) {

        let latitude = location.latitude;
        let longitude = location.longitude;

        googleMapsClient.placesNearby({
            language: 'fa',
            location: [latitude, longitude],
            radius: radius,
            opennow: true
        }, function (err, res) {
            if(err){
                error.message('Wops, There is an error!', 500, JSON.stringify(err), findLocations);
                reject(err);
            }else{
                resolve(res.json.results);
            }
        });

    });

}


//Recommendation Control
function processOnPlaces(context, places, userInfo) {

    dataStore.isRecommendContextAware() ? regularRecommendation(context, places, userInfo) : contextAwareRecommendation(context, places, userInfo);
    dataStore.toggleRecommendType();

}

function regularRecommendation(context, places, userInfo) {

    let promise = new Promise( (resolve, reject) => resolve(true) );

    promise.then(function() {
        return regular.recommendations(places, userInfo);
    }).then(function (placesTemp) {
        return getRecommendPlace(userInfo);
    }).then(function (recommendedPlace) {
        recommendPlace(context, recommendedPlace);
    }).catch(function (err) {
        error.message('Wops, There is an error!', 500, err.toString(), processOnPlaces);
        context.reply(message.error.notLocationFound, keyboard.startupButton());
    });

}

function contextAwareRecommendation(context, places, userInfo) {

    let promise = new Promise( (resolve, reject) => resolve(true) );

    promise.then(function(start) {
        return applyingFilter(places, userInfo);
    }).then(function (filteredPlaces) {
        return applyingSort(filteredPlaces, userInfo);
    }).then(function (sortedPlaces) {
        return getRecommendPlace(userInfo);
    }).then(function (recommendedPlace) {
        recommendPlace(context, recommendedPlace);
    }).catch(function (err) {
        error.message('Wops, There is an error!', 500, err.toString(), processOnPlaces);
        context.reply(message.error.notLocationFound, keyboard.startupButton());
    });

}


//Making recommends smarter
let applyingFilter = (places, userInfo) =>  new Promise(function (resolve, reject) {

    filter.filterPlaces(places, userInfo).then(function (filteredPlace) {
        resolve(filteredPlace)
    }).catch(function (err) {
        reject(err)
    })

});

let applyingSort = (filteredLocations, userInfo) =>  new Promise(function (resolve, reject) {

    sort.sortPlaces(filteredLocations, userInfo).then(function (filteredPlace) {
        resolve(filteredPlace)
    }).catch(function (err) {
        reject(err)
    })

});


//RecommendNewPlace
let getRecommendPlace = (userInfo) => new Promise(function (resolve, reject) {

    database.getUnCheckedPlaceFromTemp(userInfo.user_id).then(function (recommendedPlace) {
        resolve(recommendedPlace);
    }).catch(function (err) {
        error.message('Wops, There is an error!', 500, err, getRecommendPlace);
        reject(err);
    })

});

function recommendPlace(context, recommendedPlace){

    let photoURL = ( ('photos' in recommendedPlace) && recommendedPlace.photos.length>0) ? "https://maps.googleapis.com/maps/api/place/photo?photoreference="+recommendedPlace.photos[0].photo_reference+"&sensor=false&maxheight="+recommendedPlace.photos[0].height+"&maxwidth="+recommendedPlace.photos[0].width+"&key="+config.googleMap.key : "http://marketingmix.co.uk/content/uploads/marketing-mix-place.jpg";

    const extra = keyboard.recommendPlace();
    extra.caption = getPlaceCaption(context, recommendedPlace).name + getPlaceCaption(context, recommendedPlace).info;
    context.replyWithPhoto(photoURL, extra);

}


module.exports = { lookanaRecommendService, recommendNewPlace, getPlaceCaption };