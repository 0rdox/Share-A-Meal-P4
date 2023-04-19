//LOG app starting
console.log("Starting app...")

//CHECK HTTP STATUS CODES

//What does this do
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


//Define app
var app = express();

//ROUTES
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var profileRouter = require('./routes/profile');
var infoRouter = require('./routes/info');

//Link .js with routes
app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/register', registerRouter);
app.use('/api/profile', profileRouter);
app.use('/api/info', infoRouter)


//What does this do // maybe delete
app.use('*', (req, res, next) => {
    const method = req.method;
    console.log('Method ' + $(method) + 'is called');
    next();
})

//What does this do // keep
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//IMAGES
app.use('/kitten', express.static('public'))

app.get('/kitten', (req, res) => {
    //maybe add . before /public
    res.sendFile(__dirname + '/public/kitten.jpg');
});

//LOG App Started
console.log("App Started.")

module.exports = app;