const mongoose = require('mongoose');

//account schema
const { Schema } = mongoose;

const accountSchema = new Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    profile: { type: Object, require: true },
    healthPoints: { type: Number, require: true },
    frontSprite: { type: Object, require: true },
    backSprite: { type: Object, require: true },
    sideSprite: { type: Object, require: true },
    attackSideSprite: { type: Object, require: true },
    attackFrontSprite: { type: Object, require: true },
    attackBackSprite: { type: Object, require: true }
});

const accountModel = mongoose.model('account', accountSchema);

module.exports = accountModel;