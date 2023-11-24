import axios from 'axios';
import debounce from 'lodash/debounce';
import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { H6, ListItem, useTheme } from 'tamagui';

import CloseCrossIcon from '../../assets/close-cross.svg';
import MailIcon from '../../assets/mail.svg';
import { useAuth } from '../../authProvider';
import { RequestsList } from '../../components/RequestsList';
import { UniversalView } from '../../components/UniversalView';
import { formatDate } from '../../utils/format';

const axiosInstance = axios.create({
  baseURL: 'http://176.222.53.146:8080',
});

const NewsListPage = ({ navigation }) => {
  const theme = useTheme();
  const color = theme.color.get();
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const [news, setNews] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useAuth();

  const fetchNews = async () => {
    setIsRefreshing(true);
    try {
      const response = await axiosInstance.get(`/api/news/`);
      setNextPage(response.data.next_page_url);
      setNews(response.data.items);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) =>
        state.isAuthenticated ? (
          isOpen ? (
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              style={{ right: 15 }}>
              <CloseCrossIcon fill={tintColor} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setIsOpen(true)}
              style={{ right: 15 }}>
              <MailIcon fill={tintColor} />
            </TouchableOpacity>
          )
        ) : null,
    });
  }, [navigation, isOpen, state.isAuthenticated]);

  const loadMoreNews = debounce(() => {
    if (!isLoading && nextPage) {
      setIsLoading(true);
      axiosInstance
        .get(nextPage)
        .then((response) => {
          setNews((prevData) => [...prevData, ...response.data.items]);
          setNextPage(response.data.next_page_url);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, 500);

  const renderItem = useCallback(
    ({ item }) => (
      <ListItem
        title={<H6>{item.title}</H6>}
        subTitle={formatDate(item.date)}
        bordered
        borderRadius={10}
        pressStyle={{ backgroundColor: '$backgroundPress' }}>
        {item.body}
      </ListItem>
    ),
    [],
  );

  const memoizedSeparator = useMemo(() => {
    return () => <View style={{ height: 10 }} />;
  }, []);

  const memoizedFooter = useMemo(() => {
    return () => isLoading && <ActivityIndicator size="large" />;
  }, [isLoading]);

  return (
    <>
      <UniversalView>
        <FlatList
          data={news}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={loadMoreNews}
          onEndReachedThreshold={0.1}
          renderItem={renderItem}
          ItemSeparatorComponent={memoizedSeparator}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={memoizedFooter}
          removeClippedSubviews
          windowSize={10}
          updateCellsBatchingPeriod={30}
          contentContainerStyle={{
            paddingVertical: 10,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          }}
          refreshControl={
            <RefreshControl
              onRefresh={fetchNews}
              refreshing={isRefreshing}
              tintColor={color}
            />
          }
        />
      </UniversalView>
      <RequestsList
        navigation={navigation}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
};

export { NewsListPage };
