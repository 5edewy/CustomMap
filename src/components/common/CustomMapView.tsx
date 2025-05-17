import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Region} from 'react-native-maps';
import {colors, images, scale, sw} from '../../config/theme';
import {AppTextInput} from '../common/AppTextInput';
import {VectorIcon} from './VectorIcon';
import {
  getLocation,
  getLocationByPlaceId,
  locationDetails,
  searchPlaces,
} from '../../utils';
import styles from '../assets/styles/styles';
import {useSearchStore} from '../../store';
import {MapList} from './MapList';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.15;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

interface CustomMapViewProps {
  latitude?: number | null;
  longitude?: number | null;
  updateLocation: (location: {latitude: number; longitude: number}) => void;
}

const CustomMapView = memo<CustomMapViewProps>(function CustomMapView({
  latitude = null,
  longitude = null,

  updateLocation = () => null,
}) {
  const mapRef = useRef<MapView | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState<boolean>(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: latitude ?? 24.466667,
    longitude: longitude ?? 54.366669,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [search, setSearch] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [location, setLocation] = useState<any | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const lastTapRef = useRef(0);

  const addLocationToHistory = useSearchStore(
    state => state.addSearchHistoryItem,
  );
  const savedLocations = useSearchStore(state => state.searchHistory);
  const clearSearchHistory = useSearchStore(state => state.clearSearchHistory);

  useEffect(() => {
    if (latitude && longitude && !isUserInteracting) {
      setRegion({
        ...region,
        latitude,
        longitude,
      });
      fitToMap({latitude, longitude});
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (!latitude && !longitude) {
      getUserLocation();
    }
  }, [latitude, longitude]);

  const changeCurrent = useCallback(
    ({latitude, longitude, longitudeDelta, latitudeDelta}: Region) => {
      if (!isUserInteracting) {
        setRegion({latitude, longitude, longitudeDelta, latitudeDelta});
        updateLocation({latitude, longitude});
      }
    },
    [updateLocation, isUserInteracting],
  );

  const getUserLocation = useCallback(async () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) return;
    lastTapRef.current = now;

    setIsFetchingLocation(true);
    try {
      const location = await getLocation();
      if (location) {
        setRegion({
          ...region,
          latitude: location.latitude,
          longitude: location.longitude,
        });
        updateLocation(location);
        fitToMap(location);

        // Get address for current location
        const addressDetails = await locationDetails(
          location.latitude,
          location.longitude,
        );
        if (addressDetails?.formatted_address) {
          setSearch(addressDetails.formatted_address);
        }
      } else {
        console.warn("Couldn't fetch user location");
        // Optionally show error to user
      }
    } catch (error) {
      console.error('Error getting location:', error);
      // Optionally show error to user
    } finally {
      setIsFetchingLocation(false);
    }
  }, [region, updateLocation]);
  const fitToMap = ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    if (mapRef.current) {
      mapRef.current.animateCamera({
        center: {latitude, longitude},
        pitch: 0,
        heading: 0,
        altitude: 1000,
        zoom: 16,
      });
    }
  };

  const autocomplete = useCallback(async (value: string) => {
    setSearch(value);
    if (value?.length > 3) {
      const timeoutId = setTimeout(async () => {
        const res = await searchPlaces(value);
        if (res) {
          setResults(res);
        }
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  const selectLocation = useCallback(
    async (value: {place_id: string; description: string}) => {
      Keyboard.dismiss();
      const location = await getLocationByPlaceId(value.place_id);
      if (location?.geometry) {
        setLocation(location);
        const {lat, lng} = location.geometry.location || {};
        fitToMap({latitude: lat, longitude: lng});
        setResults([]);
        updateLocation({latitude: lat, longitude: lng});

        addLocationToHistory({
          place_id: value.place_id,
          description: value.description || '',
          latitude: lat,
          longitude: lng,
        });
      }
    },
    [updateLocation],
  );

  return (
    <View style={[StyleSheet.absoluteFill, {justifyContent: 'center'}]}>
      <View style={styles.inputMapHolder}>
        <AppTextInput
          onChangeText={autocomplete}
          autoFocus={false}
          value={search}
          placeholder={'Search ...'}
          appearIndicator={false}
          onSubmit={() => null}
          onFocus={() => {
            setInputFocused(true), setSearch('');
          }}
          onBlur={() => setInputFocused(false)}
          appearIcon={true}
          iconInput={images.search}
          styleInput={{
            backgroundColor: colors.whiteSmokeF6,
            borderColor: search.length >= 3 ? colors.primary : colors.gray,
          }}
        />
      </View>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{flex: 1}}
        loadingEnabled
        loadingBackgroundColor="white"
        initialRegion={region}
        onMapReady={() => {
          if (!latitude && !longitude) {
            getUserLocation();
          }
        }}
        onRegionChange={() => setIsUserInteracting(true)}
        onRegionChangeComplete={async (newRegion: Region) => {
          setIsUserInteracting(false);
          changeCurrent(newRegion);
          if (
            Math.abs(newRegion.latitude - region.latitude) > 0.0001 ||
            Math.abs(newRegion.longitude - region.longitude) > 0.0001
          ) {
            setRegion(newRegion);
            updateLocation({
              latitude: newRegion.latitude,
              longitude: newRegion.longitude,
            });

            const addressDetails = await locationDetails(
              newRegion.latitude,
              newRegion.longitude,
            );

            if (addressDetails?.formatted_address) {
              setSearch(addressDetails.formatted_address);
            }
          }
        }}
      />

      <View style={styles.mapPin}>
        <VectorIcon
          name="map-marker-alt"
          type="Fontisto"
          color="red"
          size={scale(23)}
        />
      </View>

      <TouchableWithoutFeedback
        disabled={isFetchingLocation}
        onPress={getUserLocation}>
        <View style={styles.getLocationButton}>
          {isFetchingLocation ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <VectorIcon
              name="crosshairs-gps"
              type="MaterialCommunityIcons"
              size={scale(16)}
              color="gray"
            />
          )}
        </View>
      </TouchableWithoutFeedback>

      {inputFocused && search.length === 0 && savedLocations.length > 0 && (
        <MapList
          onPressClear={clearSearchHistory}
          showRecentTag={true}
          dataArr={savedLocations}
          onPress={item =>
            selectLocation({
              place_id: item.place_id,
              description: item.description,
            })
          }
        />
      )}

      {results?.length > 0 && (
        <MapList dataArr={results} onPress={item => selectLocation(item)} />
      )}
    </View>
  );
});

export {CustomMapView};
