const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany({});
  for(let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      // YOUR USER ID
      author: '62cebad0ed011f279c2ce3b5',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit qui, adipisci molestiae accusantium explicabo tenetur illum blanditiis tempora saepe sequi, dolor exercitationem dolorum quibusdam fugit nisi amet nihil eaque sed.',
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude
        ]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/divdtyvpi/image/upload/v1658821033/YelpCamp/ias1jf4kggbsiicxweul.jpg',
          filename: 'YelpCamp/ias1jf4kggbsiicxweul'
        },
        {
          url: 'https://res.cloudinary.com/divdtyvpi/image/upload/v1658820821/YelpCamp/lxrbuge9idlmlntnbcga.jpg',
          filename: 'YelpCamp/lxrbuge9idlmlntnbcga'
        }
      ]
    })
    await camp.save();
  }
  // const c = new Campground({ title: 'purple field' });
  // await c.save();
}
seedDB().then(() => {
  mongoose.connection.close();
})