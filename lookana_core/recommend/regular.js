/**
 * Created by sadra on 2/13/18.
 */

let config = require('../assets/config');
let message = require('../assets/variables/message');
let error = require('../assets/controller/error');
let database = require('../database/functions');
let googleMapsClient = require('@google/maps').createClient({
    key: config.googleMap.key
});


let recommendations = (places, userInfo) => {

    return new Promise(function (resolve, reject) {

        let destinations = [];
        for (let place of places) {
            let location = [place.geometry.location.lat, place.geometry.location.lng];
            destinations.push(location);
        }

        let promise = new Promise( (resolve, reject) => resolve(true) );

        promise.then(function(start) {
            return getDistance(userInfo.meta.location, destinations)
        }).then(function (placesDistance) {
            return setPlacesTemp(userInfo, places, placesDistance)
        }).then(function (places_temp) {
            resolve(places_temp)
        }).catch(function (err) {
            reject(err)
        });

    });

};


//Function
let getDistance = (userLocation, destinationLocations) => new Promise(function (resolve, reject) {

    let latitude = userLocation.latitude;
    let longitude = userLocation.longitude;

    googleMapsClient.distanceMatrix({
        origins: [[latitude, longitude]],
        destinations: destinationLocations,
        mode: 'driving',
        traffic_model: 'best_guess',
        departure_time: 'now'
    }, function (err, res) {
        if(err){
            error.message('Wops, There is an error!', 500, err, getDistance);
            reject(err);
        }else{
            resolve(res);
        }
    });

});

let setPlacesTemp = (userInfo, destinationPlaces, distances) => new Promise(function (resolve, reject) {

    let places_temp = [];
    let placesDistance = distances.json.rows[0].elements;

    for ( let index in destinationPlaces) {
        if (destinationPlaces.hasOwnProperty(index) && placesDistance.hasOwnProperty(index)) {
            let place = {
                name: destinationPlaces[index].name,
                rating: destinationPlaces[index].rating !== undefined ? destinationPlaces[index].rating : undefined,
                price_level: destinationPlaces[index].price_level !== undefined ? destinationPlaces[index].price_level : undefined,
                types: destinationPlaces[index].types,
                photos: destinationPlaces[index].photos !== undefined ? destinationPlaces[index].photos : undefined,
                vicinity : destinationPlaces[index].vicinity !== undefined ? destinationPlaces[index].vicinity : undefined,
                location : {
                    latitude: destinationPlaces[index].geometry.location.lat ,
                    longitude: destinationPlaces[index].geometry.location.lng ,
                },
                distance: {
                    measure: placesDistance[index].distance.text,
                    value: placesDistance[index].distance.value
                },
                duration: {
                    measure: placesDistance[index].duration.text,
                    value: placesDistance[index].duration.value
                },
                duration_in_traffic: placesDistance[index].duration_in_traffic !== undefined ? {
                    measure: placesDistance[index].duration_in_traffic.text,
                    value: placesDistance[index].duration_in_traffic.value
                } : undefined,
                checked : false,
                accepted: false,
                is_context_aware: false,
                rate_in_list: index,
                created_at: new Date(),
                updated_at: new Date(),
                gender: userInfo.meta.gender,
                age: userInfo.meta.age,
                mood: userInfo.meta.mood,
            };
            places_temp.push(place);
        }
    }

    database.setPlacesTemp(userInfo.user_id, places_temp).then(function (res) {
        resolve(places_temp)
    }).catch(function (err) {
        error.message('Wops, There is an error!', 500, "updateUserInfo Exception: "+err, setPlacesTemp);
        reject("updating places_temp has problem: "+err)
    });

});


module.exports = { recommendations };