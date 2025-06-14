const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const { postReview, deleteReview } = require('../controllers/review.js');
const wrapAsync = require('../utils/wrapAsync.js');

// Post review route
router.post('/', isLoggedIn, validateReview, wrapAsync(postReview));

// Delete review route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(deleteReview));

module.exports = router;