import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  StatusBar,
  ListRenderItem,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { searchBooks } from '../services/finnaApi';
import { RootStackParamList } from '../../App';
import { FinnaRecord } from '../types/finna';
import SearchBar from '../components/SearchBar';
import BookFilter from '../components/BookFilter';
import BookListItem from '../components/BookListItem';
import ResultCount from '../components/ResultCount';
import EmptyState from '../components/EmptyState';
import LoadMoreFooter from '../components/LoadMoreFooter';
import ErrorMessage from '../components/ErrorMessage';

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;

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

  const renderBookItem: ListRenderItem<FinnaRecord> = ({ item }) => (
    <BookListItem item={item} onPress={handleBookPress} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" />
      <StatusBar barStyle="light-content" />
      
      <SearchBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearch={handleSearch}
        loading={loading}
      />

      <BookFilter
        booksOnly={booksOnly}
        onValueChange={setBooksOnly}
      />

      {error && <ErrorMessage message={error} />}

      <ResultCount count={resultCount} />

      {results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderBookItem}
          keyExtractor={(item, index) => item.id || `item-${index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={true}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<LoadMoreFooter loading={loadingMore} />}
        />
      ) : !loading && searchQuery && (
        <EmptyState />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 8,
  },
});
