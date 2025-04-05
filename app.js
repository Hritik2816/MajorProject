const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Listing = require('./models/listing.js')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError.js')
const Review = require('./models/review.js')
const { listingSchema, reviewSchema } = require('./schema.js');
const wrapAsync = require('./utils/wrapAsync.js');

const listing = require('./routes/listing.js')

app.set('view engine', "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

main()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


app.get('/', (req, res) => {
  res.send('Hello World')
})

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


app.use("/listing", listing)


// Reviews route
//Post review route 

app.post('/listing/:id/reviews', validateReview, wrapAsync(async (req, res) => {
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
app.delete('/listing/:id/review/:reviewId', wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId)

  res.redirect(`/listing/${id}`)

}))

// app.get('/testListing', async (req, res) => {
//   let sampleListing = new Listing({
//     title: "This is beautiful palace in India",
//     description: "This is a sample listing",
//     price: 10000,
//     location: "Goa Beach",
//     country: "India"
//   })
//   await sampleListing.save()
//   console.log(sampleListing)
//   res.send("Listing created")
// })


//Error handle

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"))
})


app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { statusCode, message });
});


app.listen(8080, () => {
  console.log('Server is running on port 8080');
})