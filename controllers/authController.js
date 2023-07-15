const user = require('./../models/userModel');
const { promisify} = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const exp = require('constants');
const sendEmail = require('./../utils/mail');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const catchAsync = fn => {
    return(req, res, next) => {
      fn(req, res, next).catch(err => next(err))
    }
  }


const assignToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = assignToken(user._id);
  const cookieOptions = {
    expires : new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly : true
  }
  if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions)
  res.status(statusCode).json({
      status : "success",
      token,
      user
  })
}

exports.signUp = catchAsync(async(req,res,next) => {
    const userCreated = await user.create({
      name : req.body.name,
      email : req.body.email,
      role : req.body.role,
      password : req.body.password,
      passwordConfirm : req.body.passwordConfirm,
      passwordChangedAt : req.body.passwordChangedAt
    });

    createSendToken(userCreated._id,201,res);
})

exports.login = catchAsync(async(req, res, next) => {
  //1)Check the body if the user has entered both the email and password
  //2)Check if the email is correct or not and then match the passwords
  //3)If everything is correct generate the JWT and send back JWT back to the user.

  const { email, password } = req.body;
  if(!email || !password)
    return next(new AppError('Please enter email and password', 400));
  const userFound = await user.findOne({ email }).select('+password');
  
  if(!userFound || !(await userFound.isPasswordCorrect(password, userFound.password)))
    return next(new AppError('email or password incorrect', 404));
  createSendToken(userFound,200,res);
})

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //Checking if the token exists that is if the user has logged in
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
  {
    token = req.headers.authorization.split(' ')[1];
    console.log(token);
   
  }
  if(!token)
    return next(new AppError('Kindly login first!',401));
  //console.log(token);

  //Verification of the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  //Checking if user corresponding to the id exists or not
  const userExist = await user.findById(decoded.id);
  console.log(userExist);
  if(!userExist)
    return next(new AppError('The user does not exist any longer!', 401));
  if(userExist.isPasswordChanged(decoded.iat))
    return next(new AppError('The user has changed password. Kindly, login again!'));

  req.user = userExist;
  next();
})

exports.restrict = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role))
      return next(new AppError('You are forbidden to perform the action!', 403));
    next();
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1)Get the email address of the user
  //2)Check is the email address exists in the database
  //3)Generate a random token not a jwt and send to the user

  const userExist = await user.findOne({ email : req.body.email });
  console.log(userExist);
  if(!userExist)
    return next(new AppError('The user with this email does not exist!', 404));
  const resetToken = userExist.createResetToken();
  await userExist.save({'validateBeforeSave' : false});

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a patch request with your new password and passwordConfirm to ${resetURL}. If you did not forget your password ignore the email!`;
  try{
    await sendEmail({
      email : userExist.email,
      subject : 'Your password reset token (valid for 10 mins)',
      message
    })
  
    res.status(200).json({
      status : "success",
      message : 'The link to reset password is sent to your mail!'
    })
  }catch(err){
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresIn = undefined;

    await userExist.save({'validateBeforeSave' : false});

    return next(new AppError('There was an error sending the mail!', 500));
  }

})

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1)The user will receive a token which he will send along with the new password
  console.log(req.params.token);
  const encryptToken = crypto
  .createHash('sha256')
  .update(req.params.token)
  .digest('hex');
  const userExist = await user.findOne({ resetPasswordToken : encryptToken ,
    resetPasswordTokenExpiresIn : {$gt : Date.now()}});
  if(!userExist)
    return next(new AppError("Token is invalid or has expired!", 400));

  userExist.password = req.body.password;
  userExist.passwordConfirm = req.body.passwordConfirm;
  userExist.resetPasswordToken = undefined;
  userExist.resetPasswordTokenExpiresIn = undefined;
  userExist.save();
  createSendToken(userExist, 200, res);
})

exports.updatePassword = catchAsync(async (req, res, next) => {

  const userExist = await user.findById(req.user.id).select('+password');
  //console.log(userExist);
  if(!userExist)
    return next(new AppError('The user does not exist any longer!', 401));
  console.log(userExist);
  if(!await userExist.isPasswordCorrect(req.body.currentPassword, userExist.password))
    return next(new AppError('The currentPassword is wrong!'));
  userExist.password = req.body.password;
  userExist.passwordConfirm = req.body.passwordConfirm;
  await userExist.save();
  createSendToken(userExist, 200, res);

})