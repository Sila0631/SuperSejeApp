import React, { useState } from 'react';
import {
  Button,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

function SignUpForm() {
  const auth = getAuth();

  // Instantiating state variables to be used in SignUpForm
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCompleted, setCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Define the user creation button, which triggers handleSubmit on press
  const renderButton = () => {
    return (
      <Button onPress={() => handleSubmit()} title="Create User" color="#007bff" />
    );
  };

  const handleSubmit = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
        // ...
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.inputField}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.inputField}
      />
      {errorMessage && <Text style={styles.error}>Error: {errorMessage}</Text>}
      {renderButton()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  inputField: {
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
    width: 300,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  header: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default SignUpForm;
