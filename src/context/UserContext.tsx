import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, AgeStage, ConceptMastery } from '../types';

interface UserContextType {
  currentUser: UserProgress | null;
  allUsers: UserProgress[];
  setCurrentUser: (user: UserProgress) => void;
  createUser: (name: string, age: number) => Promise<UserProgress>;
  loadUsers: () => Promise<void>;
  updateUserProgress: (userId: string, updates: Partial<UserProgress>) => Promise<void>;
  updateConceptMastery: (userId: string, concept: keyof ConceptMastery, value: number) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'fasta_math_users';

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProgress | null>(null);
  const [allUsers, setAllUsers] = useState<UserProgress[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const getAgeStage = (age: number): AgeStage => {
    if (age >= 7) return 'STAGE_3_ADVANCED';
    if (age >= 5) return 'STAGE_2_ARITHMETIC';
    return 'STAGE_1_SETS';
  };

  const createUser = async (name: string, age: number): Promise<UserProgress> => {
    const newUser: UserProgress = {
      userId: `user_${Date.now()}`,
      name,
      age,
      currentStage: getAgeStage(age),
      starsEarned: 0,
      problemsSolved: 0,
      lastSessionDate: new Date().toISOString(),
      conceptMastery: {
        classification: 0,
        membership: 0,
        cardinality: 0,
        union: 0,
        difference: 0,
        multiplication: 0,
        division: 0,
      },
      adaptiveMode: false,
      failureCount: 0,
    };

    const updated = [...allUsers, newUser];
    setAllUsers(updated);
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    return newUser;
  };

  const loadUsers = async () => {
    try {
      const stored = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        const users = JSON.parse(stored) as UserProgress[];
        setAllUsers(users);
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  const updateUserProgress = async (
    userId: string,
    updates: Partial<UserProgress>
  ): Promise<void> => {
    const updated = allUsers.map(user =>
      user.userId === userId
        ? {
            ...user,
            ...updates,
            lastSessionDate: new Date().toISOString(),
          }
        : user
    );

    setAllUsers(updated);
    if (currentUser?.userId === userId) {
      setCurrentUser(updated.find(u => u.userId === userId) || currentUser);
    }

    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
  };

  const updateConceptMastery = async (
    userId: string,
    concept: keyof ConceptMastery,
    value: number
  ): Promise<void> => {
    const user = allUsers.find(u => u.userId === userId);
    if (!user) return;

    const currentValue = user.conceptMastery[concept];
    const newValue = Math.min(1, (currentValue + value) / 2);

    await updateUserProgress(userId, {
      conceptMastery: {
        ...user.conceptMastery,
        [concept]: newValue,
      },
    });
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        allUsers,
        setCurrentUser,
        createUser,
        loadUsers,
        updateUserProgress,
        updateConceptMastery,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext debe usarse dentro de UserProvider');
  }
  return context;
};
