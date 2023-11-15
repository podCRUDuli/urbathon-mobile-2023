import React from 'react';
import { TouchableOpacity } from 'react-native';

import ArrowBackImg from '../assets/arrow-back.svg';

const GoBackBtn = React.memo(({ navigation, tintColor }) => (
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <ArrowBackImg
      fill={tintColor}
      width={24}
      height={24}
    />
  </TouchableOpacity>
));

export { GoBackBtn };
