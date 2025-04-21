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

// tab two page
export default function BettingScreen() {
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

  return isMobile ? (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Betting</Text>
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
          <CreateBet />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Betting</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <CreateBet />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 25,
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
