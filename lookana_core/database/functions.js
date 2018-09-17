/**
 * Created by sadra on 11/24/17.
 */
const mongoose = require('mongoose');
const configs = require('../assets/config');
let User = require('./model/user');
let error = require('../assets/controller/error');

//Mongo Connection
mongoose.Promise = global.Promise;
async function run() {
    await mongoose.connect('mongodb://'+configs.mongo.uri+'/'+configs.mongo.db, { useMongoClient: true });

    const Test = mongoose.model('Test', new mongoose.Schema({ name: String }));
    const doc = await Test.create({ name: 'Val' });
        console.log('Mongo connection Result: '+doc);
}
run().catch(error => console.error(error.stack));


//Handler Functions
function updateUser(user) {

    user.set({ updated_at: new Date() });
    user.set({ username: (user.username !== undefined && user.username !== 'null' && user.username !== null) ? user.username : user.id });
    user.save().then(function (user) {
        console.log('User updated: '+user);
    }).catch(function (err) {
        console.log('Cannot update user: '+err);
    });

}

//Module Function
let saveUser = (user) => {
    return new Promise(function (resolve, reject) {

        let newUser = new User({
            user_id: user.id,
            username: (user.username !== undefined && user.username !== 'null' && user.username !== null) ? user.username : user.id,
            first_name: (user.first_name !== undefined && user.first_name !== 'null' && user.first_name !== null) ? user.first_name : "null",
            last_name: (user.last_name !== undefined && user.last_name !== 'null' && user.last_name !== null) ? user.last_name : "null"
        });

        newUser.save()
            .then(function (message) {
                resolve('userAdded: '+message);
            }).catch(function (err) {
                reject(error.message('Wops, There is an error!', 500, err.toString(), saveUser));
            });
    })
};

let updateUserBasic = (userID, userInfo) => {

    return new Promise(function (resolve, reject) {

        User.update({user_id: userID}, {
            meta : {
                gender: userInfo.gender,
                age : userInfo.age,
                mood: userInfo.mood
            }
        }).then(function (res) {
            resolve('userUpdated: '+ JSON.stringify(res) );
        }).catch(function (err) {
            reject(error.message('Wops, There is an error!', 500, err, this.name));
        });

    });

};

let updateUserLocation = (userID, location) => {

    return new Promise(function (resolve, reject) {

        User.update({user_id: userID}, {
            "meta.location.longitude" : location.longitude,
            "meta.location.latitude" : location.latitude,
        }).then(function (res) {
            resolve('userUpdated: '+ JSON.stringify(res) );
        }).catch(function (err) {
            reject(error.message('Wops, There is an error!', 500, err, this.name));
        });

    });

};

let setPlacesTemp = (userID, placesTemp) => {

    return new Promise(function (resolve, reject) {

        User.update({user_id: userID}, {
            places_temp : placesTemp
        }).then(function (res) {
            resolve('userUpdated: '+ JSON.stringify(res) );
        }).catch(function (err) {
            reject(error.message('Wops, There is an error!', 500, err, this.name));
        });

    });

};

let getUnCheckedPlaceFromTemp = (userID) => {

    return new Promise(function (resolve, reject) {

        findUser(userID).then(function (user) {


            let places_temp = [];
            let denied_places = [];

            denied_places = user.denied_places;
            places_temp = user.places_temp;

            let recommendedPlace = undefined;


            for (let index = 0; index < places_temp.length; ++index) {

                if (!places_temp[index].checked) {
                    recommendedPlace = places_temp[index];
                    places_temp[index].checked = true;
                    break;
                } else {
                    denied_places.push(places_temp[index]);
                    places_temp.splice(index--, 1);
                }

            }

            console.log("recommendedPlace: "+recommendedPlace);


            User.update({user_id: userID}, {
                places_temp : places_temp,
                denied_places : denied_places
            }).then(function (res) {
                if(recommendedPlace !== undefined){
                    resolve(recommendedPlace);
                }else{
                    error.message('Wops, There is an error!', 404, "Not found any recommended place!", getUnCheckedPlaceFromTemp);
                    reject("Not found any recommended place!")
                }
            }).catch(function (err) {
                error.message('Wops, There is an error!', 500, err, getUnCheckedPlaceFromTemp);
                reject(err);
            });

        }).catch(function (err) {
            error.message('Wops, There is an error!', 500, err, getUnCheckedPlaceFromTemp);
            reject("Not found any user by this ID")
        })

    });

};

let getFavoritePlaceFromTemp = (userID) => {

    return new Promise(function (resolve, reject) {

        findUser(userID).then(function (user) {

            let places_temp = user.places_temp;
            let accepted_places = user.accepted_places;
            let recommendedPlace = undefined;

            let index = places_temp.length;
            while(index--){
                if(places_temp[index].checked){
                    recommendedPlace = places_temp[index];
                    places_temp[index].accepted = true;
                    accepted_places.push(recommendedPlace);
                    break;
                }
            }


            User.update({user_id: userID}, {
                places_temp : places_temp,
                accepted_places : accepted_places
            }).then(function (res) {
                if(recommendedPlace !== undefined){
                    resolve(recommendedPlace);
                }else{
                    error.message('Wops, There is an error!', 404, "Not found any recommended place!", this.name);
                    reject("Not found any recommended place!")
                }
            }).catch(function (err) {
                error.message('Wops, There is an error!', 500, err, this.name);
                reject(err);
            });

        }).catch(function (err) {
            error.message('Wops, There is an error!', 500, err, this.name);
            reject("Not found any user by this ID")
        })

    });

};

let findUser = (user_id) => {
    return new Promise(function (resolve, reject) {

        User.find({user_id: user_id}).then(function (user) {
            if(user.length > 0){
                resolve(user[0]);
                updateUser(user[0]);
            }else{
                reject(error.message("Couldn't find user", 401, "Couldn't find user with user_id: "+user_id, findUser));
            }
        }).catch(function (err) {
            reject(error.message('Wops, There is an error!', 500, err.toString(), findUser));
        });

    })
};


//For API
let getAllUsersList = () => {
    return new Promise(function (resolve, reject) {

        User.find({}).then(function (users) {
                resolve(users);
            }).catch(function (err) {
                reject(error.message('Wops, There is an error!', 500, err, getAllUsersList));
            });

    })
};

let getTheUserByUserID = (user_id) => {
    return new Promise(function (resolve, reject) {

        User.find({user_id: user_id}).then(function (user) {
                if(user.length > 0){
                    resolve(user[0]);
                    updateUser(user[0]);
                }else{
                    reject(error.message("Couldn't find user", 401, "Couldn't find user with user_id: "+user_id, getTheUserByUserID));
                }
            }).catch(function (err) {
                reject(error.message('Wops, There is an error!', 500, err.toString(), getTheUserByUserID));
            });

    })
};

let getTheUserByDatabaseID = (db_id) => {
    return new Promise(function (resolve, reject) {

        User.findById(db_id).then(function (user) {
            if(user !== null){
                resolve(user);
                updateUser(user);
            }else{
                reject(error.message("Couldn't find user", 401, "Couldn't find user with db_id: "+db_id, getTheUserByDatabaseID));
            }
        }).catch(function (err) {
            reject(error.message('Wops, There is an error!', 500, err, getTheUserByDatabaseID));
        });

    })
};

let deleteAllUsers = () => {
    return new Promise(function (resolve, reject) {

        User.remove().then(function (message) {
            resolve(message);
        }).catch(function (err) {
            reject(error.message('Wops, There is an error!', 500, err, deleteAllUsers));
        });

    })
};



module.exports = { saveUser, getAllUsersList, getTheUserByUserID, getTheUserByDatabaseID, deleteAllUsers, updateUserBasic, updateUserLocation, findUser, setPlacesTemp, getUnCheckedPlaceFromTemp, getFavoritePlaceFromTemp};