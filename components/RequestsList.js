import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sheet, YGroup, ListItem, Separator, YStack, H6 } from 'tamagui';

const RequestsList = React.memo(({ isOpen, setIsOpen }) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Sheet
        open={isOpen}
        snapPoints={[85]}
        onOpenChange={() => setIsOpen(false)}
        dismissOnSnapToBottom
        disableDrag
        themeInverse>
        <Sheet.Handle />
        <Sheet.Overlay backgroundColor="transparent" />
        <Sheet.ScrollView
          showsVerticalScrollIndicator={false}
          borderRadius={insets.bottom}
          borderBottomStartRadius={0}
          borderBottomEndRadius={0}
          borderBottomLeftRadius={0}
          borderBottomRightRadius={0}
          backgroundColor="$background"
          bordered
          stickyHeaderIndices={[0]}>
          <YStack
            h={insets.bottom * 2}
            justifyContent="center"
            alignItems="center"
            backgroundColor="$background">
            <H6>Мои обращения</H6>
          </YStack>
          <YStack backgroundColor="$background">
            <YGroup
              separator={<Separator />}
              backgroundColor="$background"
              bordered>
              <YGroup.Item>
                <ListItem
                  pressTheme
                  title="Нет горячей воды"
                  borderRadius={0}
                  backgroundColor="$backgroundStrong"
                />
              </YGroup.Item>
              <YGroup.Item>
                <ListItem
                  pressTheme
                  title="Отопление не включают уже больше недели"
                  backgroundColor="$backgroundStrong"
                />
              </YGroup.Item>
              <YGroup.Item>
                <ListItem
                  pressTheme
                  title="Проблема с вентиляцией"
                  backgroundColor="$backgroundStrong"
                />
              </YGroup.Item>
              <YGroup.Item>
                <ListItem
                  pressTheme
                  title="Мусор на детской площадке"
                  backgroundColor="$backgroundStrong"
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
