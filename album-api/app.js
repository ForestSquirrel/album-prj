var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var photoRouter = require('./routes/photo.router');
var albumRouter = require('./routes/album.router');
var {initDatabase} = require('./db-middleware/db_instance');
var app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // Allows access from any origin
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS"); // Include DELETE and any other methods you need
    next();
});


// Routes
app.use('/api/v1/photos', photoRouter);
app.use('/api/v1/albums', albumRouter);
app.use('/static', express.static('D:/2 курс/СВП/album-prj/public/uploads'));
// Initialize database and start server
initDatabase().then(() => {
    app.listen(3001, () => {
        console.log('Server is running on port 3001');
    });
}).catch(error => {
    console.error('Database initialization failed:', error);
});

module.exports = app;
т