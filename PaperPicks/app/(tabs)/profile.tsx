import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';

// Define the type for the user data
interface UserData {
  username: string;
  email: string;
  balance: number;
  amountWon: number;
  amountLost: number;
  wins: number;
  losses: number;
}

// tab five (bottom right)
export default function ProfileScreen() {
  // Use the UserData interface to type the state
  const [userData, setUserData] =
    useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const username =
          await AsyncStorage.getItem('username');

        if (!username) {
          console.error('Username not found');
          return;
        }

        const response = await fetch(
          `http://localhost:5001/userProfile?username=${username}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.ok) {
          const data: UserData =
            await response.json();
          setUserData(data); // Store the fetched user data
        } else {
          console.error(
            'Failed to fetch user profile',
          );
        }
      } catch (error) {
        console.error(
          'Error fetching user profile:',
          error,
        );
      }
    };
    

    fetchUserProfile(); // Fetch user profile when the component mounts
  }, []);

  const handleLogout = () => {
    router.push('/'); // Navigate to the login page or home page
  };

  const handleDeleteAccount = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      );
  
      if (confirmed) {
        deleteAccount(); // call the actual deletion logic
      }
    } else {
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete your account? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deleteAccount(),
          },
        ],
        { cancelable: true }
      );
    }
  };
  
  const deleteAccount = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      console.log(username)
      if (!username) {
        console.error('Username not found.');
        return;
      }
  
      const response = await fetch(`http://localhost:5001/deleteAccount`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
  
      if (response.ok) {
        await AsyncStorage.clear();
        router.replace('/');
      } else {
        console.error('Failed to delete account.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };
    
  return (
    <ScrollView
      contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.separator} />

      {userData ? (
        <View style={styles.profileCard}>
          <Text style={styles.profileLabel}>
            Username
          </Text>
          <Text style={styles.profileText}>
            {userData.username}
          </Text>

          <Text style={styles.profileLabel}>
            Email
          </Text>
          <Text style={styles.profileText}>
            {userData.email}
          </Text>

          <Text style={styles.profileLabel}>
            Balance
          </Text>
          <Text style={styles.profileText}>
            ${userData.balance}
          </Text>

          <Text style={styles.profileLabel}>
            Amount Won
          </Text>
          <Text style={styles.profileText}>
            ${userData.amountWon}
          </Text>

          <Text style={styles.profileLabel}>
            Amount Lost
          </Text>
          <Text style={styles.profileText}>
            ${userData.amountLost}
          </Text>

          <Text style={styles.profileLabel}>
            Wins
          </Text>
          <Text style={styles.profileText}>
            {userData.wins}
          </Text>

          <Text style={styles.profileLabel}>
            Losses
          </Text>
          <Text style={styles.profileText}>
            {userData.losses}
          </Text>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>
          Logout
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  separator: {
    height: 2,
    width: '80%',
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 15,
  },
  profileLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 10,
  },
  profileText: {
    fontSize: 20,
    color: '#222',
    marginBottom: 5,
  },
  logoutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ff4d4f',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },  
});
