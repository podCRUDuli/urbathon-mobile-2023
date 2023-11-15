import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'tamagui';

// import {
//   DarkTheme,
//   DefaultTheme,
// } from '@react-navigation/native';
import { GoBackBtn } from './GoBackBtn';
import { SignInPage } from '../pages/SignIn';
import { HomePage } from '../pages/tabs/Home';
const Stack = createNativeStackNavigator();

const Router = ({ colorScheme }) => {
  const theme = useTheme();
  const headerBackgroundColor = theme.backgroundStrong.get();
  const titleAndSeparatorColor = theme.color.get();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation, route }) => ({
          headerStyle: {
            backgroundColor: headerBackgroundColor,
          },
          headerTitleStyle: {
            color: titleAndSeparatorColor,
          },
          headerTintColor: '#f9ad4a',
          headerLeft: ({ tintColor }) =>
            route.name === 'home' ? null : (
              <GoBackBtn
                navigation={navigation}
                tintColor={tintColor}
              />
            ),
          animation: 'fade',
        })}>
        <Stack.Screen
          name="home"
          component={HomePage}
          options={{ title: 'Главная' }}
        />
        <Stack.Screen
          name="sign-in"
          component={SignInPage}
          options={{ title: 'Войти' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export { Router };
