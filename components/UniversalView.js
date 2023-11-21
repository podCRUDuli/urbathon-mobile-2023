import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'tamagui';

const UniversalView = React.memo(
  ({ children, safe = false, xCenter = false, yCenter = false, ...props }) => {
    const insets = useSafeAreaInsets();

    return (
      <Stack
        pt={safe ? insets.top : 0}
        pb={safe ? insets.bottom : 0}
        pl={safe ? insets.left : 0}
        pr={safe ? insets.right : 0}
        justifyContent={yCenter ? 'center' : 'flex-start'}
        alignItems={xCenter ? 'center' : 'stretch'}
        backgroundColor="$backgroundStrong"
        flex={1}
        style={props}>
        {children}
      </Stack>
    );
  },
);

export { UniversalView };
