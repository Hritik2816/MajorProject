const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Listing = require('./models/listing.js')
const path = require('path')
const methodOverride = require('method-override')


app.set('view engine', "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


main()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


app.get('/', (req, res) => {
  res.send('Hello World')
})

// index route

app.get('/listing', async (req, res) => {
  const data = await Listing.find({})
  console.log(data)
  res.render('index.ejs', { data })
})

// new route

app.get('/listing/new', (req, res) => {
  res.render("create.ejs")
})

// show route

app.get('/listing/:id', async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  res.render('show.ejs', { listing })
})

// create route

app.post('/listing', async (req, res) => {
  // let {title, description, price, location, country} = req.body
  let newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listing")
})

// Edit route

app.get('/listing/:id/edit', async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
  res.render('edit.ejs', { listing })
})

// Update route

app.put('/listing/:id', async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing })
  res.redirect('/listing')
})


// Delete route 

app.delete('/listing/:id', async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listing')
})

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

app.listen(8080, () => {
  console.log('Server is running on port 8080');
})