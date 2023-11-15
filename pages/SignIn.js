import { useState } from 'react';
import { YStack, Fieldset, Label, Input, Button } from 'tamagui';

import { UniversalView } from '../components/UniversalView';

const SignInPage = ({ navigation }) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  return (
    <UniversalView yCenter>
      <YStack
        space="$2.5"
        paddingHorizontal="$4">
        <Fieldset>
          <Label>Имя пользователя</Label>
          <Input
            placeholder="Введите имя пользователя"
            inputMode="text"
            autoComplete="username"
            autoCapitalize="none"
            onChangeText={setUsername}
            value={username}
          />
        </Fieldset>
        <Fieldset>
          <Label>Пароль</Label>
          <Input
            placeholder="Введите пароль"
            inputMode="text"
            autoComplete="current-password"
            autoCapitalize="none"
            onChangeText={setPassword}
            value={password}
          />
        </Fieldset>
        <Button onPress={() => console.log({ username, password })}>
          Войти
        </Button>
      </YStack>
    </UniversalView>
  );
};

export { SignInPage };
