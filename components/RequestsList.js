import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Sheet,
  YGroup,
  ListItem,
  Separator,
  YStack,
  H6,
} from 'tamagui';

const RequestsList = React.memo(({ isOpen, setIsOpen }) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Sheet
        open={isOpen}
        snapPoints={[85, 50]}
        onOpenChange={() => setIsOpen(false)}
        themeInverse>
        <Sheet.Handle />
        <Sheet.ScrollView
          showsVerticalScrollIndicator={false}
          borderRadius={insets.bottom}
          backgroundColor="$backgroundStrong"
          bordered
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll
        >
          <YStack
              h={insets.bottom * 2}
              justifyContent="center"
              alignItems="center"
          backgroundColor="$backgroundStrong"
          >
              <H6>Мои обращения</H6>
          </YStack>
          <YStack pb={insets.bottom} >
            <YGroup separator={<Separator />} bordered borderRadius={insets.bottom}>
              <YGroup.Item>
                <ListItem
                  pressTheme
                  title="Нет горячей воды"
                />
              </YGroup.Item>
              <YGroup.Item>
                <ListItem
                  pressTheme
                  title="Отопление не включают уже больше недели"
                />
              </YGroup.Item>
              <YGroup.Item>
                <ListItem
                  pressTheme
                  title="Проблема с вентиляцией"
                />
              </YGroup.Item>
              <YGroup.Item>
                <ListItem
                  pressTheme
                  title="Мусор на детской площадке"
                />
              </YGroup.Item>
            </YGroup>
          </YStack>
        </Sheet.ScrollView>
      </Sheet>
    </>
  );
});

export { RequestsList };
