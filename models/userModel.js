const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');//for encrypting the password
const crypto = require('crypto');//Inbuilt to encrypt


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        maxlength : 50,
        required : [true, 'Please tell your name!']
    },
    email: {
        type: String, 
        required: [true, "Email can't be blank"], 
        unique: true, 
        lowercase: true, 
        validate : [validator.isEmail, 'Please enter a valid Email']
    },
    photo : String,
    role : {
        type : String,
        enum : ['admin', 'lead-guide', 'guide', 'user'],
        required : true
    },
    password : {
        type : String,
        required: [true, 'Password is required!'],
        minlength: [8, 'The password should be minimum of 8 characters!'],
        select : false
    },
    passwordConfirm : {
        type : String,
        required: [true, 'Confirm Password is required!'],
        minlength: [8, 'The password should be minimum of 8 characters!'],
        validate : {
            //This only works when the user is created 
            validator : function(el){
                return el === this.password;
            },
            message : 'Passwords are not same!'
        }
    },
    passwordChangedAt : {
        type : Date,
        required : true,
        default : new Date()
    },
    resetPasswordToken : String,
    resetPasswordTokenExpiresIn : Date 
})
//Will only work when you create a user
userSchema.pre('save', async function(next){
    //Checking if password is updated
    if(!(this.isModified('password')))
       return next();
    //Encrypting the password
    this.password = await bcrypt.hash(this.password, 14);

    this.passwordConfirm = undefined; 
    if(!this.isNew)
       this.passwordChangedAt = Date.now() - 1000;
    next();
})

//Method on userSchema 

userSchema.methods.isPasswordCorrect = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.isPasswordChanged = function(JWTTimeStamp){
    let passwordChanged;
    if(this.passwordChangedAt)
      passwordChanged = parseInt(
        this.passwordChangedAt.getTime()/1000,
        10);
    console.log(passwordChanged, JWTTimeStamp);
    return JWTTimeStamp < passwordChanged;
}

userSchema.methods.createResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    //this.resetPasswordToken = resetToken;
    this.resetPasswordToken = crypto.createHash('sha256')
               .update(resetToken)
               .digest('hex');
    // crypto
    // .createHash('sha26')
    // .update(resetToken)
    // .digest('hex');
    console.log({resetToken}, this.resetPasswordToken);
    this.resetPasswordTokenExpiresIn = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

const user = mongoose.model('User',userSchema);

module.exports = user;