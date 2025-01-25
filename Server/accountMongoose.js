const mongoose = require('mongoose');

//account schema
const { Schema } = mongoose;

const accountSchema = new Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    profile: { type: String, require: true },
    profileHash: { type: String, require: true },
    healthPoints: { type: Number, require: true },
    frontSprite: { type: String, require: true },
    backSprite: { type: String, require: true },
    sideSprite: { type: String, require: true },
    attackSideSprite: { type: String, require: true },
    attackFrontSprite: { type: String, require: true },
    attackBackSprite: { type: String, require: true }
});

const accountModel = mongoose.model('account', accountSchema);

module.exports = accountModel;