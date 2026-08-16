import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserContext } from '../context/UserContext';

interface StudentSelectionScreenProps {
  navigation: any;
}

const StudentSelectionScreen: React.FC<StudentSelectionScreenProps> = ({ navigation }) => {
  const { allUsers, setCurrentUser, createUser } = useUserContext();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');

  const handleCreateStudent = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre del estudiante');
      return;
    }
    if (!newAge.trim() || isNaN(Number(newAge))) {
      Alert.alert('Error', 'Por favor ingresa una edad válida');
      return;
    }

    const age = Number(newAge);
    if (age < 3 || age > 8) {
      Alert.alert('Error', 'La edad debe estar entre 3 y 8 años');
      return;
    }

    const newStudent = await createUser(newName, age);
    setCurrentUser(newStudent);
    setNewName('');
    setNewAge('');
    setShowCreateForm(false);
    navigation.navigate('Game');
  };

  const handleSelectStudent = (studentId: string) => {
    const student = allUsers.find(u => u.userId === studentId);
    if (student) {
      setCurrentUser(student);
      navigation.navigate('Game');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Selecciona un Estudiante</Text>
      </View>

      {allUsers.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No hay estudiantes creados</Text>
        </View>
      ) : (
        <FlatList
          data={allUsers}
          keyExtractor={item => item.userId}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.studentCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => handleSelectStudent(item.userId)}
            >
              <View style={styles.cardContent}>
                <Text style={styles.studentName}>{item.name}</Text>
                <Text style={styles.studentAge}>{item.age} años</Text>
                <Text style={styles.studentStats}>
                  ⭐ {item.starsEarned} | 📝 {item.problemsSolved}
                </Text>
              </View>
              <Text style={styles.cardArrow}>→</Text>
            </Pressable>
          )}
          scrollEnabled
        />
      )}

      {showCreateForm ? (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Crear Nuevo Estudiante</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre del estudiante"
            placeholderTextColor="#999"
            value={newName}
            onChangeText={setNewName}
          />

          <TextInput
            style={styles.input}
            placeholder="Edad (3-8)"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={newAge}
            onChangeText={setNewAge}
          />

          <View style={styles.formButtons}>
            <Pressable
              style={[styles.formButton, styles.createButton]}
              onPress={handleCreateStudent}
            >
              <Text style={styles.formButtonText}>Crear</Text>
            </Pressable>

            <Pressable
              style={[styles.formButton, styles.cancelButton]}
              onPress={() => {
                setShowCreateForm(false);
                setNewName('');
                setNewAge('');
              }}
            >
              <Text style={styles.formButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.createButton,
            styles.floatingButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => setShowCreateForm(true)}
        >
          <Text style={styles.createButtonText}>+ Nuevo Estudiante</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0052a3',
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.7,
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cardPressed: {
    opacity: 0.8,
  },
  cardContent: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0052a3',
    marginBottom: 4,
  },
  studentAge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  studentStats: {
    fontSize: 12,
    color: '#999',
  },
  cardArrow: {
    fontSize: 24,
    color: '#0052a3',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 12,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0052a3',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#4caf50',
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  formButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  floatingButton: {
    paddingVertical: 14,
    marginBottom: 20,
    marginTop: 12,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonPressed: {
    opacity: 0.8,
  },
});

export default StudentSelectionScreen;
