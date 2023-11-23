import { useState, useEffect } from 'react';
import { YStack, Text, Input, Button } from 'tamagui';

import { useAuth } from '../../authProvider';
import { UniversalView } from '../../components/UniversalView';

const SignUpPage = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const blankFields = Boolean(
    name === '' || email === '' || password === '' || rePassword === '',
  );
  const { state, api } = useAuth();

  useEffect(() => {
    if (state.isAuthenticated) {
      navigation.goBack();
    }
  }, [state.isAuthenticated]);

  const register = async () => {
    if (blankFields) {
      alert('Заполните все поля');
      return;
    }

    if (password !== rePassword) {
      alert('Пароли не совпадают');
      return;
    }

    api
      .register(name, email, password)
      .then(() => {
        alert('Успешная регистрация');
        navigation.navigate('sign-in');
      })
      .catch(() => {
        alert('Ошибка при регистрации');
      });
  };

  return (
    <UniversalView
      yCenter
      safe>
      <YStack space="$2.5">
        <YStack>
          <Text>ФИО</Text>
          <Input
            placeholder="Введите ФИО"
            inputMode="text"
            autoComplete="name"
            autoCapitalize="none"
            onChangeText={setName}
            value={name}
          />
        </YStack>
        <YStack>
          <Text>Электронный адрес</Text>
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
            autoComplete="new-password"
            autoCapitalize="none"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
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
            secureTextEntry
          />
        </YStack>
        <Button onPress={() => register()}>Создать аккаунт</Button>
      </YStack>
    </UniversalView>
  );
};

export { SignUpPage };
