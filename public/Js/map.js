mapboxgl.accessToken = mapToken;

// console.log(coordinates);

const map = new mapboxgl.Map({
  container: 'map', // container ID
  center: coordinates,
  zoom: 9 // starting zoom
});



const marker1 = new mapboxgl.Marker()
  .setLngLat(coordinates)
  .addTo(map);