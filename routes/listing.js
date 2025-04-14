const express = require('express')
const router = express.Router({ mergeParams: true })
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js')
const Review = require('../models/review.js');
const { isLoggedIn, isOwner, validateListing, validateReview } = require('../middleware.js')


const listingController = require("../controllers/listing.js")

router.get('/', wrapAsync(listingController.index));

// new route

router.get('/new', isLoggedIn, listingController.renderNewForm)

// show route

router.get('/:id', wrapAsync(listingController.show))

// create route

router.post('/', isLoggedIn, validateListing, wrapAsync(listingController.create))

// Edit route

router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.edit));

// Update route

router.put('/:id', isLoggedIn, isOwner, wrapAsync(listingController.update))

// Delete route 

router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listingController.delete))

router.get('/:id/reviews/:reviewId', async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    const error = new Error('Page not found');
    error.status = 404;
    return next(error);
  }
  res.render('review.ejs', { review });
});

router.post('/:id/reviews', isLoggedIn, validateReview, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listing');
  }

  const review = new Review(req.body.review);
  review.author = req.user._id;
  listing.reviews.push(review);
  await review.save();
  await listing.save();

  req.flash('success', 'Review added successfully');
  res.redirect(`/listing/${listing._id}`);
}));

module.exports = router;