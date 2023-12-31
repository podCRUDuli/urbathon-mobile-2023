import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, XStack, Input, Button, Text } from 'tamagui';

import GosusligiIcon from '../../assets/gosusligi.svg';
import { useAuth } from '../../authProvider';
import { UniversalView } from '../../components/UniversalView';

const SignInPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const blankFields = Boolean(email === '' || password === '');
  const insets = useSafeAreaInsets();
  const { state, api } = useAuth();

  useEffect(() => {
    if (state.isAuthenticated) {
      navigation.goBack();
    }
  }, [state.isAuthenticated]);

  const login = async () => {
    if (blankFields) {
      alert('Заполните все поля');
      return;
    }

    api.login(email, password).catch(() => {
      alert('Неверный эл.адрес или пароль');
    });
  };

  return (
    <UniversalView
      yCenter
      safe>
      <YStack space="$2.5">
        <YStack>
          <Text>Эл.адрес</Text>
          <Input
            placeholder="Введите эл.адрес"
            inputMode="text"
            autoComplete="email"
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
          />
        </YStack>
        <YStack>
          <Text>Пароль</Text>
          <Input
            placeholder="Введите пароль"
            inputMode="text"
            autoComplete="current-password"
            autoCapitalize="none"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />
        </YStack>
        <Button onPress={() => login()}>Войти в аккаунт</Button>
        <Button
          backgroundColor="white"
          color="#0d4cd3"
          borderWidth={1}
          borderColor="#0d4cd3"
          h={48}
          icon={
            <GosusligiIcon
              height={28}
              width={28}
            />
          }>
          Войти через Госуслуги
        </Button>
      </YStack>
      <XStack
        flexWrap="wrap"
        space="$1"
        bottom={insets.bottom}
        alignSelf="center"
        position="absolute">
        <Text>Ещё нет аккаунта?</Text>
        <Text
          onPress={() => navigation.navigate('sign-up')}
          color="$highlightColor"
          pressStyle={{ scale: 0.95 }}>
          Зарегистрируйтесь.
        </Text>
      </XStack>
    </UniversalView>
  );
};

export { SignInPage };
