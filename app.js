const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError.js')

const listing = require('./routes/listing.js')
const review = require('./routes/review.js')

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




app.use("/listing", listing)
app.use("/listing/:id/review", review);


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