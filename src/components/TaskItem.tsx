// src/components/TaskItem.tsx

import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { Task } from '../api/todoApi';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onPress: () => void;
}

const TaskItem = React.memo<TaskItemProps>(({ task, onToggle, onDelete, onPress }) => {
  const formattedDate = React.useMemo(() => {
    return new Date(task.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [task.createdAt]);

  const truncatedDescription = React.useMemo(() => {
    if (!task.description) return '';
    return task.description.length > 50
      ? `${task.description.substring(0, 50)}...`
      : task.description;
  }, [task.description]);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
          onPress={onToggle}
          accessibilityLabel={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
          accessibilityHint="Toggle the completion status"
        >
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={[styles.title, task.completed && styles.titleCompleted]}>
            {task.title}
          </Text>
          {truncatedDescription ? (
            <Text style={styles.description}>{truncatedDescription}</Text>
          ) : null}
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          accessibilityLabel="Delete task"
          accessibilityHint="Remove this task permanently"
        >
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
});

TaskItem.displayName = 'TaskItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    minWidth: 44,
    minHeight: 44,
  },
  checkboxCompleted: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 16,
  },
});

export default TaskItem;