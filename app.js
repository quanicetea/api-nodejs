require('dotenv').config()
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


// Connect DB by mongoose
mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://quan_api_nodejs:thaibaoquan000@ds237357.mlab.com:37357/heroku_kj8ltphw',{
        useUnifiedTopology: true,
        useNewUrlParser: true,
       
    })
    .then(() => {
        console.log('✅Connect database successfully');
    })
    .catch((error) => {
        console.error(`Failed ${error}`)
    });

const app = express();

// Middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
// Routes
app.get('/',(req, res, next) => {
    return res.status(200).json({
        message: "OK", 
    })
});

const userRoute = require('./routes/users.js');
app.use('/user',userRoute)

// Catch Errors
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Function Handle Error
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;

    // response to client
    return res.status(status).json({
        error:{
            status: status,
            message: error.message
        }
    })
});
// Start Server
const port = app.get('port') || 3001;
app.listen(port,()=>{ console.log(`🖥 Server is running at: ${'<http://127.0.0.1:'+port}>`)});
