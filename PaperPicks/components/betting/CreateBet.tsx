import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';
import showAlert from '@/utils/showAlert';
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

export function CreateBet() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [odds, setOdds] = useState('');
  const [type, setType] = useState('');

  const handleCreateBet = async () => {
    if (!title || !description || !odds || !type) {
      showAlert('Missing Fields', 'Please fill in all fields before submitting.');
      return;
    }

    try {
      const userID = userData?.userID;
      if (!userID) {
        showAlert('Error', 'User not found. Please log in again.');
        return;
      }

      const betData = {
        userID,
        title,
        description,
        odds: parseFloat(odds),
        type,
      };

      const response = await fetch('http://localhost:5001/betting/createBet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(betData),
      });

      if (response.ok) {
        showAlert('Success', 'Bet created successfully!');
        setTitle('');
        setDescription('');
        setOdds('');
        setType('');
      } else {
        const err = await response.json();
        showAlert('Error', err.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Create bet error:', error);
      showAlert('Error', 'Network or server error occurred');
    }
  };

  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const username = await AsyncStorage.getItem('username');

        if (!username) {
          console.error('Username not found');
          return;
        }

        const response = await fetch(`http://localhost:5001/userProfile?username=${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data: UserData = await response.json();
          setUserData(data); // Store the fetched user data
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile(); // Fetch user profile when the component mounts
  }, []);

  return (
    <View style={styles.bettingContainer}>
      <Text style={styles.title}>Create a New Bet</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#A9A9A9"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input]}
        placeholder="Description"
        placeholderTextColor="#A9A9A9"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Odds / Multiplier"
        placeholderTextColor="#A9A9A9"
        value={odds}
        onChangeText={setOdds}
        keyboardType="numeric"
      />

      <View style={styles.pickerContainer}></View>

      <RNPickerSelect
        value={type}
        onValueChange={(value) => setType(value)}
        items={[
          { label: 'Moneyline', value: 'moneyline' },
          { label: 'Spread', value: 'spread' },
          { label: 'Prop', value: 'prop' },
          { label: 'Please select a bet type', value: '' },
        ]}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateBet}>
        <Text style={styles.buttonText}>Create Bet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bettingContainer: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
  },
  pickerLabel: {
    padding: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
