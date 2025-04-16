const Listing = require("../models/listing.js")

module.exports.index = async (req, res) => {
  const data = await Listing.find({})
  console.log(data)
  res.render('index.ejs', { data })
}

module.exports.renderNewForm = (req, res) => {
  res.render("create.ejs")
}

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({
    path: "reviews", populate: {
      path: "author"
    }
  }).populate("owner");
  res.render('show.ejs', { listing })
}

module.exports.create = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created")
  res.redirect("/listing")
  next(err)
}

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render('edit.ejs', { listing });
}

module.exports.update = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing })
  res.redirect('/listing')
}

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listing')
}