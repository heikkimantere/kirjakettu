import React from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';

interface FilterRowProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export default function FilterRow({ label, value, onValueChange }: FilterRowProps): JSX.Element {
  return (
    <View style={styles.filterRow}>
      <Text style={styles.filterLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#e0e0e0', true: '#3498db' }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  filterLabel: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
});

