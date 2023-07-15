const fs = require('fs');
const tour = require('../models/tourModel');
const express = require('express');
const APIFeatures = require('../utils/APIFeatures')
const AppError = require('./../utils/appError');
const handler = require('./factoryHandler');
//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


//2)ROUTE HANDLERS
//GET tours 
exports.setQuery = (req,res,next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,difficulty,ratingsAverage,summary';
    next();
}

// exports.checkId = (req,res,next,val) => {
//     if(val >= tours.length)
//     {
//         return res
//         .status(404)
//         .json({
//             "status" : "fail",
//             "message" : "Invalid ID"
//         })
//     }
//     next();
// }

// exports.checkBody = (req,res,next) => {
//     if(!req.body.name || !req.body.price)
//     {
//         return res
//         .status(400)
//         .json({
//             status : "Invalid data",
//             message : "Name or Price is missing in the body"
//         })
//     }
//     next();
// }

const catchAsync = fn => {
  return(req, res, next) => {
    fn(req, res, next).catch(err => next(err))
  }
}

exports.getAllTours = handler.readAll(tour);
// catchAsync(async (req, res, next) => {

//   const features = new APIFeatures(tour.find(), req.query)
//         .filter()
//         .sort()
//         .limitingfields()
//         const tours = await features.query;
//         res
//           .status(200)
//           .json({
//             "status" : "success",
//             "responses" : tours.length,
//             "data" : tours
//           })
// })
        //1)Filtering
    //     let queryObj = {...req.query}; // {...req.query} this helps to dereference the req.query to be refered by queryObj so the changes made in queryObj will not be reflected in req.query

    //     const excludedFields = ['sort', 'fields', 'limit', 'page'];
    //     excludedFields.forEach(el => delete queryObj[el]);
    //     console.log(queryObj,req.query);
    //     //1B)Advanced Filtering
    //     queryObj = JSON.stringify(queryObj);
    //     queryObj = queryObj.replace(/\b(gt|gte|lt|lte)\b/g , match => `$${match}`);
    //     queryObj = JSON.parse(queryObj);

    //     console.log(queryObj);

    //    //2)Sorting
    //     let query =  tour.find(queryObj)
    //     if(req.query.sort)
    //     {
    //         const sortBy = req.query.sort.split(',').join(' ');
    //         query = query.sort(sortBy);
    //     }
    //     //And if you wish to sort in descending order then write -price in the route path

    //     //3)Limiting Fields
    //     if(req.query.fields){
    //         const fields = req.query.fields.split(',').join(' ');
    //         query = query.select(fields);
    //     }else{
    //         query = query.select('-__v');
    //         //This - helps to deselect the field.
    //     }

    //     //4)Pagination
    //     if(req.query.page || req.query.limit)
    //     {
    //         const page = req.query.page || 1;
    //         const limit = req.query.limit || 10;
    //         const skip = (page - 1) * limit;
    //         query = query.skip(skip).limit(limit);

    //     }


//GET a tour
exports.getATour = handler.readOne(tour, { path : 'reviews'});
// catchAsync(async (req, res, next) => {

//   const reqTour = await tour.findById(req.params.id).populate('reviews');
//   if(!reqTour)
//     return next(new AppError('No tour can be found on the given ID', 404));

//   res
//     .status(200)
//     .json({
//       "status" : "success",
//       "data" : reqTour
//     })
//     // const id = req.params.id * 1;
//     // const tour = tours.find(el => {
//     //     return el.id === id}
//     // )
//     //if(id >= tours.length)
// })

//POST tours - Add a new tour 
exports.addATour = handler.createOne(tour);


    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({id : newId},req.body);
    // tours.push(newTour);
    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,
    // JSON.stringify(tours), 
    // err => {
    //     res
    //     .status(201)
    //     .send("Added the tour!");
    // })

//DELETE A Tour
exports.deleteATour = handler.deleteOne(tour);
// catchAsync( async (req, res, next) => {
//   const delTour = await tour.findByIdAndDelete(req.params.id)
//   if(!delTour)
//     return next(new AppError('No tour can be found on the given ID', 404));
//   res
//     .status(201)
//     .json({
//       message : "Deleted the tour!",
//       deletedTour : delTour
//     });
    // const id = req.params.id * 1;
    
    // const index = tours.findIndex((el) => (el.id === id));
    // console.log(index);
    // tours.splice(index,1);
    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,
    // JSON.stringify(tours), 
    // err => {
    //     res
    //     .status(201)
    //     .send("Deleted the tour!");
    // })
//})

//UPDATE A Tour
exports.updateATour = handler.updateOne(tour);
    // const id = req.params.id * 1;
    // const data = req.body;

    // const index = tours.findIndex((el) => (el.id === id));
    // let upTour = tours.find((el) => (el.id === id));
    // for(let x in data)
    // {
    //     upTour[x] = data[x];
    // }
    // tours.splice(index,1,upTour);
    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,
    // JSON.stringify(tours), 
    // err => {
    //     res
    //     .status(201)
    //     .send("Updated the tour!");
    // })
