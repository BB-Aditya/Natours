const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'not found',
      message: 'Invalid Id.',
    });
  }

  next();
};

exports.checkBody = (req, res, next) => {
  const tourCheck = req.body;
  const checkName = tourCheck.name;
  const checkPrice = tourCheck.price;

  if (!checkName || !checkPrice) {
    return res.status(404).json({
      status: 'Invalid data',
      message: "It doesn't contain name and price attribute!",
    });
  }

  next();
};

exports.getTours = (req, res) => {
  res.status(200).send({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  // eslint-disable-next-line prefer-object-spread
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    // eslint-disable-next-line no-unused-vars
    (err) => {
      res.status(201).send({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  const patchId = req.params.id * 1;
  const updateTour = tours.find((el) => el.id === patchId);
  if (!updateTour) {
    res.status(404).json({
      status: 'Not found',
      message: ' Invalid id',
    });
  } else {
    res.status(201).json({
      status: 'succesful',
      message: 'updated succesfully',
    });
  }
};

exports.getSingleTour = (req, res) => {
  const { id } = req.params;
  const singleTour = tours.find((el) => el.id === id);
  if (!singleTour) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  } else {
    res.status(200).send({
      status: 'success',
      data: { singleTour },
    });
  }
};
