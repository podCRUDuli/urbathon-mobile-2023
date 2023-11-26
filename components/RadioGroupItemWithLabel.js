import { Label, RadioGroup, XStack, Text } from 'tamagui';

import { formatCountVotes } from '../utils/format';

const RadioGroupItemWithLabel = (props) => {
  return (
    <XStack justifyContent="space-between">
      <XStack space="$4">
        <RadioGroup.Item value={props.value}>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <Label>{props.label}</Label>
      </XStack>
      <Text>{formatCountVotes(props.votes, props.totalVotes)}</Text>
    </XStack>
  );
};

export { RadioGroupItemWithLabel };
