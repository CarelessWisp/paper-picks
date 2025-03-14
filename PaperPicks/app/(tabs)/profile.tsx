import { StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

// tab five (bottom right)
export default function ProfileScreen() {

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Profile
      </Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

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
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',  // Green background for the button
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#fff',  // White text color
    fontWeight: 'bold',
  },
});
