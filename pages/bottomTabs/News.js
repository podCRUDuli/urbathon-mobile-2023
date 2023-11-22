import axios from 'axios';
import debounce from 'lodash/debounce';
import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import { ListItem } from 'tamagui';

import CloseCrossIcon from '../../assets/close-cross.svg';
import MailIcon from '../../assets/mail.svg';
import { RequestsList } from '../../components/RequestsList';
import { UniversalView } from '../../components/UniversalView';
import { formatDate } from '../../utils/format';

const axiosInstance = axios.create({
  baseURL: 'http://176.222.53.146:8080',
});

const NewsPage = ({ navigation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNews = async () => {
    setIsRefreshing(true);
    setTotal(0);
    setPage(1);

    try {
      const response = await axiosInstance.get(`/api/news/`);
      setNews(response.data.items);
      setTotal(response.data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) =>
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
        ),
    });
  }, [navigation, isOpen]);

  const loadMoreNews = debounce(() => {
    if (!isLoading && news.length < total) {
      setIsLoading(true);
      axiosInstance
        .get(`/api/news?page=${page + 1}&page_size=${pageSize}`)
        .then((response) => {
          setNews((prevData) => [...prevData, ...response.data.items]);
          setPage(page + 1);
          setIsLoading(false);
        });
    }
  }, 500);

  const renderItem = useCallback(
    ({ item }) => (
      <ListItem
        title={item.title}
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
    <UniversalView>
      <FlatList
        data={news}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={loadMoreNews}
        onEndReachedThreshold={0.1}
        renderItem={renderItem}
        onRefresh={fetchNews}
        refreshing={isRefreshing}
        ItemSeparatorComponent={memoizedSeparator}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={memoizedFooter}
        removeClippedSubviews
        windowSize={10}
        updateCellsBatchingPeriod={30}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
      <RequestsList
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </UniversalView>
  );
};

export { NewsPage };
