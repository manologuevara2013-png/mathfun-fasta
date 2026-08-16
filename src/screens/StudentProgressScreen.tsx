import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserContext } from '../context/UserContext';

interface StudentProgressScreenProps {
  navigation: any;
}

const StudentProgressScreen: React.FC<StudentProgressScreenProps> = ({ navigation }) => {
  const { currentUser } = useUserContext();

  useEffect(() => {
    // Auto-regresar después de 5 segundos
    const timer = setTimeout(() => {
      navigation.navigate('StudentSelection');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  const getMessageByStars = (stars: number): string => {
    if (stars >= 10) return '¡Eres una estrella! 🌟';
    if (stars >= 8) return '¡Excelente trabajo! 🎉';
    if (stars >= 5) return '¡Muy bien! 👏';
    return '¡Sigue intentando! 💪';
  };

  const getMasteryColor = (value: number): string => {
    if (value >= 0.8) return '#4caf50';
    if (value >= 0.5) return '#ffc107';
    return '#ff9800';
  };

  const renderMasteryBar = (label: string, value: number) => (
    <View key={label} style={styles.masteryItem}>
      <Text style={styles.masteryLabel}>{label}</Text>
      <View style={styles.masteryBarContainer}>
        <View
          style={[
            styles.masteryBar,
            {
              width: `${value * 100}%`,
              backgroundColor: getMasteryColor(value),
            },
          ]}
        />
      </View>
      <Text style={styles.masteryValue}>{Math.round(value * 100)}%</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} scrollEnabled>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>¡Sesión Completada!</Text>
          <Text style={styles.message}>{getMessageByStars(currentUser.starsEarned)}</Text>
        </View>

        {/* STATS SECTION */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={styles.statLabel}>Estrellas</Text>
            <Text style={styles.statValue}>{currentUser.starsEarned}</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>📝</Text>
            <Text style={styles.statLabel}>Problemas</Text>
            <Text style={styles.statValue}>{currentUser.problemsSolved}</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🎯</Text>
            <Text style={styles.statLabel}>Etapa</Text>
            <Text style={styles.statValue}>
              {currentUser.currentStage === 'STAGE_1_SETS'
                ? '1'
                : currentUser.currentStage === 'STAGE_2_ARITHMETIC'
                ? '2'
                : '3'}
            </Text>
          </View>
        </View>

        {/* MASTERY SECTION */}
        <View style={styles.masterySection}>
          <Text style={styles.masteryTitle}>Dominio de Conceptos</Text>

          {renderMasteryBar('Clasificación', currentUser.conceptMastery.classification)}
          {renderMasteryBar('Pertenencia', currentUser.conceptMastery.membership)}
          {renderMasteryBar('Cardinalidad', currentUser.conceptMastery.cardinality)}
          {renderMasteryBar('Unión', currentUser.conceptMastery.union)}
          {renderMasteryBar('Resta', currentUser.conceptMastery.difference)}
          {renderMasteryBar('Multiplicación', currentUser.conceptMastery.multiplication)}
          {renderMasteryBar('División', currentUser.conceptMastery.division)}
        </View>

        {/* ACHIEVEMENTS */}
        <View style={styles.achievementsSection}>
          <Text style={styles.achievementsTitle}>Logros</Text>

          {currentUser.starsEarned >= 5 && (
            <View style={styles.achievement}>
              <Text style={styles.achievementEmoji}>🏅</Text>
              <Text style={styles.achievementText}>5 Estrellas Obtenidas</Text>
            </View>
          )}

          {currentUser.problemsSolved >= 10 && (
            <View style={styles.achievement}>
              <Text style={styles.achievementEmoji}>🎯</Text>
              <Text style={styles.achievementText}>10 Problemas Resueltos</Text>
            </View>
          )}

          {currentUser.conceptMastery.union > 0.5 && (
            <View style={styles.achievement}>
              <Text style={styles.achievementEmoji}>➕</Text>
              <Text style={styles.achievementText}>Dominó la Unión</Text>
            </View>
          )}

          {currentUser.conceptMastery.difference > 0.5 && (
            <View style={styles.achievement}>
              <Text style={styles.achievementEmoji}>➖</Text>
              <Text style={styles.achievementText}>Dominó la Resta</Text>
            </View>
          )}
        </View>

        {/* MESSAGE */}
        <View style={styles.messageSection}>
          <Text style={styles.messageTitle}>Próximos Pasos</Text>
          <Text style={styles.messageText}>
            ¡Sigue practicando para mejorar tu dominio de conceptos matemáticos!
          </Text>
        </View>

        {/* BUTTON */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => navigation.navigate('StudentSelection')}
        >
          <Text style={styles.buttonText}>Volver a Seleccionar</Text>
        </Pressable>

        <Text style={styles.autoReturnText}>Volviendo en 5 segundos...</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0052a3',
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: 8,
  },
  message: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
    gap: 6,
  },
  statEmoji: {
    fontSize: 32,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0052a3',
  },
  masterySection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  masteryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color:
