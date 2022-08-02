const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const { cloudinary } = require('../cloudinary');

// https://res.cloudinary.com/divdtyvpi/image/upload/w_100/v1658740276/YelpCamp/srtmbu5ldhstcfnftxig.jpg

const ImageSchema = new Schema({
  url: String,
  filename: String
  
})

// We use virtual in this because we don't need to store this on our model or database,
ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
  return `<a href=/campgrounds/${this._id}>${this.title}</a>`;
});

// this is a query middleware
CampgroundSchema.post('findOneAndDelete', async function(
  campground
) {
  if (campground.reviews) {
    await Review.deleteMany({
      _id : { $in: campground.reviews }
    });
  }
  if (campground.images) {
    for (const img of campground.images) {
      await cloudinary.uploader.destroy(img.filename);
    }
  }
});

module.exports = mongoose.model('Campground', CampgroundSchema);