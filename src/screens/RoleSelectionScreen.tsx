import React from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface RoleSelectionScreenProps {
  navigation: any;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://via.placeholder.com/500x1000/0052a3/ffffff' }}
        style={styles.background}
      >
        <View style={styles.overlay}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>MathFun FASTA</Text>
            <Text style={styles.subtitle}>Matemáticas con Fe y Virtud</Text>
          </View>

          {/* CONTENT */}
          <View style={styles.content}>
            <Text style={styles.description}>
              Bienvenido a MathFun FASTA, una app educativa para aprender matemáticas de forma divertida.
            </Text>

            {/* ESTUDIANTE BUTTON */}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.studentButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => navigation.navigate('StudentSelection')}
            >
              <Text style={styles.buttonEmoji}>👧</Text>
              <Text style={styles.buttonText}>Soy Estudiante</Text>
              <Text style={styles.buttonSubtext}>Juega y aprende</Text>
            </Pressable>

            {/* COORDINADORA BUTTON */}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.coordinatorButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => navigation.navigate('CoordinatorDashboard')}
            >
              <Text style={styles.buttonEmoji}>👩‍🏫</Text>
              <Text style={styles.buttonText}>Soy Coordinadora</Text>
              <Text style={styles.buttonSubtext}>Ver estadísticas</Text>
            </Pressable>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Colegio FASTA Juan Pablo II</Text>
            <Text style={styles.footerText}>Mendoza, Argentina</Text>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0052a3',
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 82, 163, 0.85)',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  description: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  studentButton: {
    backgroundColor: '#4caf50',
  },
  coordinatorButton: {
    backgroundColor: '#ff9800',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonEmoji: {
    fontSize: 40,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonSubtext: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  footer: {
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.7,
  },
});

export default RoleSelectionScreen;
