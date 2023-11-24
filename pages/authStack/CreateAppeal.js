import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  YStack,
  Input,
  H6,
  useTheme,
  ScrollView,
  XStack,
  Button,
  View,
  Theme,
  Text,
} from 'tamagui';

import DoneIcon from '../../assets/done.svg';
import MyLocationIcon from '../../assets/my-location.svg';
import { useAuth } from '../../authProvider';

const axiosInstance = axios.create({
  baseURL: 'http://176.222.53.146:8080',
});

const CreateAppealPage = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const backgroundStrongColor = theme.backgroundStrong.get();
  const backgroundColor = theme.background.get();
  const borderColor = theme.borderColor.get();
  const color = theme.color.get();
  const mapRef = React.createRef();
  const [userLocation, setUserLocation] = useState(null);
  const { state } = useAuth();
  const [appealCategories, setAppealCategories] = useState([]);
  const [appealCategory, setAppealCategory] = useState(0);
  const [appealTypes, setAppealTypes] = useState([]);
  const [appealType, setAppealType] = useState(0);
  const [coordinates, setCoordinates] = useState({});
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [photos, setPhotos] = useState([]);
  const { height, width } = Dimensions.get('window');
  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
  const [isSended, setIsSended] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const hasUnsavedChanges = Boolean(
    title !== '' ||
      description !== '' ||
      appealCategory !== 0 ||
      appealType !== 0 ||
      Object.keys(coordinates).length ||
      photos.length ||
      address !== '',
  );

  const blankFields = Boolean(
    title === '' ||
      description === '' ||
      appealCategory === 0 ||
      appealType === 0 ||
      !Object.keys(coordinates).length ||
      !photos.length ||
      address === '',
  );

  const fetchAppealCategories = async () => {
    try {
      const response = await axiosInstance.get('/api/appeal_category');
      setAppealCategories(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAppealTypes = async (categoryId) => {
    try {
      const response = await axiosInstance.get(
        `/api/appeal_category/${categoryId}/appeal_types`,
      );
      setAppealTypes(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAppealCategories();
  }, []);

  useEffect(() => {
    if (appealCategory !== 0) {
      fetchAppealTypes(appealCategory);
    } else {
      setAppealTypes([]);
      setAppealType(0);
    }
  }, [appealCategory]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (!hasUnsavedChanges || isSended) {
          return;
        }

        e.preventDefault();

        Alert.alert(
          'Отменить изменения?',
          'У вас есть несохраненные изменения. Вы уверены, что хотите отменить их и покинуть страницу?',
          [
            { text: 'Не покидать', style: 'cancel', onPress: () => {} },
            {
              text: 'Покинуть',
              style: 'destructive',
              onPress: () => navigation.dispatch(e.data.action),
            },
          ],
        );
      }),
    [navigation, hasUnsavedChanges],
  );

  useEffect(() => {
    if (!state.isAuthenticated) {
      navigation.goBack();
    }
  }, [state.isAuthenticated]);

  const postAppeal = async () => {
    const formData = new FormData();
    formData.append('address', address);
    formData.append('appeal_type_id', appealType);
    formData.append('description', description);
    formData.append('latitude', coordinates.latitude);
    formData.append('longitude', coordinates.longitude);
    formData.append('title', title);
    formData.append('photos', photos);
    photos.forEach((photo) => {
      formData.append('photos', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: photo.name,
      });
    });

    try {
      const response = await axiosInstance.post(`/api/appeal/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await setIsSended(true);
      await navigation.goBack();
      alert('Обращение успешно отправлено');
    } catch {
      alert('Ошибка при отправлении обращения');
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) =>
        !blankFields ? (
          <TouchableOpacity
            onPress={() => postAppeal()}
            style={{ right: 15 }}>
            <DoneIcon fill={tintColor} />
          </TouchableOpacity>
        ) : null,
    });
  }, [blankFields]);

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

  const handleAddMarker = async (e) => {
    setCoordinates(e.nativeEvent.coordinate);
  };

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      aspect: [4, 3],
      allowsEditing: true,
    });

    if (result.assets) {
      setPhotos([
        ...photos,
        ...result.assets.map((item) => ({
          uri: item.uri,
          type: 'image/jpeg',
          name: item.fileName,
        })),
      ]);
    }
  };

  const getAdress = async () => {
    const res = await Location.reverseGeocodeAsync(coordinates);
    if (res[0].street == null || res[0].streetNumber == null) {
      setAddress(`г. ${res[0].city}, ${res[0].district} р-н, ${res[0].name}`);
    } else {
      setAddress(
        `г. ${res[0].city}, ${res[0].district} р-н, ${res[0].street}, ${res[0].streetNumber}`,
      );
    }
  };

  useEffect(() => {
    if (Object.keys(coordinates).length) {
      getAdress();
    }
  }, [coordinates]);

  return (
    <ScrollView
      backgroundColor="$backgroundStrong"
      contentContainerStyle={{
        paddingBottom: insets.bottom,
        paddingLeft:
          Dimensions.get('screen').height < Dimensions.get('screen').width
            ? insets.left
            : 5,
        paddingRight:
          Dimensions.get('screen').height < Dimensions.get('screen').width
            ? insets.right
            : 5,
      }}
      showsVerticalScrollIndicator={false}>
      <YStack space="$2.5">
        <YStack>
          <H6>Заголовок</H6>
          <Input
            placeholder="Введите заголовок обращения"
            inputMode="text"
            autoCapitalize="none"
            onChangeText={setTitle}
            value={title}
          />
        </YStack>
        <YStack>
          <H6>Описание</H6>
          <Input
            placeholder="Введите описание обращения"
            inputMode="text"
            autoCapitalize="none"
            onChangeText={setDescription}
            value={description}
            multiline
            numberOfLines={6}
          />
        </YStack>
        <YStack>
          <H6>Категория</H6>
          <Picker
            selectedValue={appealCategory}
            style={{
              backgroundColor,
              borderColor,
              borderWidth: 1,
              borderRadius: 10,
            }}
            onValueChange={(itemValue, itemIndex) =>
              setAppealCategory(itemValue)
            }>
            <Picker.Item
              value={0}
              label="Выберите категорию"
              color={color}
            />
            {appealCategories.map((item, i) => {
              return (
                <Picker.Item
                  key={item.id.toString()}
                  label={item.title}
                  value={item.id}
                  color={color}
                />
              );
            })}
          </Picker>
        </YStack>
        {appealCategory !== 0 ? (
          <YStack>
            <H6>Тип</H6>
            <Picker
              selectedValue={appealType}
              style={{
                backgroundColor,
                borderColor,
                borderWidth: 1,
                borderRadius: 10,
              }}
              onValueChange={(itemValue, itemIndex) =>
                setAppealType(itemValue)
              }>
              <Picker.Item
                value={0}
                color={color}
                label="Выберите тип"
              />
              {appealTypes.map((item, i) => {
                return (
                  <Picker.Item
                    key={item.id.toString()}
                    label={item.title}
                    value={item.id}
                    color={color}
                  />
                );
              })}
            </Picker>
          </YStack>
        ) : null}
        <YStack>
          <H6>Фотографии</H6>
          <XStack
            flexWrap="wrap"
            gap={10}>
            {photos.map((item, i) => {
              return (
                <View
                  key={i.toString()}
                  w={Dimensions.get('window').width / 3 - 10}
                  h={Dimensions.get('window').width / 3 - 10}
                  onLongPress={() => openModal(item)}>
                  <Image
                    source={{ uri: item.uri }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </View>
              );
            })}
          </XStack>
          <XStack
            space={10}
            mt={10}>
            {photos.length ? (
              <Button
                flex={1}
                backgroundColor="red"
                onPress={() => setPhotos([])}>
                Очистить
              </Button>
            ) : null}
            <Button
              flex={1}
              onPress={() => pickImageAsync()}>
              Загрузить
            </Button>
          </XStack>
        </YStack>
        <YStack position="relative">
          <H6>Карта</H6>
          <View
            style={{
              backgroundColor,
              borderColor,
              borderWidth: 1,
              borderRadius: 10,
            }}>
            {Object.keys(coordinates).length ? (
              <Text p={10}>{address}</Text>
            ) : null}
            {userLocation ? (
              <MapView
                ref={mapRef}
                onPress={handleAddMarker}
                initialRegion={{
                  ...userLocation.coords,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}
                style={{
                  width: '100%',
                  height: Dimensions.get('screen').height / 2,
                  borderRadius: 10,
                }}>
                <Marker
                  coordinate={coordinates}
                  draggable
                  onDragEnd={(e) => setCoordinates(e.nativeEvent.coordinate)}
                />
              </MapView>
            ) : null}
          </View>
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
            }}
            onPress={() => goToMyLocation()}>
            <MyLocationIcon fill="black" />
          </TouchableOpacity>
        </YStack>
      </YStack>
      <Modal
        animationType="fade"
        visible={modalVisible}
        onRequestClose={closeModal}
        transparent>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: `${backgroundStrongColor}80`,
            }}>
            <View
              w={Dimensions.get('screen').width - 20}
              h={
                Dimensions.get('screen').height -
                insets.top -
                insets.bottom -
                20
              }>
              <Image
                source={{ uri: selectedImage?.uri }}
                style={{ flex: 1, width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

export { CreateAppealPage };
