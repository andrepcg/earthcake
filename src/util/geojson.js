
export function convertToGeoJson(data){
  const emptyGeojson = {
    type: "FeatureCollection",
    features: []
  };

  emptyGeojson.features = data.map((event) => ({
    type: "Feature",
    properties: {
      ...event
    },
    geometry: {
      type: "Point",
      coordinates: event.geometry.coordinates
    }
  }));

  return emptyGeojson;
}
