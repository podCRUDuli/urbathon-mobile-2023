import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, XStack, Input, Button, Text } from 'tamagui';

import GosusligiIcon from '../../assets/gosusligi.svg';
import { UniversalView } from '../../components/UniversalView';

const SignInPage = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const insets = useSafeAreaInsets();

  return (
    <UniversalView yCenter>
      <YStack
        space="$2.5"
        paddingHorizontal="$4">
        <YStack>
          <Text>Имя пользователя</Text>
          <Input
            placeholder="Введите имя пользователя"
            inputMode="text"
            autoComplete="username"
            autoCapitalize="none"
            onChangeText={setUsername}
            value={username}
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
          />
        </YStack>
        <Button onPress={() => console.log({ username, password })}>
          Войти в аккаунт
        </Button>
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
          color="#f9ad4a"
          pressStyle={{ scale: 0.95 }}>
          Зарегистрируйтесь.
        </Text>
      </XStack>
    </UniversalView>
  );
};

export { SignInPage };
