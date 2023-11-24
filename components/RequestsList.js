import axios from 'axios';
import debounce from 'lodash/debounce';
import React, { useCallback, useState, useEffect } from 'react';
import {
  FlatList,
  View,
  useColorScheme,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Sheet,
  ListItem,
  Separator,
  XStack,
  YStack,
  H6,
  Theme,
  useTheme,
} from 'tamagui';

import AddAppealIcon from '../assets/add-appeal.svg';

const axiosInstance = axios.create({
  baseURL: 'http://176.222.53.146:8080',
});

const RequestsList = React.memo(({ navigation, isOpen, setIsOpen }) => {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [appeals, setAppeals] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const backgroundStrongColor = theme.backgroundStrong.get();
  const highlightColor = theme.highlightColor.get();

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

  useEffect(() => {
    fetchAppeals();
  }, []);

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

  const renderItem = useCallback(({ item }) => {
    return (
      <ListItem
        pressTheme
        title={item.title}
      />
    );
  }, []);

  return (
    <Theme name={colorScheme === 'dark' ? 'light_subtle' : 'dark_subtle'}>
      <Sheet
        open={isOpen}
        snapPoints={[85]}
        onOpenChange={() => setIsOpen(false)}
        dismissOnSnapToBottom
        disableDrag>
        <Sheet.Overlay backgroundColor="transparent" />
        <Sheet.Frame
          borderRadius={30}
          borderBottomStartRadius={0}
          borderBottomEndRadius={0}
          borderBottomLeftRadius={0}
          borderBottomRightRadius={0}
          backgroundColor="$background">
          <FlatList
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
              <XStack
                h={60}
                backgroundColor="$background"
                paddingHorizontal={insets.bottom}
                alignItems="center"
                borderBottomWidth={1}
                borderColor="$borderColor">
                <View flex={1} />
                <H6
                  flex={1}
                  textAlign="center"
                  lineHeight={0}>
                  Мои обращения
                </H6>
                <View
                  flex={1}
                  alignItems="flex-end">
                  <TouchableOpacity
                    onPress={() => navigation.navigate('create-appeal')}>
                    <AddAppealIcon
                      fill={highlightColor}
                      width={30}
                      height={30}
                    />
                  </TouchableOpacity>
                </View>
              </XStack>
            }
            data={appeals}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={loadMoreAppeals}
            onEndReachedThreshold={0.1}
            renderItem={renderItem}
            ItemSeparatorComponent={Separator}
            removeClippedSubviews
            windowSize={10}
            updateCellsBatchingPeriod={30}
            contentContainerStyle={{
              paddingLeft: insets.left,
              paddingRight: insets.right,
            }}
            refreshControl={
              <RefreshControl
                onRefresh={fetchAppeals}
                refreshing={isRefreshing}
                tintColor={backgroundStrongColor}
              />
            }
          />
        </Sheet.Frame>
      </Sheet>
    </Theme>
  );
});

export { RequestsList };
