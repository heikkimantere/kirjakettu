import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FinnaRecord } from '../types/finna';
import { getFormatIcon } from '../utils/formatUtils';

interface BookListItemProps {
  item: FinnaRecord;
  onPress: (item: FinnaRecord) => void;
}

export default function BookListItem({ item, onPress }: BookListItemProps): JSX.Element {
  const title = item.title || 'Ei nimeä';
  const author = item.author 
    ? (Array.isArray(item.author) ? item.author.join(', ') : item.author)
    : null;
  const formatIcon = getFormatIcon(item.formats);

  return (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.titleRow}>
        <Text style={styles.bookTitle}>{title}</Text>
        <Text style={styles.formatIcon}>{formatIcon}</Text>
      </View>
      {author && <Text style={styles.bookAuthor}>{author}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bookItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
    marginRight: 8,
  },
  formatIcon: {
    fontSize: 20,
  },
  bookAuthor: {
    fontSize: 15,
    color: '#34495e',
    marginBottom: 4,
  },
});

