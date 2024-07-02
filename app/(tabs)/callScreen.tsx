import { StyleSheet,} from 'react-native';

import { ThemedText } from '@/components/ThemedText';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function callScreen() {
  return (
    <SafeAreaView>
      <ThemedText>Testing Call SCreen</ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
