import { useState, useEffect } from 'react';
import { YStack, Text, Input, Button } from 'tamagui';

import { useAuth } from '../../authProvider';
import { UniversalView } from '../../components/UniversalView';

const SignUpPage = ({ navigation }) => {
  const [last_name, setLastName] = useState('');
  const [first_name, setFirstName] = useState('');
  const [patronymic, setMiddleName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const blankFields = Boolean(
    last_name === '' ||
      first_name === '' ||
      patronymic === '' ||
      email === '' ||
      password === '' ||
      rePassword === '',
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
          <Text>Фамилия</Text>
          <Input
            placeholder="Введите фамилию"
            inputMode="text"
            autoComplete="name"
            autoCapitalize="none"
            onChangeText={setLastName}
            value={last_name}
          />
        </YStack>
        <YStack>
          <Text>Имя</Text>
          <Input
            placeholder="Введите имя"
            inputMode="text"
            autoComplete="name"
            autoCapitalize="none"
            onChangeText={setFirstName}
            value={first_name}
          />
        </YStack>
        <YStack>
          <Text>Отчество</Text>
          <Input
            placeholder="Введите отчество"
            inputMode="text"
            autoComplete="name"
            autoCapitalize="none"
            onChangeText={setMiddleName}
            value={patronymic}
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
          <Text>Номер телефона</Text>
          <Input
            placeholder="Введите номер телефона"
            inputMode="tel"
            autoComplete="tel"
            autoCapitalize="none"
            onChangeText={setPhone}
            value={phone}
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
