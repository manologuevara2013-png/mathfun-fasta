export type ItemType = 'apple' | 'star' | 'car' | 'animal';
export type AgeStage = 'STAGE_1_SETS' | 'STAGE_2_ARITHMETIC' | 'STAGE_3_ADVANCED';
export type OperationType = 'UNION' | 'DIFFERENCE' | 'MULTIPLICATION' | 'DIVISION';
export type ValueType = 1 | 10 | 100;

export interface SetItem {
  id: string;
  type: ItemType;
  value: ValueType;
  emoji: string;
  position?: { x: number; y: number };
}

export interface MathSet {
  id: string;
  name: string;
  items: SetItem[];
  maxCapacity?: number;
  category?: 'A' | 'B';
}

export interface ConceptMastery {
  classification: number;
  membership: number;
  cardinality: number;
  union: number;
  difference: number;
  multiplication: number;
  division: number;
}

export interface UserProgress {
  userId: string;
  name: string;
  age: number;
  currentStage: AgeStage;
  starsEarned: number;
  problemsSolved: number;
  lastSessionDate: string;
  conceptMastery: ConceptMastery;
  adaptiveMode: boolean;
  failureCount: number;
}

export interface MathProblem {
  id: string;
  stage: AgeStage;
  concept: 'classification' | 'membership' | 'cardinality' | 'union' | 'difference' | 'multiplication' | 'division';
  title: string;
  storyText: string;
  storyContextNumbers?: {
    num1?: number;
    num2?: number;
    initial?: number;
    result?: number;
  };
  initialSets: MathSet[];
  targetOperation: OperationType;
  expectedResult: number;
  difficulty: 'easy' | 'medium' | 'hard';
  allowsAssistedMode: boolean;
  hints?: string[];
}

export interface GameState {
  currentProblem: MathProblem | null;
  problemIndex: number;
  totalProblems: number;
  isAnswered: boolean;
  isCorrect: boolean;
  selectedAnswer: number | null;
  animatingItemId: string | null;
  assistedModeActive: boolean;
}

export interface CoordinatorStats {
  totalStudents: number;
  totalProblems: number;
  totalStars: number;
  averageAccuracy: number;
  studentStats: StudentStat[];
}

export interface StudentStat {
  studentId: string;
  name: string;
  age: number;
  starsEarned: number;
  problemsSolved: number;
  conceptMastery: ConceptMastery;
  lastActive: string;
}

export interface VoiceConfig {
  language: 'es-ES';
  rate: number;
  pitch: number;
  volume: number;
}

export interface ProblemContext {
  [key: string]: {
    [concept: string]: string[];
  };
}
