const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router.param('id', tourController.checkId);
router
  .route('/')
  .get(tourController.getTours)
  .post(tourController.checkBody, tourController.createTour);
router
  .route('/:id?')
  .patch(tourController.updateTour)
  .get(tourController.getSingleTour);

module.exports = router;
