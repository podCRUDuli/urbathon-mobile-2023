import axios from 'axios';
import * as Location from 'expo-location';
import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, YStack } from 'tamagui';

import MyLocationIcon from '../../assets/my-location.svg';
import ZoomInIcon from '../../assets/zoom-in.svg';
import ZoomOutIcon from '../../assets/zoom-out.svg';

const axiosInstance = axios.create({
  baseURL: 'http://176.222.53.146:8080',
});

const AppealsMapPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  const debounceTimeout = useRef(null);
  const [upperLeftCoords, setUpperLeftCoords] = useState(null);
  const [lowerRightCoords, setLowerRightCoords] = useState(null);
  const [markers, setMarkers] = useState([]);
  const initRegion = {
    latitude: 57.16936907227038,
    latitudeDelta: 6.089015297182236,
    longitude: 58.58729838379069,
    longitudeDelta: 6.078331621972126,
  };

  const fetchAppeals = async () => {
    if (upperLeftCoords && lowerRightCoords) {
      try {
        const response = await axiosInstance.get(
          `/api/map/get_map_elements?lat_up=${upperLeftCoords.latitude}&long_up=${upperLeftCoords.longitude}&lat_down=${lowerRightCoords.latitude}&long_down=${lowerRightCoords.longitude}`,
        );
        setMarkers(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchAppeals();
  }, [upperLeftCoords]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        enableHighAccuracy: true,
        timeInterval: 5,
      });
      setUserLocation(location);
    })();
  }, []);

  const handleRegionChange = (region) => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
      const upperLeft = {
        latitude: latitude + latitudeDelta / 2,
        longitude: longitude - longitudeDelta / 2,
      };
      const lowerRight = {
        latitude: latitude - latitudeDelta / 2,
        longitude: longitude + longitudeDelta / 2,
      };
      setUpperLeftCoords(upperLeft);
      setLowerRightCoords(lowerRight);
    }, 300);
  };

  const goToMyLocation = async () => {
    mapRef.current.animateCamera({
      center: {
        ...userLocation.coords,
      },
      altitude: 500,
    });
  };

  const handleZoomIn = () => {
    mapRef.current?.getCamera().then((cam) => {
      if (Platform.OS === 'android') {
        cam.zoom += 1;
      } else {
        cam.altitude /= 2;
      }
      mapRef.current?.animateCamera(cam);
    });
  };

  const handleZoomOut = () => {
    mapRef.current?.getCamera().then((cam) => {
      if (Platform.OS === 'android') {
        cam.zoom -= 1;
      } else {
        cam.altitude *= 2;
      }
      mapRef.current?.animateCamera(cam);
    });
  };

  return (
    <View position="relative">
      <MapView
        style={{ width: '100%', height: '100%' }}
        ref={mapRef}
        initialRegion={initRegion}
        onRegionChange={handleRegionChange}>
        {markers.map((item) =>
          item.longitude !== null && item.latitude !== null ? (
            <Marker
              key={`${item.id}-${item.type}`}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              pinColor={item.type === 'tko' ? 'green' : 'red'}
              title={item.title}
            />
          ) : null,
        )}
      </MapView>
      <YStack
        space
        position="absolute"
        bottom={25}
        right={15}
        alignItems="center">
        <TouchableOpacity onPress={handleZoomIn}>
          <ZoomInIcon
            width={24}
            height={24}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleZoomOut}>
          <ZoomOutIcon
            width={24}
            height={24}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => (userLocation ? goToMyLocation() : {})}>
          <MyLocationIcon
            width={24}
            height={24}
            fill="white"
          />
        </TouchableOpacity>
      </YStack>
    </View>
  );
};

export { AppealsMapPage };
