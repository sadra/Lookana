/**
 * Created by sadra on 11/12/17.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id : { type: Number, unique: true},
    username : { type: String, required: true, unique: true },
    first_name : String,
    last_name : String,
    mobile : String,
    created_at: Date,
    updated_at: Date,
    meta: {
        gender: String,
        age: String,
        mood: String,
        location: {
            longitude: String,
            latitude: String
        }
    },
    places_temp : [
        {
            name: String,
            rating: Number,
            price_level: Number,
            types: [],
            photos: [],
            vicinity: String,
            location: {
                longitude: String,
                latitude: String
            },
            distance: {
                measure: String,
                value: Number
            },
            duration: {
                measure: String,
                value: Number
            },
            duration_in_traffic: {
                measure: String,
                value: Number
            },
            checked : Boolean,
            accepted: Boolean,
            is_context_aware: Boolean,
            rate_in_list: Number,
            created_at: Date,
            updated_at: Date,
            gender: String,
            age: String,
            mood: String,
        }
    ],
    accepted_places : [
        {
            name: String,
            rating: Number,
            price_level: Number,
            types: [],
            photos: [],
            vicinity: String,
            location: {
                latitude: String,
                longitude: String
            },
            distance: {
                measure: String,
                value: Number
            },
            duration: {
                measure: String,
                value: Number
            },
            duration_in_traffic: {
                measure: String,
                value: Number
            },
            checked : Boolean,
            accepted: Boolean,
            is_context_aware: Boolean,
            rate_in_list: Number,
            created_at: Date,
            updated_at: Date,
            gender: String,
            age: String,
            mood: String
        }
    ],
    denied_places : [
        {
            name: String,
            rating: Number,
            price_level: Number,
            types: [],
            photos: [],
            vicinity: String,
            location: {
                latitude: String,
                longitude: String
            },
            distance: {
                measure: String,
                value: Number
            },
            duration: {
                measure: String,
                value: Number
            },
            duration_in_traffic: {
                measure: String,
                value: Number
            },
            checked : Boolean,
            accepted: Boolean,
            is_context_aware: Boolean,
            rate_in_list: Number,
            created_at: Date,
            updated_at: Date,
            gender: String,
            age: String,
            mood: String,
        }
    ]
});

// is_context_aware

// UsersSchema.pre('findOneAndUpdate', function (next) {
//
//     const self = this._update;
//
//     if(self.created_at === undefined)
//         self.created_at =  new Date();
//     self.updated_at =  new Date();
//     next();
//
//     delete self._id;
//     delete self.created_at;
//     self.updated_at =  new Date();
//     next();
//
// });

userSchema.pre('save', function(next) {

    let currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;

    let self = this;
    User.find({user_id: self.user_id}, function (err, docs) {
        if (!docs.length){
            next();
        }else{
            console.log('user exists: ', self.user_id);
        }
    });

});


const User = mongoose.model('users', userSchema);

module.exports = User;