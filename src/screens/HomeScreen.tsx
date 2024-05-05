import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

const db = firestore();

interface Todo {
  id: string;
  text: string;
}

const HomeScreen = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoText, setTodoText] = useState('');
  const navigation = useNavigation();
  const user = useUser();
  

  useEffect(() => {
    // Fetch todos from Firestore when the component mounts
    if (!user) {
      return;
    }
    const unsubscribe = db.collection('todos')
      .where('userId', '==', user.uid)
      .onSnapshot(querySnapshot => {
        const todos: Todo[] = [];
        querySnapshot.forEach(doc => {
          todos.push({
            id: doc.id,
            text: doc.data().text,
          });
        });
        setTodos(todos);
      });
  
    // Unsubscribe from Firestore listener when the component unmounts
    return () => unsubscribe();
  }, [user]);

  const addTodo = () => {
    if (todoText.trim() !== '') {
      db.collection('todos').add({
        text: todoText,
        userId: user.uid, // Associate the todo with the logged-in user
      })
      .then(() => setTodoText(''))
      .catch(error => console.error('Error adding todo: ', error));
    }
  };
  

  const removeTodo = (id: string) => {
    db.collection('todos').doc(id).delete()
      .then(() => console.log('Todo deleted successfully'))
      .catch(error => console.error('Error removing todo: ', error));
  };
  

  const logout = async () => {
    // Implement logout functionality here
    await Auth().signOut();
    console.log('Logged out successfully!');
    // Navigate to login screen
    navigation.navigate('Login');
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={{...styles.todoItem, alignItems:'flex-start'}}>
      <View style={{ flex: 1}}>
        <Text style={styles.todoText}>{item.text}</Text>
      </View>
      <TouchableOpacity onPress={() => removeTodo(item.id)}>
        <Text style={{ ...styles.todoText, padding: 5, borderRadius: 5, backgroundColor: 'red', color: 'white' }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>Todo App</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add Todo"
          value={todoText}
          onChangeText={setTodoText}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      {todos.length > 0 ? (
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text>No todos found.</Text>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  todoItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoText: {
    fontSize: 18,
    flexWrap: 'wrap',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;