import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface BookSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function BookSection({ title, children }: BookSectionProps): JSX.Element {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
});

