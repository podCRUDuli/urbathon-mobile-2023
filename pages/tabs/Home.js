import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Button } from 'tamagui';

import CloseCrossIcon from '../../assets/close-cross.svg';
import MailIcon from '../../assets/mail.svg';
import { RequestsList } from '../../components/RequestsList';
import { UniversalView } from '../../components/UniversalView';

const HomePage = ({ navigation }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) =>
        isOpen ? (
          <TouchableOpacity onPress={() => setIsOpen(false)}>
            <CloseCrossIcon fill={tintColor} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsOpen(true)}>
            <MailIcon fill={tintColor} />
          </TouchableOpacity>
        ),
    });
  }, [navigation, isOpen]);

  return (
    <UniversalView>
      {/* <Button onPress={() => navigation.navigate('sign-in')}>
        Авторизоваться
      </Button> */}
      <RequestsList
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </UniversalView>
  );
};

export { HomePage };
