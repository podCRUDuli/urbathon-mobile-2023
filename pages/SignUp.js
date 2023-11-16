import { useState } from 'react';
import { YStack, Text, Input, Button } from 'tamagui';

import { UniversalView } from '../components/UniversalView';

const SignUpPage = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

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
            autoComplete="new-password"
            autoCapitalize="none"
            onChangeText={setPassword}
            value={password}
          />
        </YStack>
        <YStack>
          <Text>Повторите пароль</Text>
          <Input
            placeholder="Введите пароль ещё раз"
            inputMode="text"
            autoComplete="new-password"
            autoCapitalize="none"
            onChangeText={setRePassword}
            value={rePassword}
          />
        </YStack>
        <Button onPress={() => console.log({ username, password })}>
          Зарегистрироваться
        </Button>
      </YStack>
    </UniversalView>
  );
};

export { SignUpPage };
