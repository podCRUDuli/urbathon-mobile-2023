import { Button } from 'tamagui';

import { UniversalView } from '../../components/UniversalView';

const ProfilePage = ({ navigation }) => {
  return (
    <UniversalView>
      <Button onPress={() => navigation.navigate('sign-in')}>
        Авторизоваться
      </Button>
    </UniversalView>
  );
};

export { ProfilePage };
