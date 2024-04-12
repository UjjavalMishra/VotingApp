const express = require('express');
const app = express();

const connection = require('./connection');

// setting env
require('dotenv').config();

// body parser for handling form data
// It's used to parse the body of incoming HTTP requests.
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// setting port
const PORT = process.env.PORT || 3000;

// importing routes
const userRoutes = require('./routes/user');
const candidateRoutes = require('./routes/candidate');

app.use('/user', userRoutes);
app.use('/candidate',candidateRoutes);


app.listen(PORT, ()=>{
    console.log('listening on port 3000');
})