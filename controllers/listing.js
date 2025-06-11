const Listing = require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const { category } = req.query;
  let filter = {};
  if (category) {
    filter.categories = category;
  }
  const data = await Listing.find(filter);
  res.render("index", { data });
};

module.exports.renderNewForm = (req, res) => {
  res.render("create.ejs")
}

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("owner").populate({
    path: 'reviews',
    populate: { path: 'author' }
  });

  // Safe check for geometry and coordinates
  let coordinates = (listing.geometry && listing.geometry.coordinates && listing.geometry.coordinates.length)
    ? listing.geometry.coordinates
    : [77.2088, 28.6139]; // fallback coordinates

  res.render('show.ejs', { listing, coordinates });
}

module.exports.create = async (req, res, next) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send()

  let url = req.file.path;
  let filename = req.file.filename

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;


  let saveListing = await newListing.save();
  console.log(saveListing);
  req.flash("success", "New Listing Created")
  res.redirect("/listing")
}

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render('edit.ejs', { listing });
}

module.exports.update = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })
  if (req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename
    listing.image = { url, filename };
    await listing.save()
  }
  req.flash("success", "Listing update");
  res.redirect('/listing')
}

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listing')
}