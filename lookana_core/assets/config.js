/**
 * Created by sadra on 11/12/17.
 */

const fs = require("fs");
const env = JSON.parse(fs.readFileSync("env.json"));

module.exports = {
    skybiometry_api : 'https://api.skybiometry.com/fc/',
    skybiometry_key : env.skybiometry_key,
    skybiometry_secret : env.skybiometry_secret,
    sightengine_api : 'https://api.sightengine.com/1.0/check.json',
    sightengine_key : env.sightengine_key,
    sightengine_secret : env.sightengine_secret,
    clarifai_key : env.clarifai_key,
    apixu : "https://api.apixu.com/v1/current.json?key="+env.apixu+"&q=",
    telegram_token : env.telegram_token,
    googleMap: {
        key : env.googleMap_key
    },
    mongo: env.mongo,
    placeRadar : {
        minCount: 10,
        radiusMin : 1500,
        radiusMax : 5000
    },
    data_store : {
        name: "lookana_temp_data",
        items: {
            is_context_aware: "is_context_aware",
            directory_password: "directory_password"
        }
    },
    app_port: env.port,
};