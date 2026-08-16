import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserContext } from '../context/UserContext';
import { useMathSetContext } from '../context/MathSetContext';
import { useVoiceSynthesis } from '../hooks/useVoiceSynthesis';
import SetContainer from '../components/SetContainer';
import { ProblemGenerator } from '../services/ProblemGenerator';
import { MathProblem } from '../types';

interface GameScreenProps {
  navigation: any;
}

const GameScreen: React.FC<GameScreenProps> = ({ navigation }) => {
  const { currentUser, updateUserProgress, updateConceptMastery } = useUserContext();
  const { speak, speakProblemSequence, speakFeedback } = useVoiceSynthesis();
  const mathSetContext = useMathSetContext();

  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [problemIndex, setProblemIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [problemsCompleted, setProblemsCompleted] = useState(0);

  useEffect(() => {
    if (currentUser) {
      const generator = new ProblemGenerator();
      const problem = generator.generateProblem(currentUser.currentStage, problemIndex);
      setCurrentProblem(problem);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowHint(false);

      // Leer el problema en voz alta
      if (problem.storyText) {
        speakProblemSequence(problem.storyText, `¿Cuál es la respuesta?`);
      }
    }
  }, [problemIndex, currentUser]);

  const handleAnswer = async (answer: number) => {
    if (!currentProblem || isAnswered) return;

    setSelectedAnswer(answer);
    const correct = answer === currentProblem.expectedResult;
    setIsCorrect(correct);
    setIsAnswered(true);

    // Feedback de voz
    await speakFeedback(correct, currentProblem.expectedResult);

    // Actualizar progreso
    if (correct) {
      const newStarsEarned = currentUser!.starsEarned + 1;
      const newProblemsSolved = currentUser!.problemsSolved + 1;

      await updateUserProgress(currentUser!.userId, {
        starsEarned: newStarsEarned,
        problemsSolved: newProblemsSolved,
      });

      await updateConceptMastery(currentUser!.userId, currentProblem.concept as any, 0.1);

      setProblemsCompleted(prev => prev + 1);

      // Avanzar automáticamente en 2.5 segundos
      setTimeout(() => {
        if (problemsCompleted >= 4) {
          navigation.navigate('StudentProgress');
        } else {
          setProblemIndex(prev => prev + 1);
        }
      }, 2500);
    }
  };

  const handleHint = () => {
    if (currentProblem && currentProblem.hints) {
      const hint = currentProblem.hints[0];
      speak(hint);
      setShowHint(true);
    }
  };

  const handleExit = () => {
    Alert.alert(
      'Salir del Juego',
      '¿Estás seguro que quieres salir?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Salir',
          onPress: () => navigation.navigate('RoleSelection'),
          style: 'destructive',
        },
      ]
    );
  };

  if (!currentUser || !currentProblem) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Cargando problema...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.studentName}>{currentUser.name}</Text>
          <Text style={styles.statsText}>⭐ {currentUser.starsEarned} | 📝 {currentUser.problemsSolved}</Text>
        </View>
        <Pressable style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.exitButtonText}>✕</Text>
        </Pressable>
      </View>

      {/* PROBLEM TITLE */}
      <View style={styles.problemSection}>
        <Text style={styles.problemTitle}>{currentProblem.title}</Text>
        <Text style={styles.problemStory}>{currentProblem.storyText}</Text>
      </View>

      {/* SETS VISUALIZATION */}
      <View style={styles.setsSection}>
        {currentProblem.initialSets.map((set, index) => (
          <SetContainer
            key={set.id}
            mathSet={set}
            animatingItems={mathSetContext.animatingItems}
          />
        ))}
      </View>

      {/* ANSWER SECTION */}
      <View style={styles.answerSection}>
        <Text style={styles.answerLabel}>¿Cuál es la respuesta?</Text>

        <View style={styles.answerOptions}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <Pressable
              key={num}
              style={[
                styles.answerButton,
                selectedAnswer === num && (isCorrect ? styles.correctAnswer : styles.wrongAnswer),
              ]}
              onPress={() => handleAnswer(num)}
              disabled={isAnswered}
            >
              <Text style={styles.answerButtonText}>{num}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* FEEDBACK */}
      {isAnswered && (
        <View style={[styles.feedbackSection, isCorrect ? styles.correctFeedback : styles.wrongFeedback]}>
          <Text style={styles.feedbackEmoji}>{isCorrect ? '✅' : '❌'}</Text>
          <Text style={styles.feedbackText}>
            {isCorrect ? '¡Muy bien!' : `La respuesta es ${currentProblem.expectedResult}`}
          </Text>
        </View>
      )}

      {/* HINT BUTTON */}
      {!isAnswered && (
        <Pressable style={styles.hintButton} onPress={handleHint}>
          <Text style={styles.hintButtonText}>💡 Pista</Text>
        </Pressable>
      )}

      {/* SHOW HINT */}
      {showHint && (
        <View style={styles.hintBox}>
          <Text style={styles.hintText}>{currentProblem.hints?.[0]}</Text>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#d4af37',
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  statsText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
  },
  exitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff5252',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  problemSection: {
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  problemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: 8,
  },
  problemStory: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  setsSection: {
    maxHeight: 140,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  answerSection: {
    marginVertical: 12,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: 8,
  },
  answerOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  answerButton: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0052a3',
  },
  answerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color:
