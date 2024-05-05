import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const db = firestore();

interface Todo {
  id: string;
  text: string;
}

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoText, setTodoText] = useState('');

  useEffect(() => {
    // Fetch todos from Firestore when the component mounts
    const unsubscribe = db.collection('todos').onSnapshot(snapshot => {
      const todosData: any = [];
      snapshot.forEach(doc => {
        todosData.push({ id: doc.id, text: doc.data().text });
      });
      setTodos(todosData);
    });

    // Unsubscribe from Firestore listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const addTodo = () => {
    if (todoText.trim() !== '') {
      db.collection('todos').add({ text: todoText })
        .then(() => setTodoText(''))
        .catch(error => console.error('Error adding todo: ', error));
    }
  };

  const removeTodo = (id: string) => {
    db.collection('todos').doc(id).delete()
      .catch(error => console.error('Error removing todo: ', error));
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <Text style={styles.todoText}>{item.text}</Text>
      <TouchableOpacity onPress={() => removeTodo(item.id)}>
        <Text style={{ ...styles.todoText, padding: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', color: 'white' }}>Delete</Text>
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
  },
});

export default App;