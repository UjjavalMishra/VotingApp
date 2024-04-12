const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.MONGODB_URL_LOCAL;

const connection = mongoose.connect(mongoURL)

const db = mongoose.connection;

db.on('connected', ()=>{
    console.log('Connected to Mongodb Server');
})

db.on('error', (error)=>{
    console.log('An error occured', error);
})

module.exports = { connection, }