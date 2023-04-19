//LOG app starting
console.log("Starting app...")


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
var profile = require('./routes/profile');

//Link .js with routes
app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/register', registerRouter);
app.use('/api/profile', profile);



//What does this do
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

//Deze onderdelen mogen weg
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/', (req, res) => {
    res.send('Got a POST request')
})

app.put('/user', (req, res) => {
    res.send('Got a PUT request at /user')
})

app.delete('/user', (req, res) => {
    res.send('Got a DELETE request at /user')
})

//IMAGES
app.use('/kitten', express.static('public'))

app.get('/kitten', (req, res) => {
    //maybe add . before /public
    res.sendFile(__dirname + '/public/kitten.jpg');
});

//LOG App Started
console.log("App Started.")



//MAG WEG
app.get('api/register', (req, res) => {
    res.send("Register a user here")
})




//UC 201 - MAG WEG
app.post('api/register', (req, res) => {
    const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        street: req.body.street,
        city: req.body.city,
        password: req.body.password,
        emailAdress: req.body.emailAdress,
    };
    console.log("User added " + firstName + " " + lastName);
    res.end(JSON.stringify(newUser));
})

//UC 202 - MAG WEG
app.get('api/user'), (req, res) => {

}