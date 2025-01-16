const mongoose = require('mongoose');

//account schema
const { Schema } = mongoose;

const accountSchema = new Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    profile: { type: String, require: true },
    sprites: { type: Array, require: true } 
});

const accountModel = mongoose.model('account', accountSchema);

module.exports = accountModel;