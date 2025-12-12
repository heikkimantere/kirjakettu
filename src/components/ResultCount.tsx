import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface ResultCountProps {
  count: number;
}

export default function ResultCount({ count }: ResultCountProps): JSX.Element {
  if (count === 0) {
    return null;
  }

  return (
    <View style={styles.resultCountContainer}>
      <Text style={styles.resultCountText}>
        Löytyi {count.toLocaleString('fi-FI')} tulosta
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  resultCountContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  resultCountText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
});

