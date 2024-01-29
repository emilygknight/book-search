const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://53350:27017/book-search');

module.exports = mongoose.connection;
