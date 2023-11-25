import { Dimensions } from 'react-native';
import {
  Button,
  Text,
  Circle,
  YStack,
  XStack,
  SizableText,
  Progress,
} from 'tamagui';

import { useAuth } from '../../authProvider';
import { UniversalView } from '../../components/UniversalView';

const ProfilePage = ({ navigation }) => {
  const { state, api } = useAuth();

  return (
    <UniversalView>
      <YStack
        space
        mt={10}>
        {state.user ? (
          <XStack
            space={10}
            backgroundColor="$background"
            borderWidth={1}
            borderColor
            borderRadius={10}
            padding={10}
            marginHorizontal={10}>
            <Circle
              width={100}
              height={100}
              backgroundColor="$borderColor"
              borderWidth={1}
            />
            <YStack>
              <YStack
                backgroundColor="$borderColor"
                alignSelf="flex-start"
                padding={5}
                borderRadius={5}>
                <Text fontWeight="bold">Фамилия</Text>
              </YStack>
              <XStack>
                <Text style={{ flex: 1, flexWrap: 'wrap' }}>
                  {state.user.last_name}
                </Text>
              </XStack>
              <YStack
                backgroundColor="$borderColor"
                alignSelf="flex-start"
                padding={5}
                borderRadius={5}>
                <Text fontWeight="bold">Имя</Text>
              </YStack>
              <XStack>
                <Text style={{ flex: 1, flexWrap: 'wrap' }}>
                  {state.user.first_name}
                </Text>
              </XStack>
              <YStack
                backgroundColor="$borderColor"
                alignSelf="flex-start"
                padding={5}
                borderRadius={5}>
                <Text fontWeight="bold">Отчество</Text>
              </YStack>
              <XStack>
                <Text style={{ flex: 1, flexWrap: 'wrap' }}>
                  {state.user.patronymic}
                </Text>
              </XStack>
              <YStack
                backgroundColor="$borderColor"
                padding={5}
                borderRadius={5}
                alignSelf="flex-start">
                <Text fontWeight="bold">Эл.адрес</Text>
              </YStack>
              <XStack>
                <Text style={{ flex: 1, flexWrap: 'wrap' }}>
                  {state.user.email}
                </Text>
              </XStack>
              <YStack
                backgroundColor="$borderColor"
                alignSelf="flex-start"
                padding={5}
                borderRadius={5}>
                <Text fontWeight="bold">Номер телефона</Text>
              </YStack>
              <XStack>
                <Text style={{ flex: 1, flexWrap: 'wrap' }}>
                  {state.user.phone}
                </Text>
              </XStack>
              <YStack
                backgroundColor="$borderColor"
                padding={5}
                borderRadius={5}
                alignSelf="flex-start">
                <Text fontWeight="bold">Прогресс</Text>
              </YStack>
              <Progress
                mt={5}
                width={80}
                value={60}
                children={null}
                backgroundColor="white"
                borderColor
                borderWidth={1}>
                <Progress.Indicator backgroundColor="$highlightColor" />
              </Progress>
            </YStack>
          </XStack>
        ) : null}
        <Button
          marginHorizontal={10}
          onPress={() =>
            state.isAuthenticated
              ? api.logout()
              : navigation.navigate('sign-in')
          }>
          {state?.isAuthenticated ? 'Выйти' : 'Авторизоваться'}
        </Button>
      </YStack>
    </UniversalView>
  );
};

export { ProfilePage };
