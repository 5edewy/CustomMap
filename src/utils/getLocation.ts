import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import Geolocation, {
  GeoPosition,
  GeoError,
} from 'react-native-geolocation-service';
import {renderError} from '../config/theme';

// Function to open the app settings
const openSetting = (): void => {
  Linking.openSettings().catch(() => {
    renderError('Unable to open settings');
  });
};

// Function to handle iOS location permission request
const hasPermissionIOS = async (): Promise<boolean> => {
  const status = await Geolocation.requestAuthorization('whenInUse');

  if (status === 'granted') {
    return true;
  }

  if (status === 'denied') {
    Alert.alert(
      `Allow Location permission to allow "App" to determine your location.`,
      '',
      [
        {text: 'Go to Settings', onPress: openSetting},
        {text: "Don't Use Location", onPress: () => {}},
      ],
    );
  }

  if (status === 'disabled') {
    Alert.alert(
      `Turn on Location Services to allow "App" to determine your location.`,
      '',
      [
        {text: 'Go to Settings', onPress: openSetting},
        {text: "Don't Use Location", onPress: () => {}},
      ],
    );
  }

  return false;
};

// Main function to check location permission
export const hasLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    const hasPermission = await hasPermissionIOS();
    return hasPermission;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    renderError('Location permission denied by user.');
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    renderError('Location permission revoked by user.');
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  } else {
    Alert.alert(
      `Turn on Location Services to allow "App" to determine your location.`,
      '',
      [
        {text: 'Go to Settings', onPress: openSetting},
        {text: "Don't Use Location", onPress: () => {}},
      ],
    );
  }

  return false;
};

// Function to get the current location
export const getLocation = async (): Promise<
  {latitude: number; longitude: number} | false
> => {
  const hasPermission = await hasLocationPermission();

  if (!hasPermission) {
    return false;
  }

  const getCoords = async (): Promise<GeoPosition | false> => {
    const pos = new Promise<GeoPosition>((resolve, reject) => {
      Geolocation.getCurrentPosition(resolve, reject, {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
        showLocationDialog: true,
      });
    });
    return pos
      .then(respo => respo)
      .catch((error: GeoError) => {
        renderError(error.message);
        return false;
      });
  };

  const coords = await getCoords();
  return coords
    ? {latitude: coords.coords.latitude, longitude: coords.coords.longitude}
    : false;
};
