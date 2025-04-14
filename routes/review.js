const express = require('express')
const router = express.Router()
const Review = require('../models/review.js')
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

// Reviews route
//Post review route 

router.post('/', isLoggedIn, validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  req.flash('success', 'Review added successfully');
  res.redirect(`/listing/${listing._id}`);
}))

// delete review route 
router.delete('/:id/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  console.log()

  req.flash('success', 'Review deleted successfully');
  res.redirect(`/listing/${id}`); // Redirect to the listing page
}))

module.exports = router;