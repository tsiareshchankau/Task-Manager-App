// src/screens/AddTask.tsx

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTodos } from '../hooks/useTodos';
import { RootStackParamList } from '../navigation/AppNavigator';

type AddTaskScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddTask'>;

export default function AddTask() {
  const navigation = useNavigation<AddTaskScreenNavigationProp>();
  const { addTask } = useTodos();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
    });

    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={handleCancel}
          style={styles.headerButton}
          accessibilityLabel="Cancel adding task"
          accessibilityHint="Go back without saving"
        >
          <Text style={styles.headerButtonText}>Cancel</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleCancel]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
            accessibilityLabel="Task title"
            accessibilityHint="Required field for the task title"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter task description (optional)"
            multiline
            textAlignVertical="top"
            accessibilityLabel="Task description"
            accessibilityHint="Optional field for additional task details"
          />

          <TouchableOpacity
            style={[styles.submitButton, !title.trim() && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!title.trim()}
            accessibilityLabel="Add task"
            accessibilityHint="Save the new task and go back"
          >
            <Text style={[styles.submitButtonText, !title.trim() && styles.submitButtonTextDisabled]}>
              Add Task
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fafafa',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 30,
    backgroundColor: '#fafafa',
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 44,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: '#999',
  },
  headerButton: {
    marginLeft: 16,
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
});