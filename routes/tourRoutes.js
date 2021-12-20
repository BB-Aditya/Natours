const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require(`../controllers/authController`);

const router = express.Router();

// router.param('id', tourController.checkId);
router.route('/get-monthly-plan/:year').get(tourController.monthlyPlan);
router.route('/tour-stats').get(tourController.getStats);

router
  .route('/top-5-cheap')
  .get(tourController.setFields, tourController.getTours);

router
  .route('/')
  .get(authController.protect, tourController.getTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .patch(tourController.updateTour)
  .get(tourController.getSingleTour)
  .delete(tourController.deleteTour);

module.exports = router;
