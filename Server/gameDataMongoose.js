const mongoose = require('mongoose');

//game schema
const { Schema } = mongoose;

const gameSchema = new Schema({
    playerCount: { type: Number, require: true },
});

const gameModel = mongoose.model('gameData', gameSchema);

module.exports = gameModel;