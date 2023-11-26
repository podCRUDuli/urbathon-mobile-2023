import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'tamagui';

import { AppealsListPage } from './AppealsList';
import { AppealsMapPage } from './AppealsMap';
import { NewsListPage } from './NewsList';
import AppealsIcon from '../../assets/appeals.svg';
import MapIcon from '../../assets/map.svg';
import NewsIcon from '../../assets/news.svg';
import ProfileIcon from '../../assets/profile.svg';
import { ProfilePage } from '../authStack/Profile';

const Tabs = createBottomTabNavigator();

const BottomTabs = React.memo(({ colorScheme }) => {
  const theme = useTheme();
  const headerBackgroundColor = theme.backgroundStrong.get();
  const titleColor = theme.color.get();
  const highlightColor = theme.highlightColor.get();

  return (
    <Tabs.Navigator
      screenOptions={({ navigation, route }) => ({
        headerStyle: {
          backgroundColor: headerBackgroundColor,
        },
        headerTitleStyle: {
          color: titleColor,
        },
        tabBarStyle: {
          backgroundColor: headerBackgroundColor,
        },
        headerTintColor: highlightColor,
        tabBarActiveTintColor: highlightColor,
        headerTitleAlign: 'center',
      })}>
      <Tabs.Screen
        name="news-list"
        component={NewsListPage}
        options={{
          title: 'Новости',
          tabBarIcon: ({ color }) => <NewsIcon fill={color} />,
        }}
      />
      <Tabs.Screen
        name="appeals-list"
        component={AppealsListPage}
        options={{
          title: 'Обращения',
          tabBarIcon: ({ color }) => (
            <AppealsIcon
              width={24}
              height={24}
              fill={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="appeals-map"
        component={AppealsMapPage}
        options={{
          headerTransparent: true,
          title: 'Карта обращений',
          tabBarIcon: ({ color }) => <MapIcon fill={color} />,
        }}
      />
      <Tabs.Screen
        name="auth-stack"
        component={ProfilePage}
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color }) => <ProfileIcon fill={color} />,
        }}
      />
    </Tabs.Navigator>
  );
});

export { BottomTabs };
