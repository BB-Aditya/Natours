const mongoose = require('mongoose');
const slugify = require('slugify');
// eslint-disable-next-line import/no-extraneous-dependencies
// const validator = require('validator');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is mandatory'],
      unique: true,
      maxlentgh: [40, 'name should have less than or equal to 40 chars'],
      minlength: [4, 'name should have more than or equal to 4 chars'],
      // validate: [validator.isAlpha,"should be alpha"]
    },

    duration: {
      type: Number,
    },

    description: {
      type: String,
      trim: true,
    },

    ratingsAverage: {
      type: Number,
      min: [1, ' rating must be greater than 1.0'],
      max: [5, ' rating must be lesser than 5.0'],
    },

    ratingsQuantity: {
      type: Number,
    },

    difficulty: {
      type: String,
      trim: true,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty should be easy, medium or difficult',
      },
    },

    maxGroupSize: {
      type: Number,
    },

    price: {
      type: Number,
      required: [true, 'Price is mandatory'],
      default: 4.5,
    },

    priceDiscount: Number,

    summary: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
    },

    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    startDates: [Date],

    slug: String,

    secrecy: {
      type: Boolean,
      deafault: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return (this.duration / 7).toFixed(2);
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.post('save', (doc, next) => {
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.find({ secrecy: { $ne: true } });
  next();
});

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secrecy: { $ne: true } } });
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
