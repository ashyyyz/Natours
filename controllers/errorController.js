const AppError = require('./../utils/appError');

const handleErrorDuplicateId = err => {
    const message = `Duplicate field value : ${err.keyValue.name}, enter another value`;
    return new AppError(message, 400);
}

const handleErrorInvalidIdDB = err => {
    const message = `Invalid ${err.value} for the given ${err.path}`;
    return new AppError(message, 400);
}

const handleValidationError = err => {
    const data = Object.values(err.errors).map(el => el.message);
    const message = `Validation Error : ${data.join('. ')}`;
    return new AppError(message, 400);
}
const handleJWTError = () => {
    const message = 'Invalid token!Kindly Login again';
    return new AppError(message, 401);
}

const handleTokenExpireError = () => {
    return new AppError('The jwt token has expired! Kindly login again.', 401);
}

const sendErrorDev = (err, res) => {
    res
    .status(err.statusCode)
    .json({
       error : err,
       status : err.status,
       message : err.message,
       stack : err.stack
    })
}


const sendErrorProd = (err, res) => {
    if(err.isOperational){
        res
        .status(err.statusCode)
        .json({
          status : err.status,
          message : err.message
        })
    }else{
        console.error('Error', err);
        res
        .status(500)
        .json({
          status : 'error',
          message : 'Something went wrong!'
        })
    }
}

module.exports = (err, req, res, next) => {
    //console.log(err.stack); //it helps to know what functions are executed in stack
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';

    if(process.env.NODE_ENV === 'development')
    {
       sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === 'production')
    {
        let error = { ...err };
        if(error.kind === "ObjectId")
            error = handleErrorInvalidIdDB(error);
        else if(error.code === 11000)
            error = handleErrorDuplicateId(error);
        else if(error._message === 'Validation failed')
            error = handleValidationError(error);
        else if(error.name === 'JsonWebTokenError')
            error = handleJWTError();
        else if(error.name === 'TokenExpiredError')
            error = handleTokenExpireError();
        sendErrorProd(error, res);

    }
}
