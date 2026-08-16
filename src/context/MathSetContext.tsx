import React, { createContext, useContext, ReactNode } from 'react';
import { useSetEngine } from '../hooks/useSetEngine';
import { MathSet } from '../types';

interface MathSetContextType {
  sets: MathSet[];
  displaySets: MathSet[];
  animatingItems: Set<string>;
  createSet: (name: string, itemType: string, count: number) => MathSet;
  regroupToTens: (set: MathSet) => MathSet;
  performUnion: (setA: MathSet, setB: MathSet) => MathSet;
  performDifference: (setA: MathSet, setB: MathSet) => MathSet;
  performMultiplication: (factor1: number, factor2: number) => MathSet;
  performDivision: (dividend: number, divisor: number) => MathSet[];
  countItems: (set: MathSet) => number;
}

const MathSetContext = createContext<MathSetContextType | undefined>(undefined);

export const MathSetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const engine = useSetEngine('STAGE_2_ARITHMETIC');

  return (
    <MathSetContext.Provider value={engine}>
      {children}
    </MathSetContext.Provider>
  );
};

export const useMathSetContext = () => {
  const context = useContext(MathSetContext);
  if (!context) {
    throw new Error('useMathSetContext debe usarse dentro de MathSetProvider');
  }
  return context;
};
