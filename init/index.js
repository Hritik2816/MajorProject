const mongoose = require('mongoose')
const Listing = require('../models/listing.js')
const initData = require('./data.js')


main()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const init = async () => {
  await Listing.deleteMany({})
  initData.data = initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67f8c8c6e23d29737e24a4f1"
  }))
  await Listing.insertMany(initData.data)
  console.log("Data inserted")
}

init();