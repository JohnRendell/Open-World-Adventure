const mongoose = require('mongoose');

//account schema
const { Schema } = mongoose;

const accountSchema = new Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    profile: { type: String, require: true },
    frontSprite: { type: String, require: true },
    backSprite: { type: String, require: true },
    sideSprite: { type: String, require: true } 
});

const accountModel = mongoose.model('account', accountSchema);

module.exports = accountModel;