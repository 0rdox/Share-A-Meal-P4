var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


//Define app
var app = express();

//ROUTES
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var infoRouter = require('./routes/info');
var mealRouter = require('./routes/meal');
var loginRouter = require('./routes/login');

//Link .js with routes
app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/info', infoRouter);
app.use('/api/meal', mealRouter);
app.use('/api/auth', loginRouter);


//Console.logs methods when called
app.use('*', (req, res, next) => {
    const method = req.method;
    console.log('Method ' + $(method) + 'is called');
    next();
})

//GENERIC ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(err.code).json({
        statusCode: err.code,
        message: err.message,
        data: {}
    })
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



module.exports = app;