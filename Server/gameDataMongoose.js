const mongoose = require('mongoose');

//game schema
const { Schema } = mongoose;

const gameSchema = new Schema({
    playerCount: { type: Number, require: true },
    default_frontSkin: { type: Array, require: true }
});

const gameModel = mongoose.model('gameData', gameSchema);

module.exports = gameModel;