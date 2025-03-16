// /app/index.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';



const IndexPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  // Handle login logic
  const handleLogin = async () => {
     
    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Save the JWT token, for example, to AsyncStorage
        console.log('Login successful:', data.token);
        router.push('/home');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PaperPicks</Text>

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

      {error ? <Text style={styles.error}>{error}</Text> : null}


      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

    </View>
  );
};

// Styles for a clean and modern login page without an image background
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F4F4F9',  // Light background color
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',  // White background for input fields
  },
  button: {
    backgroundColor: '#4CAF50',  // Green color for the login button
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',  // Full width button
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  signupLink: {
    marginTop: 10,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
    color: '#4CAF50',  // Green color for the sign-up link
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default IndexPage;

