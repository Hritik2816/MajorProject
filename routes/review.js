const express = require('express')
const router = express.Router({ mergeParams: true })
const Review = require('../models/review.js')
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js')
const { validateReview } = require('../middleware')

// Reviews route
//Post review route 

router.post('/', validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listing');
  }

  let newReview = new Review(req.body.review);
  if (!newReview || !newReview.content || !newReview.rating) {
    req.flash('error', 'Invalid review data');
    return res.redirect(`/listing/${listing._id}`);
  }

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  req.flash('success', 'Review added successfully');
  res.redirect(`/listing/${listing._id}`);
}))

// delete review route 
router.delete('/:reviewId', wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params; // Fixed destructuring of req.params

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listing/${id}`); // Fixed the redirect URL
}))

module.exports = router;