import React from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';

interface BookFilterProps {
  booksOnly: boolean;
  onValueChange: (value: boolean) => void;
}

export default function BookFilter({ booksOnly, onValueChange }: BookFilterProps): JSX.Element {
  return (
    <View style={styles.filterContainer}>
      <Text style={styles.filterLabel}>Vain kirjat</Text>
      <Switch
        value={booksOnly}
        onValueChange={onValueChange}
        trackColor={{ false: '#e0e0e0', true: '#3498db' }}
        thumbColor={booksOnly ? '#fff' : '#f4f3f4'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterLabel: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
});

