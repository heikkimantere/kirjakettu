import React from 'react';
import { StyleSheet, View } from 'react-native';
import FilterRow from './FilterRow';

interface SearchFiltersProps {
  booksOnly: boolean;
  onBooksOnlyChange: (value: boolean) => void;
  finnishOnly: boolean;
  onFinnishOnlyChange: (value: boolean) => void;
}

export default function SearchFilters({
  booksOnly,
  onBooksOnlyChange,
  finnishOnly,
  onFinnishOnlyChange,
}: SearchFiltersProps): JSX.Element {
  return (
    <View style={styles.filterContainer}>
      <View style={styles.filterRow}>
        <FilterRow
          label="Vain kirjat"
          value={booksOnly}
          onValueChange={onBooksOnlyChange}
        />
      </View>
      <View style={styles.separator} />
      <View style={styles.filterRow}>
        <FilterRow
          label="Vain suomi"
          value={finnishOnly}
          onValueChange={onFinnishOnlyChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterRow: {
    flex: 1,
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
});

