const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review : {
        type : String,
        required : [true, 'The review cannot be empty!'],
    },
    rating:{
        type : Number,
        min:1,
        max:5,
        required : [true, 'The review must have rating']
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    tour : {
        type : mongoose.Schema.ObjectId,
        ref: 'Tour',
        required : [true, 'A review must have a tour']
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : [true, 'A review must be written by a user']
    }

})

reviewSchema.pre(/^find/, function(next){
    // this.populate({
    //    path : 'user',
    //    select : 'name photo'
    // }).populate({
    //     path : 'tour',
    //     select : "name"
    // })

    this.populate({
        path : 'user',
        select : 'name'
     })
    next();
})

const review = mongoose.model('Review', reviewSchema);

module.exports = review;