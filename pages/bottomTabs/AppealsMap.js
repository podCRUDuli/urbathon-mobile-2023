import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { View } from 'tamagui';

import MyLocationIcon from '../../assets/my-location.svg';

const AppealsMapPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = React.createRef();

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
      />
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
