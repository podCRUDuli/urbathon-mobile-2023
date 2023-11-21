import { Button, Text } from 'tamagui';

import { useAuth } from '../../authProvider';
import { UniversalView } from '../../components/UniversalView';

const ProfilePage = ({ navigation }) => {
  const { state, api } = useAuth();

  return (
    <UniversalView>
      {state.user ? <Text>{state.user.email}</Text> : null}
      <Button
        onPress={() =>
          state.isAuthenticated ? api.logout() : navigation.navigate('sign-in')
        }>
        {state?.isAuthenticated ? 'Выйти' : 'Авторизоваться'}
      </Button>
    </UniversalView>
  );
};

export { ProfilePage };
