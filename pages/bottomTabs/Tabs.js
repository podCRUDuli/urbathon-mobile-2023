import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from 'tamagui';

import { NewsPage } from './News';
import { ProfilePage } from '../authStack/Profile';

// import {
//   DarkTheme,
//   DefaultTheme,
// } from '@react-navigation/native';

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
        headerTitleAlign: 'center',
        headerTintColor: highlightColor,
        tabBarActiveTintColor: highlightColor,
      })}>
      <Tabs.Screen
        name="news"
        component={NewsPage}
        options={{ title: 'Новости' }}
      />
      <Tabs.Screen
        name="profile"
        component={ProfilePage}
        options={{ title: 'Профиль' }}
      />
    </Tabs.Navigator>
  );
});

export { BottomTabs };
