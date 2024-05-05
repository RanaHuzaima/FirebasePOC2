import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RNbcrypt from 'react-native-bcrypt';

const SignupScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (email === '' || password === '' || firstname === '' || lastname === '') {
      ToastAndroid.show('Please fill all fields', ToastAndroid.SHORT);
      return;
    }
    setIsLoading(true);
    try {
      // Hash the password
      RNbcrypt.hash(String(password), 10, async (error, hashedPassword) => {
        if (error) {
          setIsLoading(false);
          console.error(error);
          ToastAndroid.show(error.message, ToastAndroid.SHORT);
          return;
        }
        console.log('Hashed password:', hashedPassword);
        // Create user account
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        // Save user data to Firestore
        await firestore().collection('users').doc(user.uid).set({
          firstname: firstname,
          lastname: lastname,
          email: email,
          hashedPassword: hashedPassword, // Save hashed password
        });
        console.log('User account created & signed in!');
        setIsLoading(false);
        ToastAndroid.show('User account created & signed in!', ToastAndroid.SHORT);
        navigation.navigate('Login');
      });
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstname}
        onChangeText={setFirstname}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastname}
        onChangeText={setLastname}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
        {isLoading ? (
          <Text style={styles.buttonText}>Loading...</Text>
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: 'blue',
  },
});

export default SignupScreen;