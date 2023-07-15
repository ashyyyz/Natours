const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name : {
        type: String,
        required : [true, 'A tour must have a name'],
        unique : true,
        minlength : 10,
        maxlength : 25
    },
    duration:{
        type : Number,
        required: true
    },
    maxGroupSize : {
        type : Number,
        required : true
    },
    difficulty : {
        type:String,
        trim:true,
        enum : ['easy', 'medium', 'difficult']
    },
    ratingsAverage : {
        type:Number,
        default :2.0,
        min : 1,
        max : 5
    },
    ratingsQuantity : {
        type:Number,
        default :2.0,
    },
    price : {
        type: Number,
        required : [true, 'A tour must have a price']
    },
    summary : {
        type : String,
        trim : true
    },
    description : {
        type : String,
        trim : true
    },
    imageCover : {
        type : String,
        trim : [true, 'A tour must have imageCover']
    },
    images : [String],
    startDates : [Date],
    startLocation : {
        type : {
            type : String,
            default : 'Point',
            enum : ['Point']
        },
        coordinates : [Number],
        address : String,
        description : String
    },
    locations : [{
        type : {
            type : String,
            default : 'Point',
            enum : ['Point']
        },
        coordinates : [Number],
        address : [String],
        description : String,
        day : Number
    }],
    guides : [
        {
            type : mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
},
{
    toJSON : { virtuals : true},
    toObject : { virtuals : true}
}
)

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
})

// tourSchema.virtual('reviews', {
//     ref : 'Review',
//     foreignField : 'Tour',
//     localField : '_id'
// })
tourSchema.virtual('reviews',{
    ref : 'Review',
    foreignField : 'tour',
    localField : '_id'
})
// tourSchema.pre('save', async function(next){
//     const guides = this.guides.map(async id => await user.findById(id))
//     this.guides = await Promise.all(guides);
//     next();
// })

tourSchema.pre(/^find/, function(next){
    this.populate({
        path : 'guides',
        select : '-__v -passwordChangedAt'
    })
    next();
})
const tour = new mongoose.model('Tour', tourSchema);

module.exports = tour;


