import { StyleSheet, Button } from 'react-native';

// import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router';

const handleButton = () => {
  router.push('/home');
};

export default function LandingPage() {
  // const colorScheme = useColorScheme();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Landing Page
      </Text>
      <Button
        onPress={handleButton}
        title="Continue"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
}

// index.tsx is the landing page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
