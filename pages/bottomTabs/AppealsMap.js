import axios from 'axios';
import * as Location from 'expo-location';
import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { View } from 'tamagui';

import MyLocationIcon from '../../assets/my-location.svg';

const axiosInstance = axios.create({
  baseURL: 'http://176.222.53.146:8080',
});

const AppealsMapPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  const debounceTimeout = useRef(null);
  const [upperLeftCoords, setUpperLeftCoords] = useState(null);
  const [lowerRightCoords, setLowerRightCoords] = useState(null);
  const [appeals, setAppeals] = useState([]);

  const fetchAppeals = async () => {
    if (upperLeftCoords && lowerRightCoords) {
      try {
        const response = await axiosInstance.get(
          `/api/map/get_map_elements?lat_up=${upperLeftCoords.latitude}&long_up=${upperLeftCoords.longitude}&lat_down=${lowerRightCoords.latitude}&long_down=${lowerRightCoords.longitude}`,
        );
        setAppeals(response.data);
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

  return (
    <View position="relative">
      <MapView
        style={{ width: '100%', height: '100%' }}
        ref={mapRef}
        onRegionChange={handleRegionChange}>
        {appeals.map((item) => (
          <Marker
            key={`${item.id}-${item.type}`}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            pinColor={item.type === 'tko' ? 'green' : 'red'}
            title={item.title}
          />
        ))}
      </MapView>
      <TouchableOpacity
        style={{ position: 'absolute', bottom: 25, right: 15 }}
        onPress={() => (userLocation ? goToMyLocation() : {})}>
        <MyLocationIcon
          width={35}
          height={35}
          fill="white"
        />
      </TouchableOpacity>
    </View>
  );
};

export { AppealsMapPage };
