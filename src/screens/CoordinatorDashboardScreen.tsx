import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserContext } from '../context/UserContext';

interface CoordinatorDashboardScreenProps {
  navigation: any;
}

const CoordinatorDashboardScreen: React.FC<CoordinatorDashboardScreenProps> = ({
  navigation,
}) => {
  const { allUsers } = useUserContext();

  const stats = useMemo(() => {
    const totalStudents = allUsers.length;
    const totalProblems = allUsers.reduce((sum, user) => sum + user.problemsSolved, 0);
    const totalStars = allUsers.reduce((sum, user) => sum + user.starsEarned, 0);
    const averageAccuracy =
      totalProblems > 0
        ? Math.round((totalStars / (totalProblems * 0.7)) * 100)
        : 0;

    return {
      totalStudents,
      totalProblems,
      totalStars,
      averageAccuracy: Math.min(100, averageAccuracy),
    };
  }, [allUsers]);

  const getStageColor = (stage: string): string => {
    if (stage === 'STAGE_1_SETS') return '#4caf50';
    if (stage === 'STAGE_2_ARITHMETIC') return '#2196f3';
    return '#9c27b0';
  };

  const getStageLabel = (stage: string): string => {
    if (stage === 'STAGE_1_SETS') return 'Conjuntos';
    if (stage === 'STAGE_2_ARITHMETIC') return 'Aritmética';
    return 'Avanzado';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Panel de Coordinadora</Text>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.navigate('RoleSelection')}
          >
            <Text style={styles.backButtonText}>← Atrás</Text>
          </Pressable>
        </View>

        {/* OVERVIEW CARDS */}
        <View style={styles.overviewSection}>
          <View style={[styles.card, styles.card1]}>
            <Text style={styles.cardEmoji}>👥</Text>
            <Text style={styles.cardLabel}>Estudiantes</Text>
            <Text style={styles.cardValue}>{stats.totalStudents}</Text>
          </View>

          <View style={[styles.card, styles.card2]}>
            <Text style={styles.cardEmoji}>📝</Text>
            <Text style={styles.cardLabel}>Problemas</Text>
            <Text style={styles.cardValue}>{stats.totalProblems}</Text>
          </View>

          <View style={[styles.card, styles.card3]}>
            <Text style={styles.cardEmoji}>⭐</Text>
            <Text style={styles.cardLabel}>Estrellas</Text>
            <Text style={styles.cardValue}>{stats.totalStars}</Text>
          </View>

          <View style={[styles.card, styles.card4]}>
            <Text style={styles.cardEmoji}>📊</Text>
            <Text style={styles.cardLabel}>Precisión</Text>
            <Text style={styles.cardValue}>{stats.averageAccuracy}%</Text>
          </View>
        </View>

        {/* STUDENTS LIST */}
        <View style={styles.studentsSection}>
          <Text style={styles.sectionTitle}>Estudiantes</Text>

          {allUsers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No hay estudiantes registrados</Text>
            </View>
          ) : (
            allUsers.map(student => (
              <View key={student.userId} style={styles.studentRow}>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentAge}>{student.age} años</Text>
                  <View style={styles.stageBadge}>
                    <View
                      style={[
                        styles.stageDot,
                        { backgroundColor: getStageColor(student.currentStage) },
                      ]}
                    />
                    <Text style={styles.stageLabel}>
                      {getStageLabel(student.currentStage)}
                    </Text>
                  </View>
                </View>

                <View style={styles.studentStats}>
                  <View style={styles.statBox}>
                    <Text style={styles.statBoxLabel}>Estrellas</Text>
                    <Text style={styles.statBoxValue}>{student.starsEarned}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statBoxLabel}>Resueltos</Text>
                    <Text style={styles.statBoxValue}>{student.problemsSolved}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* CONCEPT MASTERY */}
        <View style={styles.masterySection}>
          <Text style={styles.sectionTitle}>Dominio Promedio de Conceptos</Text>

          {allUsers.length > 0 && (
            <>
              {[
                { label: 'Clasificación', key: 'classification' },
                { label: 'Pertenencia', key: 'membership' },
                { label:
