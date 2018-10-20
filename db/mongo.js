const mongoose = require('mongoose');
const mongoDB = 'mongodb://127.0.0.1/music_room';

mongoose.connect(mongoDB);

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
