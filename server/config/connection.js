const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://27017/book-search');

module.exports = mongoose.connection;
