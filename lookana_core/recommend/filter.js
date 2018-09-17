/**
 * Created by sadra on 12/29/17.
 */

let config = require('../assets/config');
let googleMapsClient = require('@google/maps').createClient({
    key: config.googleMap.key
});
let message = require('../assets/variables/message');
let error = require('../assets/controller/error');
let httpRequest = require('request-promise');

let placeTypes = {
    //Empty array fot mood means all of mood accepted
    "amusement_park" : { age:{min:0, max:1}, gender: 'all', mood : [], weather: "all" },
    "aquarium" : { age:{min:7, max:75}, gender: 'all', mood : [], weather: "all" },
    "art_gallery" : { age:{min:15, max:70}, gender: 'all', mood : ['happy', 'surprised', 'neutral', 'sad'], weather: "all" },
    "bar" : { age:{min:22, max:70}, gender: 'all', mood : ['sad', 'angry', 'disgusted', 'neutral'], weather: "all" },
    "beauty_salon" : { age:{min:16, max:80}, gender: 'female', mood : ['happy', 'surprised', 'neutral', 'sad'], weather: "all" },
    "book_store" : { age:{min:5, max:75}, gender: 'all', mood : [], weather: "all" },
    "bowling_alley" : { age:{min:7, max:75}, gender: 'all', mood : ['happy', 'surprised', 'neutral', 'sad'], weather: "all" },
    "cafe" : { age:{min:12, max:75}, gender: 'all', mood : [], weather: "all" },
    "campground" : { age:{min:15, max:75}, gender: 'male', mood : [], weather: "fine" },
    "casino" : { age:{min:22, max:75}, gender: 'all', mood : ['happy', 'surprised', 'neutral'], weather: "all" },
    "church" : { age:{min:7, max:75}, gender: 'all', mood : [], weather: "all" },
    "city_hall" : { age:{min:7, max:75}, gender: 'all', mood : ['happy', 'surprised', 'neutral', 'sad', 'disgusted'], weather: "all" },
    "clothing_store" : { age:{min:15, max:75}, gender: 'female', mood : ['happy', 'surprised', 'neutral', 'sad'], weather: "all" },
    "convenience_store" : { age:{min:17, max:75}, gender: 'female', mood : ['happy', 'surprised', 'neutral', 'sad'], weather: "all" },
    "home_goods_store" : { age:{min:17, max:75}, gender: 'female', mood : ['happy', 'surprised', 'neutral', 'sad'], weather: "all" },
    "florist" : { age:{min:15, max:75}, gender: 'all', mood : [], weather: "all" },
    "gym" : { age:{min:7, max:75}, gender: 'all', mood : [], weather: "all" },
    "hair_care" : { age:{min:8, max:75}, gender: 'all', mood : ['happy', 'surprised', 'neutral', 'sad'], weather: "all" },
    "jewelry_store" : { age:{min:14, max:75}, gender: 'female', mood : ['happy', 'surprised', 'neutral', 'sad'], weather: "all" },
    "library" : { age:{min:7, max:75}, gender: 'all', mood : ['happy', 'surprised', 'neutral'], weather: "all" },
    "liquor_store" : { age:{min:18, max:75}, gender: 'male', mood : ['happy', 'surprised', 'neutral', 'sad', 'disgusted'], weather: "all" },
    "meal_takeaway" : { age:{min:15, max:75}, gender: 'all', mood : [], weather: "all" },
    "mosque" : { age:{min:7, max:75}, gender: 'all', mood : [], weather: "all" },
    "movie_rental" : { age:{min:7, max:75}, gender: 'all', mood : ['happy', 'surprised', 'neutral', 'sad', 'disgusted'], weather: "all" },
    "movie_theater" : { age:{min:7, max:75}, gender: 'all', mood : ['happy', 'surprised', 'neutral', 'sad', 'disgusted'], weather: "all" },
    "museum" : { age:{min:7, max:75}, gender: 'all', mood : [], weather: "all" },
    "night_club" : { age:{min:22, max:75}, gender: 'all', mood : [], weather: "all" },
    "park" : { age:{min:7, max:75}, gender: 'all', mood : [], weather: "fine" },
    "restaurant" : { age:{min:7, max:75}, gender: 'all', mood : [], weather: "all" },
    "shoe_store" : { age:{min:12, max:75}, gender: 'all', mood : ['happy', 'surprised', 'neutral', 'sad', 'disgusted'], weather: "all" },
    "shopping_mall" : { age:{min:14, max:75}, gender: 'female', mood : ['happy', 'surprised', 'neutral', 'sad', 'disgusted'], weather: "all" },
    "spa" : { age:{min:12, max:75}, gender: 'all', mood : [], weather: "all" },
    "stadium" : { age:{min:14, max:75}, gender: 'all', mood : ['happy', 'surprised', 'neutral', 'sad', 'disgusted'], weather: "all" },
    // "store" : { age:{min:14, max:75}, gender: 'all', mood : [], weather: "all" },
    "zoo" : { age:{min:7, max:75}, gender: 'all', mood : [], weather: "fine" },
};


let filterPlaces = (places, userInfo) => {

    return new Promise(function (resolve, reject) {

        let promise = new Promise( (resolve, reject) => resolve(true) );

        promise.then(function(start) {
            return applyingGenderFilter(places, userInfo);
        }).then(function (filteredPlace) {
            console.log("======");
            return applyingMoodFilter(filteredPlace, userInfo)
        }).then(function (filteredPlace) {
            console.log("======");
            return applyingAgeFilter(filteredPlace, userInfo)
        }).then(function (filteredPlace) {
            console.log("======");
            return applyingWeatherFilter(filteredPlace, userInfo)
        }).then(function (filteredPlace) {
            resolve(filteredPlace)
        }).catch(function (err) {
            reject(err)
        })

    })

};


//Promises Chain
let applyingGenderFilter = (places, userInfo) => new Promise(function (resolve, reject) {

    basedOnGender(places, userInfo.meta.gender).then(function (filteredPlaces) {
        console.log("filtered Gender Places: "+JSON.stringify(filteredPlaces));
        resolve(filteredPlaces, userInfo);
    }).catch(function (err) {
        reject("cannot filter: "+err)
    });

});

let applyingMoodFilter = (places, userInfo) =>  new Promise(function (resolve, reject) {

    basedOnMood(places, userInfo.meta.mood).then(function (filteredPlaces) {
        console.log("filtered Mood Places: "+JSON.stringify(filteredPlaces));
        resolve(filteredPlaces, userInfo);
    }).catch(function (err) {
        reject("cannot filter: "+err)
    });

});

let applyingAgeFilter = (places, userInfo) => new Promise(function (resolve, reject) {

    basedOnAge(places, userInfo.meta.age).then(function (filteredPlaces) {
        console.log("filtered Age Places: "+JSON.stringify(filteredPlaces));
        resolve(filteredPlaces, userInfo);
    }).catch(function (err) {
        reject("cannot filter: "+err)
    });

});

let applyingWeatherFilter = (places, userInfo) => new Promise(function (resolve, reject) {

    baseOnWeather(places, userInfo.meta.location).then(function (filteredPlaces) {
        console.log("filtered Weather Places: "+JSON.stringify(filteredPlaces));
        resolve(filteredPlaces);
    }).catch(function (err) {
        reject("cannot filter: "+err)
    });

});



//Module
let basedOnMood = (places, mood) => {

    return new Promise(function (resolve, reject) {

        let filteredPlaces = [];
        for (let place of places ){
            for(let type of place.types){
                if(placeTypes[type] !== undefined && ((placeTypes[type].mood).includes(mood) || placeTypes[type].mood.length === 0) ){
                    filteredPlaces.push(place);
                    break;
                }
            }
        }

        if (filteredPlaces.length > 0){
            resolve(filteredPlaces);
        }else{
            reject("not find any suitable place - mood filter");
        }

    });

};

let basedOnGender = (places, gender) => {

    return new Promise(function (resolve, reject) {

        let filteredPlaces = [];
        for (let place of places ){
            for(let type of place.types){
                if(placeTypes[type] !== undefined && (placeTypes[type].gender === gender || placeTypes[type].gender === "all") ){
                    filteredPlaces.push(place);
                    break;
                }
            }
        }

        if (filteredPlaces.length > 0){
            resolve(filteredPlaces);
        }else{
            reject("not find any suitable place - gender filter");
        }

    });

};

let basedOnAge = (places, age) => {

    return new Promise(function (resolve, reject) {

        let filteredPlaces = [];
        for (let place of places ){
            for(let type of place.types){
                if(placeTypes[type] !== undefined && ( age >= placeTypes[type].age.min  &&  age <= placeTypes[type].age.max ) ){
                    filteredPlaces.push(place);
                    break;
                }
            }
        }

        if (filteredPlaces.length > 0){
            resolve(filteredPlaces);
        }else{
            reject("not find any suitable place - age filter");
        }

    });

};

let baseOnWeather = (places, location) => {

    return new Promise(function (resolve, reject) {

        let weatherIsFine = isWeatherFine(location);
        let filteredPlaces = [];
        for (let place of places ){
            for(let type of place.types){
                if(placeTypes[type] !== undefined &&  ( (placeTypes[type].weather === "fine" && weatherIsFine) || placeTypes[type].weather === "all") ){
                    filteredPlaces.push(place);
                    break;
                }
            }
        }

        if (filteredPlaces.length > 0){
            resolve(filteredPlaces);
        }else{
            reject("not find any suitable place - age filter");
        }

    });

};

let basedOnHours = (places) => {

    return new Promise(function (resolve, reject) {



    });

};

//Function
function isWeatherFine(location){

    return new Promise(
        function (resolve, reject) {

            let options = {
                method: 'GET',
                uri: config.apixu+location.latitude+","+location.longitude,
                json: true,
            };

            httpRequest(options)
                .then(function (body) {
                    switch (body.current.condition.code){
                        case 1114:
                        case 1066:
                        case 1240:
                        case 1243:
                        case 1246:
                        case 1273:
                        case 1276:
                        case 1201:
                        case 1198:
                        case 1195:
                        case 1192:
                        case 1189:
                        case 1186:
                        case 1183:
                        case 1180:
                        case 1063:
                        case 1279:
                        case 1282:
                        case 1258:
                        case 1255:
                        case 1210:
                        case 1213:
                        case 1216:
                        case 1219:
                        case 1222:
                        case 1225:
                            resolve(false);
                            break;
                        default:
                            resolve(true);
                            break;
                    }
                })
                .catch(function (err) {
                    error.message('Wops, There is an error!', 500, "getWeather Exception: "+err, isWeatherFine);
                    reject(message.error.locationProblem);
                });
        }
    );

}


module.exports = { filterPlaces };