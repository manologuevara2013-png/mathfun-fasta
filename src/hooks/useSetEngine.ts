import { useState, useCallback } from 'react';
import { MathSet, SetItem, AgeStage } from '../types';

export const useSetEngine = (stage: AgeStage) => {
  const [sets, setSets] = useState<MathSet[]>([]);
  const [displaySets, setDisplaySets] = useState<MathSet[]>([]);
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());

  const createSet = useCallback((name: string, itemType: string, count: number) => {
    const id = `set_${Date.now()}`;
    const items: SetItem[] = Array.from({ length: count }, (_, i) => ({
      id: `item_${i}`,
      type: itemType as any,
      value: 1,
      emoji: getItemEmoji(itemType),
    }));

    const newSet: MathSet = {
      id,
      name,
      items,
      maxCapacity: 10,
    };

    setSets([...sets, newSet]);
    return newSet;
  }, [sets]);

  const regroupToTens = useCallback((set: MathSet): MathSet => {
    const unities = set.items.filter(item => item.value === 1).length;
    const tens = set.items.filter(item => item.value === 10).length;
    const hundreds = set.items.filter(item => item.value === 100).length;

    const totalUnities = unities + (tens * 10) + (hundreds * 100);
    const regroupedTens = Math.floor(totalUnities / 10);
    const remainingUnities = totalUnities % 10;

    const newItems: SetItem[] = [];
    
    for (let i = 0; i < Math.floor(regroupedTens / 10); i++) {
      newItems.push({
        id: `item_c${i}`,
        type: set.items[0].type,
        value: 100,
        emoji: set.items[0].emoji,
      });
    }
    
    for (let i = 0; i < regroupedTens % 10; i++) {
      newItems.push({
        id: `item_d${i}`,
        type: set.items[0].type,
        value: 10,
        emoji: set.items[0].emoji,
      });
    }
    
    for (let i = 0; i < remainingUnities; i++) {
      newItems.push({
        id: `item_u${i}`,
        type: set.items[0].type,
        value: 1,
        emoji: set.items[0].emoji,
      });
    }

    return {
      ...set,
      items: newItems,
    };
  }, []);

  const unpackForSubtraction = useCallback((set: MathSet, unitsNeeded: number): MathSet => {
    const unities = set.items.filter(item => item.value === 1).length;
    
    if (unities >= unitsNeeded) {
      return set;
    }

    const tens = set.items.filter(item => item.value === 10).length;
    if (tens === 0) {
      return set;
    }

    const newItems = set.items.filter(item => item.value !== 10 || set.items.indexOf(item) > 0);
    
    for (let i = 0; i < 10; i++) {
      newItems.push({
        id: `item_unpacked_${i}`,
        type: set.items[0].type,
        value: 1,
        emoji: set.items[0].emoji,
      });
    }

    return {
      ...set,
      items: newItems,
    };
  }, []);

  const performUnion = useCallback((setA: MathSet, setB: MathSet): MathSet => {
    const combinedItems = [...setA.items, ...setB.items];
    const result: MathSet = {
      id: `union_${Date.now()}`,
      name: 'Resultado',
      items: combinedItems,
    };

    const regrouped = regroupToTens(result);
    setAnimatingItems(new Set(combinedItems.map(item => item.id)));
    
    setTimeout(() => {
      setSets([...sets, regrouped]);
