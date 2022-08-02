// const campground = require("../../models/campground");

const showCampground = JSON.parse(campgroundConverted);

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: showCampground.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
  // projection: 'globe' // display the map as a 3D globe
});
map.on('style.load', () => {
  map.setFog({}); // Set the default atmosphere style
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(showCampground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(
        `<h3>${showCampground.title}</h3><p>${showCampground.location}</p>`
      )
  )
  .addTo(map)