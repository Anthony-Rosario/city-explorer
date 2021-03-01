function formatLocation(someData) {
  return {
    formatted_query: someData[0].display_name,
    latitude: someData[0].lat,
    longitude: someData[0].lon,
  };
}

function mungeWeather(weatherData) {
  const formattedResponse = weatherData.data.map(item => {
    return {
      forecast: item.weather.description,
      time: new Date(item.ts * 1000).toDateString(),
    };
  });
  const finalResponse = formattedResponse.slice(0, 7);
  return finalResponse;
}


function mungeYelpReviews(reviews) {
  return reviews.businesses.map(item => {
    return {
      name: item.name,
      image: item.image_url,
      price: item.price,
      rating: item.rating,
      url: item.url
    };
  })
    .slice(0, 20);
}

module.exports = {
  formatLocation,
  mungeWeather, 
  mungeYelpReviews
};