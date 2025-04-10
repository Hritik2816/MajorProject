const express = require('express')
const router = express.Router({ mergeParams: true })
const Review = require('../models/review.js')
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js')
const Listing = require('../models/listing.js')
const { reviewSchema } = require('../schema.js');


const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


// Reviews route
//Post review route 

router.post('/', validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id)
  let newReview = new Review(req.body.review)

  listing.reviews.push(newReview)

  await newReview.save()
  await listing.save()

  // console.log("New review save");
  // res.send("New review send")

  res.redirect(`/listing/${listing._id}`)
}))


// delete review route 
router.delete('/:reviewId', wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params; // Fixed destructuring of req.params

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listing/${id}`); // Fixed the redirect URL
}))

module.exports = router;