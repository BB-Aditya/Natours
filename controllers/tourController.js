const AppError = require('../utils/appError');

const Tour = require(`../models/tourModel.js`);
const APIFeatures = require(`../utils/apiFeatures`);
//  const tours = JSON.parse(
//  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
//  );

// exports.checkId = (req, res, next, val) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'not found',
//       message: 'Invalid Id.',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   const tourCheck = req.body;
//   const checkName = tourCheck.name;
//   const checkPrice = tourCheck.price;

//   if (!checkName || !checkPrice) {
//     return res.status(404).json({
//       status: 'Invalid data',
//       message: "It doesn't contain name and price attribute!",
//     });
//   }
//   next();
// };

exports.setFields = (req, res, next) => {
  req.query.limit = '5';
  req.query.fields = 'name,price,ratingsAverage,duration,summary';
  req.query.sort = '-ratingsAverage,price';
  next();
};

// eslint-disable-next-line arrow-body-style
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

exports.getTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitField()
    .pagination();

  const allTours = await features.query;

  res.status(200).send({
    status: 'success',
    length: allTours.length,
    data: { allTours },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const insertedTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: insertedTour,
  });
});
//  const newId = tours[tours.length - 1].id + 1;
//  eslint-disable-next-line prefer-object-spread
//  const newTour = Object.assign({ id: newId }, req.body);

//  tours.push(newTour);
//  fs.writeFile(
//  `${__dirname}/dev-data/data/tours-simple.json`,
//  JSON.stringify(tours),
//  // eslint-disable-next-line no-unused-vars
//  (err) => {
//  res.status(201).send({
//     status: 'success',
//       data: {
//         tours: newTour,
// },
// });
// }
// );

exports.updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true.valueOf,
    runValidators: true,
  });

  if (!updatedTour) {
    next(new AppError(`can't find with that id`), 404);
  }

  res.status(201).json({
    status: 'success',
    modified: updatedTour,
  });
});

// const patchId = req.params.id * 1;
// const updateTour = tours.find((el) => el.id === patchId);
// if (!updateTour) {
//   res.status(404).json({
//     status: 'Not found',
//     message: ' Invalid id',
//   });
// } else {
//   res.status(201).json({
//     status: 'succesful',
//     message: 'updated succesfully',
//   });
// }
exports.getSingleTour = catchAsync(async (req, res, next) => {
  const singleTour = await Tour.findById(req.params.id);

  if (!singleTour) {
    next(new AppError(`can't find with that id`), 404);
  }
  res.status(200).json({
    status: 'succesful',
    tour: { singleTour },
  });
});

// const { id } = req.params;
// const singleTour = tours.find((el) => el.id === id);
// if (!singleTour) {
//   res.status(404).json({
//     status: 'fail',
//     message: 'Invalid Id',
//   });
// } else {
//   res.status(200).send({
//     status: 'success',
//     data: { singleTour },
//   });
// }

exports.deleteTour = catchAsync(async (req, res, next) => {
  const deletedTour = await Tour.findByIdAndDelete(req.params.id);

  if (!deletedTour) {
    next(new AppError(`can't find with that id`), 404);
  }
  res.status(200).json({
    status: 'success',
    message: 'Deleted',
  });
});

// const testTour = new Tour({
//   name: "Hello",
// });

// testTour.save().then(doc => {
//    console.log(doc);
// }).catch(err => {
//   console.log("Error**:",err);
// });

exports.getStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        totalRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        tours: { $push: '$name' },
      },
    },
    //   {
    //   $sort:{$price}
    //   }
    // ,
  ]);

  res.status(200).json({
    status: 'success',
    stats: { stats },
  });
});

exports.monthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const monthlyPlan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-12`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $sort: { numOfTours: -1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { monthlyPlan },
  });
});
