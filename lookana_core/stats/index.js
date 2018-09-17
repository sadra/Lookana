/**
 * Created by sadra on 1/28/18.
 */

const database = require('../database/functions');


let getStats = () => {

    return new Promise(function (resolve, reject) {

        let usersList;
        let acceptedPlaces;
        let deniedPlaces;
        let acceptedCompareStats;
        let acceptedContextAwarenessRecommends;
        let acceptedRegularRecommends;
        let deniedCompareStats;
        let deniedContextAwarenessRecommends;
        let deniedRegularRecommends;
        let usersStats;
        let recommendsTimeLine;


        database.getAllUsersList().then(function(users) {
            usersList = users;
            return getUsersStats(users);

        }).then(function(users_stats) {
            usersStats = users_stats;
            return getAcceptedPlaces(usersList);

        }).then(function (accepted_places) {
            acceptedPlaces = accepted_places;
            return getCompare(acceptedPlaces);

        }).then(function (compareStats) {
            acceptedCompareStats = compareStats;
            return getContextAwarenessRecommends(acceptedPlaces);

        }).then(function (contextAwarenessRecommends) {
            acceptedContextAwarenessRecommends = contextAwarenessRecommends;
            return getRegularRecommends(acceptedPlaces);

        }).then(function(RegularRecommends) {
            acceptedRegularRecommends = RegularRecommends;
            return getDeniedPlaces(usersList);

        }).then(function (denied_places) {
            deniedPlaces = denied_places;
            return getCompare(deniedPlaces);

        }).then(function (compare_stats) {
            deniedCompareStats = compare_stats;
            return getContextAwarenessRecommends(deniedPlaces);

        }).then(function (context_awareness_recommends) {
            deniedContextAwarenessRecommends = context_awareness_recommends;
            return getRegularRecommends(deniedPlaces);

        }).then(function (regular_recommends) {
            deniedRegularRecommends = regular_recommends;
            return getRecommendsTimeLine(acceptedPlaces, deniedPlaces);

        }).then(function (recommends_time_line) {
            recommendsTimeLine = recommends_time_line;

            let total = acceptedPlaces.length + deniedPlaces.length;
            
            resolve({
                users: usersStats,
                compare: {
                    total: total,
                    accepted_places: {
                        total: acceptedPlaces.length,
                        percent: total === 0 ? 0 : round((acceptedPlaces.length/total) * 100),
                    },
                    denied_places: {
                        total: deniedPlaces.length,
                        percent: total === 0 ? 0 : round((deniedPlaces.length/total) * 100),
                    }
                },
                accepted_places: {
                    compare : acceptedCompareStats,
                    context_awareness_recommends: acceptedContextAwarenessRecommends,
                    regular_recommends: acceptedRegularRecommends
                },
                denied_places: {
                    compare : deniedCompareStats,
                    context_awareness_recommends: deniedContextAwarenessRecommends,
                    regular_recommends: deniedRegularRecommends
                },
                recommends_time_line : recommendsTimeLine
            })

        }).catch(function (err) {
            reject(err.toString())
        })

    });

};


let getAcceptedPlaces = (users) => new Promise(function (resolve, reject) {

    let acceptedPlaces = [];

    for ( user of users){
        for ( let acceptedPlace of user.accepted_places){
            acceptedPlaces.push(acceptedPlace)
        }
    }

    resolve(acceptedPlaces)

});


let getDeniedPlaces = (users) => new Promise(function (resolve, reject) {

    let deniedPlaces = [];

    for ( user of users){
        for ( let deniedPlace of user.denied_places){
            deniedPlaces.push(deniedPlace)
        }
    }

    resolve(deniedPlaces)

});


let getUsersStats = (users) => new Promise(function (resolve, reject) {

    let total = users.length;

    //gender
    let maleCount = 0;
    let femaleCount = 0;
    for ( user of users){
        if(user.meta.gender === 'male'){
            maleCount++
        }else{
            femaleCount++
        }
    }


    //age
    let age = {
        "7-14" : {
            total: 0,
            gender: {
                male: 0,
                female: 0
            }
        },
        "15-19" : {
            total: 0,
            gender: {
                male: 0,
                female: 0
            }
        },
        "20-29" : {
            total: 0,
            gender: {
                male: 0,
                female: 0
            }
        },
        "30-39" : {
            total: 0,
            gender: {
                male: 0,
                female: 0
            }
        },
        "40-49" : {
            total: 0,
            gender: {
                male: 0,
                female: 0
            }
        },
        "50+" : {
            total: 0,
            gender: {
                male: 0,
                female: 0
            }
        }
    };

    for( user of users){
        let userAge = parseInt(user.meta.age);
        switch (true) {
            case ( 7 <= userAge && userAge <= 14 ): incrementAge(["7-14"], user.meta.gender); break;
            case ( 15 <= userAge && userAge <= 19 ): incrementAge(["15-19"], user.meta.gender); break;
            case ( 20 <= userAge && userAge <= 29 ): incrementAge(["20-29"], user.meta.gender); break;
            case ( 30 <= userAge && userAge <= 39 ): incrementAge(["30-39"], user.meta.gender); break;
            case ( 40 <= userAge && userAge <= 40 ): incrementAge(["40-49"], user.meta.gender); break;
            case ( 50 <= userAge): incrementAge(["50+"], user.meta.gender); break;
            default:  break;
        }
    }

    function incrementAge(userAge, userGender) {
        age[userAge].total++;
        if(userGender === "male"){
            age[userAge].gender.male++;
        }else{
            age[userAge].gender.female++;
        }
    }


    //mood
    let mood = {
        happy : 0,
        sad : 0,
        angry : 0,
        surprised : 0,
        scared : 0,
        neutral : 0,
        disgusted : 0
    };

    for( user of users){
        let userMood = user.meta.mood;
        switch (userMood) {
            case "happy": mood.happy++; break;
            case "sad": mood.sad++; break;
            case "angry": mood.angry++; break;
            case "surprised": mood.surprised++; break;
            case "scared": mood.scared++; break;
            case "neutral": mood.neutral++; break;
            case "disgusted": mood.disgusted++; break;
            default:  break;
        }
    }

    //final users stats
    let stats = {
        total: users.length,
        age: {
            "7-14" : {
                total: age["7-14"].total,
                percent: total === 0 ? 0 : round((age["7-14"]/total) * 100),
                gender: {
                    male: age["7-14"].gender.male,
                    female: age["7-14"].gender.female
                }
            },
            "15-19" : {
                total: age["15-19"].total,
                percent: total === 0 ? 0 : round((age["15-19"]/total) * 100),
                gender: {
                    male: age["15-19"].gender.male,
                    female: age["15-19"].gender.female
                }
            },
            "20-29" : {
                total: age["20-29"].total,
                percent: total === 0 ? 0 : round((age["20-29"]/total) * 100),
                gender: {
                    male: age["20-29"].gender.male,
                    female: age["20-29"].gender.female
                }
            },
            "30-39" : {
                total: age["30-39"].total,
                percent: total === 0 ? 0 : round((age["30-39"]/total) * 100),
                gender: {
                    male: age["30-39"].gender.male,
                    female: age["30-39"].gender.female
                }
            },
            "40-49" : {
                total: age["40-49"].total,
                percent: total === 0 ? 0 : round((age["40-49"]/total) * 100),
                gender: {
                    male: age["40-49"].gender.male,
                    female: age["40-49"].gender.female
                }
            },
            "50+" : {
                total: age["50+"].total,
                percent: total === 0 ? 0 : round((age["50+"]/total) * 100),
                gender: {
                    male: age["50+"].gender.male,
                    female: age["50+"].gender.female
                }
            }
        },
        gender: {
            male: {
                total: maleCount,
                percent: total === 0 ? 0 : round((maleCount/total) * 100)
            },
            female: {
                total: femaleCount,
                percent: total === 0 ? 0 : round((femaleCount/total) * 100)
            }
        },
        mood: {
            happy : {
                total: mood.happy,
                percent: total === 0 ? 0 : round((mood.happy/total) * 100)
            },
            sad : {
                total: mood.sad,
                percent: total === 0 ? 0 : round((mood.sad/total) * 100)
            },
            angry : {
                total: mood.angry,
                percent: total === 0 ? 0 : round((mood.angry/total) * 100)
            },
            surprised : {
                total: mood.surprised,
                percent: total === 0 ? 0 : round((mood.surprised/total) * 100)
            },
            scared : {
                total: mood.scared,
                percent: total === 0 ? 0 : round((mood.scared/total) * 100)
            },
            neutral : {
                total: mood.neutral,
                percent: total === 0 ? 0 : round((mood.neutral/total) * 100)
            },
            disgusted : {
                total: mood.disgusted,
                percent: total === 0 ? 0 : round((mood.disgusted/total) * 100)
            }
        }
    };

    resolve(stats)

});


let getContextAwarenessRecommends = (places) => new Promise(function (resolve, reject) {

    let total = 0;
    let firstRecommend = 0;
    let secondRecommend = 0;
    let thirdRecommend = 0;
    let otherRatesRecommend = 0;

    for (let place of places){
        if(place.is_context_aware === true){
            total ++;
            switch (place.rate_in_list) {
                case 0:
                    firstRecommend ++;
                    break;
                case 1:
                    secondRecommend ++;
                    break;
                case 2:
                    thirdRecommend ++;
                    break;
                default:
                    otherRatesRecommend ++;
            }

        }
    }


    let ContextAwarenessRecommendStats = {
        total: total,
        first_recommend: {
            total: firstRecommend,
            percent: total === 0 ? 0 : round((firstRecommend/total) * 100)
        },
        second_recommend: {
            total: secondRecommend,
            percent: total === 0 ? 0 : round((secondRecommend/total) * 100)
        },
        third_recommend: {
            total: thirdRecommend,
            percent: total === 0 ? 0 : round((thirdRecommend/total) * 100)
        },
        other_rates_recommend: {
            total: otherRatesRecommend,
            percent: total === 0 ? 0 : round((otherRatesRecommend/total) * 100)
        }
    };

    resolve(ContextAwarenessRecommendStats);

});

let getRegularRecommends = (places) => new Promise(function (resolve, reject) {

    let total = 0;
    let firstRecommend = 0;
    let secondRecommend = 0;
    let thirdRecommend = 0;
    let otherRatesRecommend = 0;

    for (let place of places){
        if(place.is_context_aware === false){
            total ++;
            switch (place.rate_in_list) {
                case 0:
                    firstRecommend ++;
                    break;
                case 1:
                    secondRecommend ++;
                    break;
                case 2:
                    thirdRecommend ++;
                    break;
                default:
                    otherRatesRecommend ++;
            }

        }
    }


    let RegularRecommendRecommendStats = {
        total: total,
        first_recommend: {
            total: firstRecommend,
            percent: total === 0 ? 0 : round((firstRecommend/total) * 100)
        },
        second_recommend: {
            total: secondRecommend,
            percent: total === 0 ? 0 : round((secondRecommend/total) * 100)
        },
        third_recommend: {
            total: thirdRecommend,
            percent: total === 0 ? 0 : round((thirdRecommend/total) * 100)
        },
        other_rates_recommend: {
            total: otherRatesRecommend,
            percent: total === 0 ? 0 : round((otherRatesRecommend/total) * 100)
        }
    };


    resolve(RegularRecommendRecommendStats);


});

let getCompare = (places) => new Promise(function (resolve, reject) {

    let total = places.length;
    let contextAware = 0;
    let regular = 0;

    for (let place of places){
        if(place.is_context_aware === true){
            contextAware++;
        }else{
            regular++;
        }
    }

    let compareStats = {
        total: total,
        context_aware: {
            total: contextAware,
            percent: (contextAware/total) * 100
        },
        regular: {
            total: regular,
            percent: (regular/total) * 100
        }
    };

    resolve(compareStats);

});


let getRecommendsTimeLine = (acceptedRecommends, deniedRecommends) => new Promise(function (resolve, reject) {


    let today = new Date();
    let thirtyDays = new Date().setDate(today.getDate()-30);
    let month = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    let monthName = month[today.getMonth()];

    let deniedRegular = new Array(today.getDate()).fill(0);
    let deniedContextAware = new Array(today.getDate()).fill(0);
    let acceptedRegular = new Array(today.getDate()).fill(0);
    let acceptedContextAware = new Array(today.getDate()).fill(0);



    for(let i=0;i<acceptedRecommends.length;i++){
        let item_date = new Date(acceptedRecommends[i].created_at);
        if(thirtyDays <= item_date && item_date <= today){
            if(acceptedRecommends[i].is_context_aware){
                acceptedContextAware[item_date.getDate()-1]++;
            }else{
                acceptedRegular[item_date.getDate()-1]++;
            }
        }
    }

    for(let i=0;i<deniedRecommends.length;i++){
        let item_date = new Date(deniedRecommends[i].created_at);
        if(thirtyDays <= item_date && item_date <= today){
            if(deniedRecommends[i].is_context_aware){
                deniedContextAware[item_date.getDate()-1]++
            }else{
                deniedRegular[item_date.getDate()-1]++
            }
        }
    }

    let time_line = {
        today: {
            day: today.getDate(),
            month: monthName,
            year: today.getYear()
        },
        accepted: {
            regular: acceptedRegular,
            context_aware: acceptedContextAware
        },
        denied: {
            regular: deniedRegular,
            context_aware: deniedContextAware
        }
    };

    resolve(time_line)

});


function round(value) {
    let multiplier = Math.pow(10, 1 || 0);
    return Math.round(value * multiplier) / multiplier;
}


module.exports = { getStats };