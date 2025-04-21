import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mongoose from 'mongoose';

interface UserData {
  userID: mongoose.Schema.Types.ObjectId;
  username: string;
  email: string;
  balance: number;
  amountWon: number;
  amountLost: number;
  wins: number;
  losses: number;
}

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        if (!username) return;

        const response = await fetch(`http://localhost:5001/userProfile?username=${username}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data: UserData = await response.json();
          setUserData(data);
          setEditedData(data);
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    router.push('/');
  };

  const handleDeleteAccount = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete your account?')) {
        deleteAccount();
      }
    } else {
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete your account?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteAccount() },
        ],
        { cancelable: true }
      );
    }
  };

  const deleteAccount = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) return;

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

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:5001/updateProfile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
      });

      if (response.ok) {
        setUserData(editedData);
        setIsEditing(false);
      } else {
        console.error('Failed to update user data');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleChange = (key: keyof UserData, value: string | number) => {
    setEditedData((prev) => prev && { ...prev, [key]: value });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.separator} />

      {userData && editedData ? (
        <View style={styles.profileCard}>
          {['username', 'email', 'balance', 'amountWon', 'amountLost', 'wins', 'losses'].map((key) => (
            <View key={key}>
              <Text style={styles.profileLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              {isEditing ? (
                <TextInput
                  style={styles.profileTextInput}
                  value={String(editedData[key as keyof UserData])}
                  onChangeText={(text) =>
                    handleChange(key as keyof UserData, isNaN(Number(text)) ? text : Number(text))
                  }
                />
              ) : (
                <Text style={styles.profileText}>
                    {String(userData[key as keyof UserData])}
                  </Text>
              )}
            </View>
          ))}
        </View>
      ) : (
        <Text>Loading...</Text>
      )}

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing((prev) => !prev)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Cancel' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      {isEditing && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  profileTextInput: {
    fontSize: 20,
    color: '#222',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  logoutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  editButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ff4d4f',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

