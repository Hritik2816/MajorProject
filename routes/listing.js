const express = require('express')
const router = express.Router({ mergeParams: true })
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js')
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js')


router.get('/', async (req, res) => {
  const data = await Listing.find({})
  console.log(data)
  res.render('index.ejs', { data })
})

// new route

router.get('/new', isLoggedIn, (req, res) => {
  res.render("create.ejs")
})

// show route

router.get('/:id', async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews").populate("owner");
  res.render('show.ejs', { listing })
})

// create route

router.post('/', isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
  // let {title, description, price, location, country} = req.body
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id
  await newListing.save();
  req.flash("success", "New Listing Created")
  res.redirect("/listing")
  next(err)
}))

// Edit route

router.get('/:id/edit', isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render('edit.ejs', { listing });
});

// Update route

router.put('/:id', isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing })
  res.redirect('/listing')
})

// Delete route 

router.delete('/:id', isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listing')
})

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

module.exports = router;