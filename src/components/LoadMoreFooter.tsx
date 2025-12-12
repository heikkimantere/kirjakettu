import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';

interface LoadMoreFooterProps {
  loading: boolean;
}

export default function LoadMoreFooter({ loading }: LoadMoreFooterProps): JSX.Element | null {
  if (!loading) {
    return null;
  }

  return (
    <View style={styles.loadMoreContainer}>
      <ActivityIndicator size="small" color="#3498db" />
      <Text style={styles.loadMoreText}>Ladataan lisää...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadMoreContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  loadMoreText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 8,
  },
});

