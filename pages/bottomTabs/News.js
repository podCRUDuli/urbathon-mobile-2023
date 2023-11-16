import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';

import CloseCrossIcon from '../../assets/close-cross.svg';
import MailIcon from '../../assets/mail.svg';
import { RequestsList } from '../../components/RequestsList';
import { UniversalView } from '../../components/UniversalView';

const NewsPage = ({ navigation }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) =>
        isOpen ? (
          <TouchableOpacity
            onPress={() => setIsOpen(false)}
            style={{ right: 15 }}>
            <CloseCrossIcon fill={tintColor} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setIsOpen(true)}
            style={{ right: 15 }}>
            <MailIcon fill={tintColor} />
          </TouchableOpacity>
        ),
    });
  }, [navigation, isOpen]);

  return (
    <UniversalView>
      <RequestsList
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </UniversalView>
  );
};

export { NewsPage };
