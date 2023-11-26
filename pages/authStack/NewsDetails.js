import axios from 'axios';
import { useEffect, useState } from 'react';
import { Dimensions, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  Text,
  YStack,
  useTheme,
  ScrollView,
  H6,
  Paragraph,
  RadioGroup,
} from 'tamagui';

import { useAuth } from '../../authProvider';
import { RadioGroupItemWithLabel } from '../../components/RadioGroupItemWithLabel';
import { UniversalView } from '../../components/UniversalView';
import { formatDate } from '../../utils/format';

const axiosInstance = axios.create({
  baseURL: 'http://176.222.53.146:8080',
});

const NewsDetailsPage = ({ route, navigation }) => {
  const { state, api } = useAuth();
  const { newsId } = route.params;
  const [news, setNews] = useState(null);
  const [error, setError] = useState(false);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const backgroundStrongColor = theme.backgroundStrong.get();
  const backgroundColor = theme.background.get();
  const borderColor = theme.borderColor.get();
  const { height, width } = Dimensions.get('window');
  const isLandscape = Boolean(height < width);
  const safeInsetLeft = isLandscape ? insets.left : 5;
  const safeInsetRight = isLandscape ? insets.left : 5;
  const imgWidth = width - (safeInsetLeft + safeInsetRight) - 20;
  const [vote, setVote] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);

  const fetchNews = async () => {
    try {
      const response = await axiosInstance.get(`/api/news/${newsId}`);
      setNews(response.data);
      setError(false);
      if (response.data.poll) {
        response.data.poll.options.forEach((option) => {
          if (option.is_user_voted) {
            setVote(option.id);
          }
          setTotalVotes((prevTotalVotes) => prevTotalVotes + option.votes);
        });
      }
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const postVote = async (optionId) => {
    try {
      const response = await axiosInstance.post(
        `/api/news/${newsId}/poll_vote/${optionId}`,
      );
      setVote(optionId);
      setTotalVotes((prevTotalVotes) => prevTotalVotes + 1);
    } catch (error) {
      console.error(error);
      alert('Ошибка при голосовании');
    }
  };

  return (
    <UniversalView>
      {error ? (
        <UniversalView
          yCenter
          xCenter>
          <Text>Ошибка загрузки</Text>
          <Button onPress={fetchNews}>Повторить</Button>
        </UniversalView>
      ) : news ? (
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
              <YStack
                width={imgWidth}
                height={imgWidth}>
                <Image
                  source={{ uri: news.photo_url }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </YStack>
              <Text alignSelf="flex-end">{formatDate(news.date)}</Text>
              <Paragraph>{news.body}</Paragraph>
            </YStack>
            {news.poll ? (
              <YStack>
                <H6>{news.poll.title}</H6>
                <YStack
                  space="$2.5"
                  backgroundColor="$background"
                  borderColor
                  borderWidth={1}
                  borderRadius={10}
                  paddingHorizontal={10}
                  paddingVertical={10}>
                  <RadioGroup
                    disabled={!!(vote || !state.isAuthenticated)}
                    value={vote ?? null}
                    onValueChange={postVote}>
                    <YStack space="$2">
                      {news.poll.options.map((option) => {
                        return (
                          <RadioGroupItemWithLabel
                            key={option.id}
                            value={option.id}
                            label={option.title}
                            votes={option.votes}
                            totalVotes={totalVotes}
                          />
                        );
                      })}
                    </YStack>
                  </RadioGroup>
                </YStack>
              </YStack>
            ) : null}
          </YStack>
        </ScrollView>
      ) : null}
    </UniversalView>
  );
};

export { NewsDetailsPage };
