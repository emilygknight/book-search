require("dotenv").config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://35.160.120.126:27017/book-search');

module.exports = mongoose.connection;

