const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review.js')
const user = require('./users.js');

const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    filename: String,
    url: String,
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: Review
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: user
  }
})

listingSchema.post("findByIdAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.review } })
  }
})

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;