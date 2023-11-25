import axios from 'axios';
import { useEffect, useState } from 'react';
import { Dimensions, Modal, Image } from 'react-native';
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
} from 'tamagui';

import ChevronDownIcon from '../../assets/chevron-down.svg';
import { UniversalView } from '../../components/UniversalView';
import { formatDate } from '../../utils/format';

const axiosInstance = axios.create({
  baseURL: 'http://176.222.53.146:8080',
});

const NewsDetailsPage = ({ route, navigation }) => {
  const { newsId } = route.params;
  const [news, setNews] = useState(null);
  const [error, setError] = useState(false);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const backgroundStrongColor = theme.backgroundStrong.get();
  const backgroundColor = theme.background.get();
  const borderColor = theme.borderColor.get();
  const { height, width } = Dimensions.get('window');
  const imgWidth = width - (height < width ? insets.left : 5) * 2 - 20;
  
  const fetchAppeal = async () => {
    try {
      const response = await axiosInstance.get(`/api/news/${newsId}`);
      setNews(response.data);
      setError(false);
    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    fetchAppeal();
  }, []);

  return (
    <UniversalView>
      {error ? (
        <UniversalView
          yCenter
          xCenter>
          <Text>Ошибка загрузки</Text>
          <Button onPress={fetchAppeal}>Повторить</Button>
        </UniversalView>
      ) : news ? (
        <ScrollView
          backgroundColor="$backgroundStrong"
          contentContainerStyle={{
            paddingBottom: insets.bottom,
            paddingLeft: height < width ? insets.left : 5,
            paddingRight: height < width ? insets.right : 5,
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
                <YStack width={imgWidth} height={imgWidth}>
                <Image
                                    source={{ uri: news.photo_url }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="cover"
                                  />
                </YStack>
                <Text alignSelf='flex-end' color={borderColor}>{formatDate(news.date)}</Text>
                <Paragraph>{news.body}</Paragraph>
              </YStack>
          </YStack>
        </ScrollView>
      ) : null}
    </UniversalView>
  );
};

export { NewsDetailsPage };
