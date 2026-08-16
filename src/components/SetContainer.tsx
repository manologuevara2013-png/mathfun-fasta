import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { MathSet } from '../types';
import SetItem from './SetItem';

interface SetContainerProps {
  mathSet: MathSet;
  onItemPress?: (itemId: string) => void;
  animatingItems: Set<string>;
  isResult?: boolean;
}

const SetContainer: React.FC<SetContainerProps> = ({
  mathSet,
  onItemPress,
  animatingItems,
  isResult = false,
}) => {
  const itemsGrouped = useMemo(() => {
    const hundreds = mathSet.items.filter(item => item.value === 100);
    const tens = mathSet.items.filter(item => item.value === 10);
    const unities = mathSet.items.filter(item => item.value === 1);

    return { hundreds, tens, unities };
  }, [mathSet.items]);

  return (
    <ScrollView
      scrollEnabled={false}
      style={[styles.container, isResult && styles.resultContainer]}
    >
      {/* CENTENAS */}
      {itemsGrouped.hundreds.length > 0 && (
        <View style={styles.groupSection}>
          {itemsGrouped.hundreds.map(item => (
            <SetItem
              key={item.id}
              item={item}
              isAnimating={animatingItems.has(item.id)}
              onPress={() => onItemPress?.(item.id)}
            />
          ))}
        </View>
      )}

      {/* DECENAS */}
      {itemsGrouped.tens.length > 0 && (
        <View style={styles.groupSection}>
          {itemsGrouped.tens.map(item => (
            <SetItem
              key={item.id}
              item={item}
              isAnimating={animatingItems.has(item.id)}
              onPress={() => onItemPress?.(item.id)}
            />
          ))}
        </View>
      )}

      {/* UNIDADES */}
      {itemsGrouped.unities.length > 0 && (
        <View style={styles.groupSection}>
          {itemsGrouped.unities.map(item => (
            <SetItem
              key={item.id}
              item={item}
              isAnimating={animatingItems.has(item.id)}
              onPress={() => onItemPress?.(item.id)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginVertical: 10,
  },
  resultContainer: {
    backgroundColor: '#e8f5e9',
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  groupSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
  },
});

export default SetContainer;
