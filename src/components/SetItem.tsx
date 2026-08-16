import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { SetItem as SetItemType } from '../types';

interface SetItemProps {
  item: SetItemType;
  isAnimating?: boolean;
  onPress?: () => void;
}

const SetItem: React.FC<SetItemProps> = ({ item, isAnimating = false, onPress }) => {
  const getSizeStyle = () => {
    switch (item.value) {
      case 100:
        return styles.sizeLarge;
      case 10:
        return styles.sizeMedium;
      default:
        return styles.sizeSmall;
    }
  };

  const getLabel = () => {
    if (item.value === 1) return '';
    if (item.value === 10) return '10';
    if (item.value === 100) return '100';
    return '';
  };

  return (
    <Pressable
      style={[
        styles.container,
        getSizeStyle(),
        isAnimating && styles.animating,
      ]}
      onPress={onPress}
    >
      <Text style={styles.emoji}>{item.emoji}</Text>
      {item.value > 1 && (
        <Text style={styles.label}>{getLabel()}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#0052a3',
  },
  sizeSmall: {
    width: 50,
    height: 50,
  },
  sizeMedium: {
    width: 70,
    height: 70,
    borderWidth: 3,
    borderColor: '#d4af37',
  },
  sizeLarge: {
    width: 90,
    height: 90,
    borderWidth: 3,
    borderColor: '#d4af37',
  },
  emoji: {
    fontSize: 28,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0052a3',
    marginTop: 2,
  },
  animating: {
    opacity: 0.5,
  },
});

export default SetItem;
