import axios from 'axios';
import debounce from 'lodash/debounce';
import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  View,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  H6,
  ListItem,
  useTheme,
  Label,
  ToggleGroup,
  XStack,
  Text,
} from 'tamagui';

import { useAuth } from '../../authProvider';
import { RequestsList } from '../../components/RequestsList';
import { UniversalView } from '../../components/UniversalView';

const axiosInstance = axios.create({
  baseURL: 'http://176.222.53.146:8080',
});

const AppealsListPage = ({ navigation }) => {
  const theme = useTheme();
  const color = theme.color.get();
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const [appeals, setAppeals] = useState([]);
  const [selectedAppeal, setSelectedAppeal] = useState(null);
  const [appealTypes, setAppealTypes] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useAuth();

  const fetchAppeals = async () => {
    setIsRefreshing(true);
    try {
      const response = await axiosInstance.get(`/api/appeal/`);
      setNextPage(response.data.next_page_url);
      setAppeals(response.data.items);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchAppealTypes = async () => {
    try {
      const response = await axiosInstance
        .get(`/api/appeal_type`)
        .then((response) => {
          setAppealTypes(response.data);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    await fetchAppeals();
    await fetchAppealTypes();
  };

  useEffect(() => {
    fetchData();
  }, [navigation]);

  const loadMoreAppeals = debounce(() => {
    if (!isLoading && nextPage) {
      setIsLoading(true);
      axiosInstance
        .get(nextPage)
        .then((response) => {
          setAppeals((prevData) => [...prevData, ...response.data.items]);
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
        subTitle={item.address}
        bordered
        borderRadius={10}
        pressStyle={{ backgroundColor: '$backgroundPress' }}
        onPress={() =>
          navigation.navigate('appeal-details', {
            appealId: item.id,
            title: item.title,
          })
        }>
        {item.description}
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
          data={appeals}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={loadMoreAppeals}
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
              onRefresh={fetchData}
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

export { AppealsListPage };
