import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Dimensions, Modal, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  Text,
  YStack,
  XStack,
  useTheme,
  ScrollView,
  H6,
  View,
  Accordion,
  Paragraph,
  Square,
  Circle,
  Theme,
  Input,
} from 'tamagui';

import AddPhotoIcon from '../../assets/add-photo.svg';
import ChevronDownIcon from '../../assets/chevron-down.svg';
import DeleteIcon from '../../assets/delete.svg';
import SendIcon from '../../assets/send.svg';
import { useAuth } from '../../authProvider';
import { UniversalView } from '../../components/UniversalView';
import { formatDate } from '../../utils/format';

const axiosInstance = axios.create({
  baseURL: 'http://176.222.53.146:8080',
});

const AppealDetailsPage = ({ route, navigation }) => {
  const { state } = useAuth();
  const { appealId } = route.params;
  const [appeal, setAppeal] = useState(null);
  const [error, setError] = useState(false);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const backgroundStrongColor = theme.backgroundStrong.get();
  const backgroundColor = theme.background.get();
  const borderColor = theme.borderColor.get();
  const color = theme.color.get();
  const blue = theme.blue.get();
  const red = theme.red.get();
  const { height, width } = Dimensions.get('window');
  const isLandscape = Boolean(height < width);
  const safeInsetLeft = isLandscape ? insets.left : 5;
  const safeInsetRight = isLandscape ? insets.left : 5;
  const imgSize = width / 3 - (safeInsetLeft + safeInsetRight + 10);
  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [comments, setComments] = useState([]);
  const [uploadedPhoto, setUploadedPhoto] = useState([]);
  const [commentText, setCommentText] = useState('');

  const openModal = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const fetchAppeal = async () => {
    try {
      const response = await axiosInstance.get(`/api/appeal/${appealId}`);
      setAppeal(response.data);
      setError(false);
    } catch {
      setError(true);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/appeal/${appealId}/comment`,
      );
      setComments(response.data.items);
      setError(false);
    } catch {
      setError(true);
    }
  };

  const fetchData = async () => {
    await fetchAppeal();
    fetchComments();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const postComment = async () => {
    if (commentText) {
      const formData = new FormData();
      formData.append('text', commentText);
      uploadedPhoto.forEach((photo) => {
        formData.append('photos', {
          uri: photo.uri,
          type: 'image/jpeg',
          name: photo.name,
        });
      });

      try {
        const response = await axiosInstance.post(
          `api/appeal/${appealId}/comment`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        setComments((prevComments) => [response.data, ...prevComments]);
        setUploadedPhoto([]);
        setCommentText('');
        alert('Комментарий успешно отправлен');
      } catch (error) {
        console.error(error);
        alert('Ошибка при отправлении комментария');
      }
    } else {
      alert('Текст сообщения не может быть пустым');
    }
  };

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      aspect: [4, 3],
      allowsMultipleSelection: true,
    });

    if (result.assets) {
      setUploadedPhoto([
        ...uploadedPhoto,
        ...result.assets.map((item) => ({
          uri: item.uri,
          type: 'image/jpeg',
          name: item.fileName,
        })),
      ]);
    }
  };

  return (
    <UniversalView>
      {error ? (
        <UniversalView
          yCenter
          xCenter>
          <Text>Ошибка загрузки</Text>
          <Button onPress={fetchData}>Повторить</Button>
        </UniversalView>
      ) : appeal ? (
        <ScrollView
          backgroundColor="$backgroundStrong"
          contentContainerStyle={{
            paddingBottom: insets.bottom,
            paddingLeft: safeInsetLeft,
            paddingRight: safeInsetRight,
          }}
          showsVerticalScrollIndicator={false}>
          <YStack space="$2.5">
            <YStack
              space="$2.5"
              backgroundColor="$background"
              borderColor
              borderWidth={1}
              borderRadius={10}
              paddingHorizontal={10}
              paddingVertical={10}>
              <YStack>
                <H6>Описание</H6>
                <Text>{appeal.description}</Text>
              </YStack>
              <YStack>
                <H6>Категория</H6>
                <Text>{appeal.appeal_type.title}</Text>
              </YStack>
              <YStack>
                <H6>Тип</H6>
                <Text>{appeal.appeal_type.appeal_category.title}</Text>
              </YStack>
              <YStack>
                <H6>Фотографии</H6>
                <XStack
                  flexWrap="wrap"
                  gap={10}
                  justifyContent="space-between">
                  {appeal.appeal_photos.map((item, i) => {
                    return (
                      <View
                        key={i.toString()}
                        w={imgSize}
                        h={imgSize}
                        onLongPress={() => openModal(item)}>
                        <Image
                          source={{ uri: item.url }}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode="cover"
                        />
                      </View>
                    );
                  })}
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
                  <Text p={10}>{appeal.address}</Text>
                  <MapView
                    initialRegion={{
                      latitude: appeal.latitude,
                      longitude: appeal.longitude,
                      latitudeDelta: LATITUDE_DELTA,
                      longitudeDelta: LONGITUDE_DELTA,
                    }}
                    style={{
                      width: '100%',
                      height: height / 2,
                      borderRadius: 10,
                    }}>
                    <Marker
                      coordinate={{
                        latitude: appeal.latitude,
                        longitude: appeal.longitude,
                      }}
                    />
                  </MapView>
                </View>
              </YStack>
            </YStack>
            <Accordion
              overflow="hidden"
              type="multiple">
              <Accordion.Item value="a1">
                <Accordion.Trigger
                  flexDirection="row"
                  justifyContent="space-between"
                  borderTopStartRadius={10}
                  borderTopEndRadius={10}
                  borderBottomEndRadius={10}
                  borderBottomStartRadius={10}
                  backgroundColor="$background">
                  {({ open }) => (
                    <>
                      <Paragraph>Комментарии</Paragraph>
                      <Square
                        animation="quick"
                        rotate={open ? '180deg' : '0deg'}>
                        <ChevronDownIcon fill={color} />
                      </Square>
                    </>
                  )}
                </Accordion.Trigger>
                <Accordion.Content
                  borderTopStartRadius={10}
                  borderTopEndRadius={10}
                  borderBottomEndRadius={10}
                  borderBottomStartRadius={10}
                  space={10}
                  backgroundColor="$background">
                  {comments.map((item) => {
                    return (
                      <XStack
                        space={10}
                        key={item.id}>
                        <Circle
                          width={50}
                          height={50}
                          backgroundColor="$borderColor"
                          borderWidth={1}
                        />
                        <YStack>
                          <Text fontWeight="bold">
                            {item.user.last_name} {item.user.first_name}
                          </Text>
                          <Paragraph>{item.text}</Paragraph>
                          <XStack
                            flexWrap="wrap"
                            gap={10}>
                            {item.appeal_comment_photos.map((item, i) => {
                              return (
                                <View
                                  key={i.toString()}
                                  w={imgSize}
                                  h={imgSize}
                                  onLongPress={() => openModal(item)}>
                                  <Image
                                    source={{ uri: item.url }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="cover"
                                  />
                                </View>
                              );
                            })}
                          </XStack>
                          <Text color="$borderColor">
                            {formatDate(item.date)}
                          </Text>
                        </YStack>
                      </XStack>
                    );
                  })}

                  {state.isAuthenticated ? (
                    <XStack
                      alignItems="center"
                      width="100%"
                      space={5}>
                      <Input
                        multiline
                        flex={3}
                        placeholder="Введите текст сообщения"
                        value={commentText}
                        onChangeText={setCommentText}
                      />
                      {commentText !== '' ? (
                        <TouchableOpacity
                          style={{ padding: 5 }}
                          onPress={postComment}>
                          <SendIcon
                            width={30}
                            height={30}
                            fill={color}
                          />
                        </TouchableOpacity>
                      ) : null}
                      {uploadedPhoto.length ? (
                        <TouchableOpacity
                          style={{ padding: 5 }}
                          onPress={() => setUploadedPhoto([])}>
                          <DeleteIcon
                            width={30}
                            height={30}
                            fill={red}
                          />
                        </TouchableOpacity>
                      ) : null}

                      <TouchableOpacity
                        style={{ padding: 5, position: 'relative' }}
                        onPress={pickImageAsync}>
                        <AddPhotoIcon
                          width={30}
                          height={30}
                          fill={blue}
                        />
                        <Circle
                          position="absolute"
                          size={15}
                          right={0}
                          bottom={0}
                          backgroundColor={color}
                          justifyContent="center"
                          alignItems="center">
                          <Text
                            color="$backgroundStrong"
                            fontSize={10}>
                            {uploadedPhoto.length}
                          </Text>
                        </Circle>
                      </TouchableOpacity>
                    </XStack>
                  ) : null}
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </YStack>
        </ScrollView>
      ) : null}
      <Modal
        animationType="fade"
        visible={modalVisible}
        onRequestClose={closeModal}
        transparent>
        <View
          onPress={closeModal}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: `${backgroundStrongColor}80`,
          }}>
          <View
            w={width}
            h={height - insets.top - insets.bottom}>
            <Image
              source={{ uri: selectedImage?.url }}
              style={{ flex: 1, width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>
        </View>
      </Modal>
    </UniversalView>
  );
};

export { AppealDetailsPage };
