let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let app = express();
let httpRequest = require('request-promise');
let config = require('./lookana_core/assets/config');
let googleMapsClient = require('@google/maps').createClient({
    key: config.googleMap.key
});
const database = require('./lookana_core/database/functions');
const stats = require('./lookana_core/stats');
const dataStore = require('./lookana_core/database/dataStore');
const fs = require('fs');

//Some MiddleWares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname+'/public'));


// view engine setup
app.set('views', path.join(__dirname, 'layouts'));
app.set('view engine', 'pug');


//Set Startup Temp data
dataStore.setDefaultSettings();


let LookanaBot = require('./lookana_core/telegram/lookanabot');


app.get('/', function (req, res) {
    res.render('under-construction',
        {
            title : 'Home'
        }
    )
});

app.get('/emotion', function (req, res) {

    let imageUrl = 'http://cv.isapanah.com/profile/thumb/500x500/0yXzqzjLQVuVf5xq8FfCx5Dpeh4T2r6w.jpg';

    let options = {
        method: 'GET',
        uri: config.skybiometry_api+"faces/recognize.json"+"?api_key="+config.skybiometry_key+"&api_secret="+config.skybiometry_secret+"&urls="+imageUrl+"&uids=all@lookana"+"&attributes=gender,age,mood",
        headers: {
            'Content-Type': 'application/json',
        },
        json: true,
    };

    httpRequest(options)
        .then(function (body) {

            let attr = body.photos[0].tags[0].attributes;

            let gender = attr.gender.value;
            let age = attr.age_est.value;
            let mood = attr.mood.value;

            res.send("Hi my friends. You are a "+gender+", and you have "+age+" years old. I think you are "+mood+". Is that true?");
            console.log("successfully.")
        })
        .catch(function (err) {
            res.send(err);
            console.log("Error: "+err)
        });


});

app.post('/find-location', function (req, res) {

    let latitude = req.body.latitude;
    let longitude = req.body.longitude;


    googleMapsClient.placesNearby({
        language: 'fa',
        location: [latitude, longitude],
        rankby: 'distance',
        type: 'night_club'
    }, function(err, response) {
        if (!err) {
            res.send(response.json.results);
        }else{
            res.send(err);
        }
    });


});

app.get('/getAllUsersList', function (req, res) {

    database.getAllUsersList().then(function (users) {
        res.status(200).send(users);
    }).catch(function (err) {
        res.status(400).send({"title":"Oh, there is an error", "data": err})
    })

});

app.post('/getTheUserByUserID', function (req, res) {

    let user_id = req.body.user_id;

    database.getTheUserByUserID(user_id).then(function (user) {
        res.status(200).send(user);
    }).catch(function (err) {
        res.status(err.status).send(err)
    })

});

app.post('/getTheUserByDBID', function (req, res) {

    let db_id = req.body.db_id;

    database.getTheUserByDatabaseID(db_id).then(function (user) {
        res.status(200).send(user);
    }).catch(function (err) {
        res.status(err.status).send(err)
    })

});

app.delete('/deleteAllUsers', function (req, res) {

    database.deleteAllUsers().then(function (user) {
        res.status(200).send(user);
    }).catch(function (err) {
        res.status(err.status).send(err)
    })

});


app.get('/stats', function (req, res) {

    stats.getStats().then(function (stats) {
        res.status(200).send(stats);
    }).catch(function (err) {
        res.status(404).send({
            error : "No status found",
            reason: err
        });
    });

});

app.get('/analytics', function (req, res) {
    // res.sendFile(path.join(__dirname+'/layouts/griph.html'));
    res.render('graph',
        {
            title : 'Analytics'
        }
    )
});


app.listen(config.app_port);
