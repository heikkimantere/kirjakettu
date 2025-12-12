import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = 'Ei tuloksia. Kokeile eri hakusanaa.' }: EmptyStateProps): JSX.Element {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#95a5a6',
    textAlign: 'center',
  },
});

