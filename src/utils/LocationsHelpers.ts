import Config from 'react-native-config';

const GOOGLE_API = Config.GOOGLE_API;

async function getLocationByPlaceId(palceId: any) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${palceId}&key=${GOOGLE_API}`;
  const response = await fetch(url);
  const responseJson = await response.json();
  if (responseJson && responseJson.result && responseJson.status == 'OK') {
    return responseJson.result;
  }
}

async function locationDetails(lat: any, lng: any) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API}`;
  let data = [];
  const response = await fetch(url);
  const responseJson = await response.json();

  if (responseJson && responseJson.results && responseJson.results.length > 0) {
    data = responseJson.results[0];
    if (data) {
      return data;
    }
  }
}

async function searchPlaces(text: any) {
  const type = 'geocode';
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=${type}&key=${GOOGLE_API}`;
  const response = await fetch(url);
  const responseJson = await response.json();

  if (responseJson.status == 'OK') {
    return responseJson.predictions;
  } else {
    return [];
  }
}

export {getLocationByPlaceId, locationDetails, searchPlaces};
