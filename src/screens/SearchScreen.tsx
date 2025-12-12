import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ListRenderItem,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { searchBooks } from '../services/finnaApi';
import { RootStackParamList } from '../../App';
import { FinnaRecord } from '../types/finna';

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;

interface SearchScreenProps {
  navigation: SearchScreenNavigationProp;
}

export default function SearchScreen({ navigation }: SearchScreenProps): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<FinnaRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultCount, setResultCount] = useState<number>(0);

  const handleSearch = async (): Promise<void> => {
    if (!searchQuery.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await searchBooks(searchQuery);
      setResults(data.records || []);
      setResultCount(data.resultCount || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Haku epäonnistui');
      console.error('Hakuvirhe:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookPress = (item: FinnaRecord): void => {
    if (item.id) {
      navigation.navigate('Details', { bookId: item.id, bookData: item });
    }
  };

  const renderBookItem: ListRenderItem<FinnaRecord> = ({ item }) => {
    const title = item.title || 'Ei nimeä';
    const author = item.author 
      ? (Array.isArray(item.author) ? item.author.join(', ') : item.author)
      : null;
    const year = item.year || null;

    return (
      <TouchableOpacity
        style={styles.bookItem}
        onPress={() => handleBookPress(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.bookTitle}>{title}</Text>
        {author && <Text style={styles.bookAuthor}>{author}</Text>}
        {year && <Text style={styles.bookYear}>Vuosi: {year}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" />
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kirjasto</Text>
        <Text style={styles.headerSubtitle}>Helmet-kirjastojen haku</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Hae teoksia..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[styles.searchButton, loading && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.searchButtonText}>Hae</Text>
          )}
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {resultCount > 0 && (
        <View style={styles.resultCountContainer}>
          <Text style={styles.resultCountText}>
            Löytyi {resultCount.toLocaleString('fi-FI')} tulosta
          </Text>
        </View>
      )}

      {results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderBookItem}
          keyExtractor={(item, index) => item.id || `item-${index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={true}
        />
      ) : !loading && searchQuery && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Ei tuloksia. Kokeile eri hakusanaa.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ecf0f1',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  searchButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#e74c3c',
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
  },
  resultCountContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  resultCountText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  bookItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
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
  bookTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  bookAuthor: {
    fontSize: 15,
    color: '#34495e',
    marginBottom: 4,
  },
  bookYear: {
    fontSize: 13,
    color: '#7f8c8d',
  },
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

