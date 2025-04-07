import { useState } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';
import showAlert from '@/utils/showAlert';

export function CreateBet() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [odds, setOdds] = useState('');
  const [type, setType] = useState('');

  const handleCreateBet = () => {
    if (!title || !description || !odds || !type) {
      showAlert('Missing Fields', 'Please fill in all fields before submitting.');
      return;
    }

    const betData = {
      title,
      description,
      odds: parseFloat(odds),
      type,
    };

    // You would send `betData` to your backend or Firestore/DB here
    console.log('Creating bet:', betData);
    Alert.alert('Bet created successfully!');
  };

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
