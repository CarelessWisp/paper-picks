import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { CreateBet } from '@/components/betting/CreateBet';
import { ScrollView } from 'react-native-gesture-handler';
import { ViewBets } from '@/components/betting/ViewBets';

// tab two page
export default function BettingScreen() {
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

  const Content = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Betting</Text>
      <View style={styles.separator} />
      <ViewBets />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <CreateBet />
    </View>
  );

  return isMobile ? (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <Content />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      <Content />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  separator: { marginVertical: 12, height: 1, width: '100%' },
});
