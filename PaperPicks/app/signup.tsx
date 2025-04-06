// app/signup.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:5001/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Signup successful — go to login
        router.push('/');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/')}>
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F4F4F9',
  },
  title: {
    fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#333',
  },
  input: {
    width: '100%', padding: 12, marginVertical: 10, borderWidth: 1,
    borderColor: '#ccc', borderRadius: 8, backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50', paddingVertical: 12, borderRadius: 8,
    marginVertical: 15, alignItems: 'center', width: '100%',
  },
  buttonText: {
    fontSize: 18, color: '#fff', fontWeight: 'bold',
  },
  linkText: {
    color: '#4CAF50', fontSize: 16, marginTop: 10, textDecorationLine: 'underline',
  },
});

export default Signup;
