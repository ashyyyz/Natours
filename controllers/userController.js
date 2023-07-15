const fs = require('fs');
const user = require('./../models/userModel');
const AppError = require('../utils/appError');
const handler = require('./factoryHandler');

const catchAsync = fn => {
    return(req, res, next) => {
      fn(req, res, next).catch(err => next(err))
    }
  }

exports.getAllUsers = handler.readAll(user); 
// catchAsync(async (req,res,next) => {
//     const users = await user.find();
//     res
//     .status(200)
//     .json({
//         status : "success",
//         users : users.length,
//         users 
//     })
// })


// exports.addUser = (req,res) => {
//     res
//     .status(504)
//     .json({
//         status : "Under construction",
//         message : "See you soon!"
//     })
// }

exports.getMe = (req,res,next) => {
    req.params.id = req.user.id;
    next();
}
exports.readMe = handler.readOne(user);
exports.deleteMe = handler.deleteOne(user);
// (req,res) => {
//     res
//     .status(504)
//     .json({
//         status : "Under construction",
//         message : "See you soon!"
//     })
// }

exports.deleteUser = handler.deleteOne(user);
// (req,res) => {
//     res
//     .status(504)
//     .json({
//         status : "Under construction",
//         message : "See you soon!"
//     })
// }

exports.updateUser = (req,res) => {
    res
    .status(504)
    .json({
        status : "Under construction",
        message : "See you soon!"
    })
}

exports.updateMe = catchAsync(async (req, res, next) => {
    if(req.body.password || req.body.passwordConfirm)
       return next(new AppError('You cannot change the password through this route kindly go to /updatePassword', 400));
    
    //filterBody = 
    //const userExist = await user.findByIdAndUpdate(req.user, );
})