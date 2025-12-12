import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getBookDetails } from '../services/finnaApi';
import { RootStackParamList } from '../../App';
import { FinnaRecord, FinnaRecordResponse } from '../types/finna';
import { getImageUrl } from '../utils/imageUtils';
import { getAvailability } from '../utils/availabilityUtils';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import BookImage from '../components/BookImage';
import BookMetadata from '../components/BookMetadata';
import AvailabilityList from '../components/AvailabilityList';
import BookSection from '../components/BookSection';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

interface DetailScreenProps {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
}

export default function DetailScreen({ route, navigation }: DetailScreenProps): JSX.Element {
  const { bookId, bookData } = route.params;
  const [details, setDetails] = useState<FinnaRecordResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookDetails();
  }, [bookId]);

  const loadBookDetails = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const data = await getBookDetails(bookId);
      console.log('API vastaus:', JSON.stringify(data, null, 2));
      setDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tietojen lataus epäonnistui');
      console.error('Virhe:', err);
    } finally {
      setLoading(false);
    }
  };

  // Hae record-data API-vastauksesta tai käytä bookDataa fallbackina
  const record: FinnaRecord = (details?.records && details.records.length > 0) 
    ? details.records[0] 
    : (bookData || {} as FinnaRecord);
  const imageUrl = details ? getImageUrl(details) : null;
  const availability = details ? getAvailability(details) : [];

  // Debug-logitus (poista myöhemmin)
  if (details && details.records && details.records.length > 0) {
    const rec = details.records[0];
    console.log('=== API VASTAUS SAATU ===');
    console.log('Records määrä:', details.records.length);
    console.log('Record ID:', rec.id);
    console.log('Record kentät:', Object.keys(rec).sort());
    console.log('\n=== KENTTIEN SISÄLLÖT ===');
    console.log('Title:', rec.title);
    console.log('Year:', rec.year);
    console.log('Authors:', rec.authors);
    console.log('Author (vanha):', rec.author);
    console.log('NonPresenterAuthors:', rec.nonPresenterAuthors);
    console.log('Presenters:', rec.presenters);
    console.log('Publishers:', rec.publishers);
    console.log('PublicationDates:', rec.publicationDates);
    console.log('Description:', rec.description);
    console.log('PhysicalDescriptions:', rec.physicalDescriptions);
    console.log('Formats:', rec.formats);
    console.log('Languages:', rec.languages);
    console.log('ISBNs:', rec.isbns);
    console.log('ISSN:', rec.issn);
    console.log('Series:', rec.series);
    console.log('Subjects:', rec.subjects);
    console.log('Notes:', rec.notes);
    console.log('Rating:', rec.rating);
    console.log('OnlineUrls:', rec.onlineUrls);
    console.log('URL:', rec.url);
    console.log('Images:', rec.images);
    console.log('ImageURLs:', rec.imageURLs);
    console.log('Buildings:', rec.buildings);
    console.log('Holdings:', rec.holdings);
    console.log('========================');
  } else if (details) {
    console.log('⚠️ Details löytyi, mutta records puuttuu tai on tyhjä:', details);
  } else {
    console.log('⚠️ Details on null');
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadBookDetails} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="dark" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <BookImage imageUrl={imageUrl} />

        <View style={styles.infoContainer}>
          <Text style={styles.title}>
            {record.title || 'Ei nimeä'}
          </Text>
          
          {!record.id && !bookData && (
            <BookSection title="">
              <Text style={styles.errorText}>
                ⚠️ Teoksen tietoja ei löytynyt. Tarkista konsoli debug-tietoja varten.
              </Text>
            </BookSection>
          )}

          <BookMetadata record={record} />
          <AvailabilityList availability={availability} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
  },
});
