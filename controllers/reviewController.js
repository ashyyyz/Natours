const review = require('./../models/review');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/APIFeatures');
const handler = require('./factoryHandler');
const catchAsync = fn => {
    return(req, res, next) => {
      fn(req, res, next).catch(err => next(err))
    }
}


 
exports.getAllReviews = handler.readAll(review);
// catchAsync( async (req, res, next) => {
//   let filter = {};
//   if(req.params.tourId)
//     filter = { tour : req.params.tourId};
//   const features = new APIFeatures(review.find(filter), req.query)
//   .filter()
//   .sort()
//   .limitingfields()
//   .paginate()
//   const reviews = await features.query;
//   res.status(200).json({
//     status: "success",
//     total : reviews.length,
//     reviews
//   })
// })

exports.setBodyIds = (req, res, next) => {
  if(!req.body.tour)
    req.body.tour = req.params.tourId;
  if(!req.body.user)
    req.body.user = req.user.id;
  next();
}

exports.addReview = handler.createOne(review);

exports.getReview = handler.readOne(review);

// catchAsync( async (req, res, next) => {
//   const reviewFound = await review.findById(req.params.id);
//   if(!reviewFound)
//     return next(new AppError('The review does not exist on this Id', 404));
//   res.status(200).json({
//     status: "success",
//     review : reviewFound
//   })
// })

exports.updateReview = handler.updateOne(review);
// catchAsync( async (req, res, next) => {
//   const reviewUpdated = await review.findByIdAndUpdate(req.params.id, req.body, {
//     new : true,
//     runValidators : true
//   })
//   if(!reviewUpdated)
//     return next(new AppError('There is no review on this id', 404))
//   res.status(200).json({
//     status: "success",
//     review : reviewUpdated
//   })
// })

exports.deleteReview = handler.deleteOne(review);
// catchAsync( async (req, res, next) => {
//   const delReview = await review.findByIdAndDelete(req.params.id);
//   if(!delReview)
//     return next(new AppError('There exists no review on this Id', 404));
//   res.status(200).json({
//     status: "success",
//     delReview
//   })
// })
