const express = require('express')
const router = express.Router({ mergeParams: true })
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js')
const { listingSchema } = require('../schema.js');
const Listing = require('../models/listing.js')


const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) { // Fixed the variable name from 'err' to 'error'
    let errMsg = error.details.map((el) => el.message).join(",")
    throw new ExpressError(400, errMsg)
  } else {
    next()
  }
}



router.get('/', async (req, res) => {
  const data = await Listing.find({})
  console.log(data)
  res.render('index.ejs', { data })
})

// new route

router.get('/new', (req, res) => {
  res.render("create.ejs")
})

// show route

router.get('/:id', async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews")
  res.render('show.ejs', { listing })
})

// create route

router.post('/', validateListing, wrapAsync(async (req, res, next) => {
  // let {title, description, price, location, country} = req.body
  try {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing")
  } catch (err) {
    next(err)
  }
}))

// Edit route

router.get('/:id/edit', async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
  res.render('edit.ejs', { listing })
})

// Update route

router.put('/:id', async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing })
  res.redirect('/listing')
})


// Delete route 

router.delete('/:id', async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listing')
})

module.exports = router;