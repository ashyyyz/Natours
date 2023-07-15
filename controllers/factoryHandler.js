const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/APIFeatures');

const catchAsync = fn => {
    return(req, res, next) => {
      fn(req, res, next).catch(err => next(err))
    }
  }

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const upddoc =await Model.findByIdAndUpdate(req.params.id, req.body, {
      new : true,
      runValidators : true
    })
    if(!upddoc)
      return next(new AppError('No document can be found on the given ID', 404));
    res
      .status(201)
      .json({
        message : "Updated the document",
        updateddocument : upddoc
      }) 
    })

exports.createOne = Model => catchAsync(async (req, res, next) => {

    const doc = await Model.create(req.body);
    res
      .status(201)
      .json({
        message:"Added!",
        data : {
         data : doc
      }})
  })


exports.readAll = Model => catchAsync(async (req, res, next) => {
  let filter = {};
  if(req.params.tourId)
    filter = { tour : req.params.tourId};
  const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitingfields()
        .paginate()
        const docs = await features.query;
        res
          .status(200)
          .json({
            "status" : "success",
            "responses" : docs.length,
            "data" : docs
          })
})

exports.readOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
  const query = Model.findById(req.params.id);
  if(popOptions)
    query = query.populate(popOptions);
  const doc = await query;
  if(!doc)
    return next(new AppError('No document can be found on the given ID', 404));

  res
    .status(200)
    .json({
      "status" : "success",
      "data" : doc
    })
})

exports.deleteOne = Model => catchAsync( async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if(!doc)
      return next(new AppError('No document can be found on the given ID', 404));
    res
      .status(201)
      .json({
        message : "Deleted the document",
        deletedTour : doc
      })
})

