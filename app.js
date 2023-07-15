const path = require('path')
const fs = require('fs');
const express = require('express'); //Exporting express modules
const app = express(); //express is a function which will pass all the methods to app 
const morgan = require('morgan');  
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');

//variable

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

//1) GLOBAL MIDDLEWARE

app.use(helmet());
if(process.env.NODE_ENV === 'development')
     app.use(morgan('common')); //It is used to log into the console, the HTTP request that is the date and time of HTTP request, the status code of response, the time taken to respond, the size of the response,etc.
const limiter = rateLimit({
    max : 100,
    windowMs : 60 * 60 * 1000,
    message : 'Too many requests from this api, please try again in an hour!'
})
app.use(limiter);
app.use(express.json({ limit : '10kb'})); //Middleware, for req.body if we want req.body we need to use this middleware.

app.use(mongoSanitize()); // To avoid Nosql injection
app.use(xss()); //To  avoid html injection
app.use(hpp());

//Another Middleware defined By User
app.use((req, res, next) => {
    console.log("Hello from the middleware!");
    next();
})
//If you will define this middleware after the route handlers then this middleware will not be called 
//So if you want to use any middleware define it before the route handlers

//Another middleware user-defined
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})
// now u can call req.requestTime in any function
app.use(express.static(path.join(__dirname,'public')));


// //GET /
// app.get('/', (req, res) => {
//     res
//     .status(200)
//     .send('Hello this is the Home Page!');
// });
// //POST /
// app.post('/', (req, res) => {
//     res
//     .status(200)
//     .json({message: 'Hello you now post anything on this page!', app : 'natours'});
// })
app.get('/', (req, res) => {
    res.status(200).render('base');
})

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);


app.all('*', (req,res,next) => {
    // const err = new Error(`There is no path to ${req.originalUrl} on the server!`);
    // err.status = 'Fail';
    // err.statusCode = 404;

    next(new AppError(`There is no path to ${req.originalUrl} on the server!`,404));
    // res
    //   .status(404)
    //   .json({
    //     status : 'Fail',
    //     message : `There is no path to ${req.originalUrl} on the server!`
    //   })
})

app.use(errorHandler);

module.exports = app;