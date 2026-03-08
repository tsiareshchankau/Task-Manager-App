// src/screens/TaskDetails.tsx

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTodos } from '../hooks/useTodos';
import { RootStackParamList } from '../navigation/AppNavigator';

type TaskDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TaskDetails'>;
type TaskDetailsScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetails'>;

export default function TaskDetails() {
  const navigation = useNavigation<TaskDetailsScreenNavigationProp>();
  const route = useRoute<TaskDetailsScreenRouteProp>();
  const { id } = route.params;
  const { tasks, toggleTask, updateTask, deleteTask } = useTodos();

  const task = useMemo(() => tasks.find(t => t.id === id), [tasks, id]);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task?.title || '');
  const [editDescription, setEditDescription] = useState(task?.description || '');

  React.useEffect(() => {
    if (task) {
      setEditTitle(task.title);
      setEditDescription(task.description || '');
    }
  }, [task]);

  const handleToggle = () => {
    if (task) {
      toggleTask(task.id);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (task && editTitle.trim()) {
      updateTask(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    } else {
      Alert.alert('Error', 'Title is required');
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task?.title || '');
    setEditDescription(task?.description || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTask(id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!task) {
    return (
      <View style={styles.center}>
        <Text>Task not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        {isEditing ? (
          <>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.titleInput}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Task title"
              accessibilityLabel="Edit task title"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Task description"
              multiline
              textAlignVertical="top"
              accessibilityLabel="Edit task description"
            />

            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancelEdit}
                accessibilityLabel="Cancel editing"
                accessibilityHint="Discard changes and exit edit mode"
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton, !editTitle.trim() && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={!editTitle.trim()}
                accessibilityLabel="Save changes"
                accessibilityHint="Update the task with new information"
              >
                <Text style={[styles.saveButtonText, !editTitle.trim() && styles.saveButtonTextDisabled]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>{task.title}</Text>
            {task.description && (
              <Text style={styles.description}>{task.description}</Text>
            )}
            <Text style={styles.date}>Created: {formattedDate}</Text>

            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Status:</Text>
              <Text style={[styles.status, task.completed && styles.completedStatus]}>
                {task.completed ? 'Completed' : 'Pending'}
              </Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.button, styles.toggleButton]}
                onPress={handleToggle}
                accessibilityLabel={task.completed ? 'Mark as pending' : 'Mark as completed'}
                accessibilityHint="Toggle the completion status of this task"
              >
                <Text style={styles.toggleButtonText}>
                  {task.completed ? 'Mark Pending' : 'Mark Complete'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={handleEdit}
                accessibilityLabel="Edit task"
                accessibilityHint="Enter edit mode to modify task details"
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDelete}
                accessibilityLabel="Delete task"
                accessibilityHint="Permanently remove this task"
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 24,
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    color: '#333',
  },
  status: {
    fontSize: 16,
    color: '#FF9500',
    fontWeight: '600',
  },
  completedStatus: {
    color: '#34C759',
  },
  actionButtons: {
    gap: 12,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 44,
  },
  toggleButton: {
    backgroundColor: '#007AFF',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#FF9500',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#8E8E93',
    flex: 1,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#34C759',
    flex: 1,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: '#999',
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fafafa',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  backButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});