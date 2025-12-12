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
  Switch,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { searchBooks } from '../services/finnaApi';
import { RootStackParamList } from '../../App';
import { FinnaRecord, FinnaFormat } from '../types/finna';

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;

/**
 * Palauttaa emoji-ikonin teoksen tyypin perusteella
 */
const getFormatIcon = (formats: FinnaRecord['formats']): string => {
  if (!formats || formats.length === 0) {
    return '📄';
  }

  // Ota ensimmäinen format
  const format = formats[0];
  let formatValue = '';
  let formatTranslated = '';

  if (typeof format === 'object' && 'value' in format) {
    formatValue = (format as FinnaFormat).value || '';
    formatTranslated = (format as FinnaFormat).translated || '';
  } else if (typeof format === 'string') {
    formatValue = format;
  }

  // Tarkista format-arvo tai käännös
  const formatLower = formatValue.toLowerCase();
  const translatedLower = formatTranslated.toLowerCase();

  // Kirja
  if (formatLower.includes('book') || translatedLower.includes('kirja')) {
    return '📖';
  }
  // Lehti/Journal
  if (formatLower.includes('journal') || formatLower.includes('magazine') || 
      translatedLower.includes('lehti') || translatedLower.includes('aikakauslehti')) {
    return '📰';
  }
  // DVD/Video
  if (formatLower.includes('video') || formatLower.includes('dvd') || 
      translatedLower.includes('video') || translatedLower.includes('dvd')) {
    return '📀';
  }
  // CD/Äänite
  if (formatLower.includes('audio') || formatLower.includes('cd') || 
      translatedLower.includes('ääni') || translatedLower.includes('cd')) {
    return '💿';
  }
  // Peli/Game
  if (formatLower.includes('game') || translatedLower.includes('peli')) {
    return '🎮';
  }
  // E-kirja
  if (formatLower.includes('ebook') || formatLower.includes('e-kirja') || 
      translatedLower.includes('e-kirja') || translatedLower.includes('sähköinen')) {
    return '📱';
  }
  // Äänikirja
  if (formatLower.includes('audiobook') || translatedLower.includes('äänikirja')) {
    return '🎧';
  }
  // Kartta
  if (formatLower.includes('map') || translatedLower.includes('kartta')) {
    return '🗺️';
  }
  // Nuottikirja
  if (formatLower.includes('music') || formatLower.includes('score') || 
      translatedLower.includes('nuotti') || translatedLower.includes('musiikki')) {
    return '🎵';
  }

  // Oletus
  return '📄';
};

interface SearchScreenProps {
  navigation: SearchScreenNavigationProp;
}

export default function SearchScreen({ navigation }: SearchScreenProps): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<FinnaRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultCount, setResultCount] = useState<number>(0);
  const [booksOnly, setBooksOnly] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const performSearch = async (resetPage: boolean = true): Promise<void> => {
    if (!searchQuery.trim()) {
      return;
    }

    const limit = 100; // Haetaan 100 tulosta kerralla
    let currentPage: number;

    if (resetPage) {
      setLoading(true);
      setResults([]);
      setPage(1);
      currentPage = 1;
    } else {
      setLoadingMore(true);
      // Käytä seuraavaa sivua
      currentPage = page + 1;
    }
    setError(null);

    try {
      const data = await searchBooks(searchQuery, limit, booksOnly, currentPage);
      const newRecords = data.records || [];
      
      if (resetPage) {
        setResults(newRecords);
        setPage(1);
      } else {
        setResults(prev => [...prev, ...newRecords]);
        setPage(currentPage);
      }
      
      setResultCount(data.resultCount || 0);
      
      // Tarkista, onko lisää tuloksia saatavilla
      const totalLoaded = resetPage ? newRecords.length : results.length + newRecords.length;
      setHasMore(totalLoaded < (data.resultCount || 0));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Haku epäonnistui');
      console.error('Hakuvirhe:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = (): void => {
    performSearch(true);
  };

  const handleLoadMore = (): void => {
    if (!loadingMore && hasMore && !loading) {
      performSearch(false);
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
    const formatIcon = getFormatIcon(item.formats);

    return (
      <TouchableOpacity
        style={styles.bookItem}
        onPress={() => handleBookPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.titleRow}>
          <Text style={styles.bookTitle}>{title}</Text>
          <Text style={styles.formatIcon}>{formatIcon}</Text>
        </View>
        {author && <Text style={styles.bookAuthor}>{author}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" />
      <StatusBar barStyle="light-content" />
      
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

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Vain kirjat</Text>
        <Switch
          value={booksOnly}
          onValueChange={setBooksOnly}
          trackColor={{ false: '#e0e0e0', true: '#3498db' }}
          thumbColor={booksOnly ? '#fff' : '#f4f3f4'}
        />
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
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.loadMoreContainer}>
                <ActivityIndicator size="small" color="#3498db" />
                <Text style={styles.loadMoreText}>Ladataan lisää...</Text>
              </View>
            ) : null
          }
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
    backgroundColor: '#2c3e50',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
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
    padding: 8,
  },
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

