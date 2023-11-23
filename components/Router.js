import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from 'tamagui';

// import {
//   DarkTheme,
//   DefaultTheme,
// } from '@react-navigation/native';
import { GoBackBtn } from './GoBackBtn';
import { CreateAppealPage } from '../pages/authStack/CreateAppeal';
import { SignInPage } from '../pages/authStack/SignIn';
import { SignUpPage } from '../pages/authStack/SignUp';
import { BottomTabs } from '../pages/bottomTabs/Tabs';

const Stack = createNativeStackNavigator();

const Router = React.memo(({ colorScheme }) => {
  const theme = useTheme();
  const headerBackgroundColor = theme.backgroundStrong.get();
  const titleColor = theme.color.get();
  const highlightColor = theme.highlightColor.get();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation, route }) => ({
          headerStyle: {
            backgroundColor: headerBackgroundColor,
          },
          headerTitleStyle: {
            color: titleColor,
          },
          headerTintColor: highlightColor,
          headerTitleAlign: 'center',
          headerLeft: ({ tintColor }) =>
            route.name === 'profile' ? null : (
              <GoBackBtn
                navigation={navigation}
                tintColor={tintColor}
              />
            ),
          animation: 'fade',
          headerShadowVisible: false,
        })}>
        <Stack.Screen
          name="profile"
          component={BottomTabs}
          options={{ title: 'Профиль', headerShown: false }}
        />
        <Stack.Screen
          name="create-appeal"
          component={CreateAppealPage}
          options={{ title: 'Создать обращение' }}
        />
        <Stack.Screen
          name="sign-in"
          component={SignInPage}
          options={{ title: 'Войти' }}
        />
        <Stack.Screen
          name="sign-up"
          component={SignUpPage}
          options={{ title: 'Зарегистрироваться' }}
        />
      </Stack.Navigator>
      <StatusBar backgroundColor={headerBackgroundColor} />
    </NavigationContainer>
  );
});

export { Router };
