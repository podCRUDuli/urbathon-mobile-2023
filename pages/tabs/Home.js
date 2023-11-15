import { Button } from 'tamagui';

import { UniversalView } from '../../components/UniversalView';

const HomePage = ({ navigation }) => {
  return (
    <UniversalView>
      <Button onPress={() => navigation.navigate('sign-in')}>
        Авторизоваться
      </Button>
    </UniversalView>
  );
};

export { HomePage };
