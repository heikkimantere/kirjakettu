import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getBookDetails } from '../services/finnaApi';
import { RootStackParamList } from '../../App';
import { FinnaRecord, FinnaRecordResponse, FinnaBuilding, FinnaFormat, FinnaAuthor, FinnaPresenter, FinnaPresenters } from '../types/finna';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

interface DetailScreenProps {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
}

interface AvailabilityItem {
  location: string;
  availability: string;
  callnumber: string | null;
  dueDate: string | null;
  copies: number | null;
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

  const getImageUrl = (): string | null => {
    if (!details || !details.records || details.records.length === 0) return null;
    
    const record = details.records[0];
    
    // Kokeillaan eri kenttiä kuvan löytämiseksi
    if (record.images && Array.isArray(record.images) && record.images.length > 0) {
      const imageUrl = record.images[0];
      if (typeof imageUrl === 'string') {
        if (imageUrl.startsWith('http')) {
          return imageUrl;
        }
        return `https://api.finna.fi${imageUrl}`;
      }
    }
    
    // Vaihtoehtoisesti imageURLs-kenttä
    if (record.imageURLs && Array.isArray(record.imageURLs) && record.imageURLs.length > 0) {
      const imageUrl = record.imageURLs[0];
      if (typeof imageUrl === 'string') {
        if (imageUrl.startsWith('http')) {
          return imageUrl;
        }
        return `https://api.finna.fi${imageUrl}`;
      }
    }
    
    // Yritetään muodostaa kuva-URL ID:n perusteella
    if (record.id) {
      return `https://api.finna.fi/Cover/Show?id=${encodeURIComponent(record.id)}&index=0&size=large`;
    }
    
    return null;
  };

  const getAvailability = (): AvailabilityItem[] => {
    if (!details || !details.records || details.records.length === 0) return [];

    const record = details.records[0];
    const availability: AvailabilityItem[] = [];
    
    // holdings sisältää kirjastokohtaiset tiedot
    if (record.holdings && Array.isArray(record.holdings)) {
      record.holdings.forEach(holding => {
        const location = holding.location || holding.building || 'Tuntematon kirjasto';
        const avail = holding.availability || holding.status || 'unknown';
        
        availability.push({
          location: location,
          availability: avail,
          callnumber: holding.callnumber || holding.shelfnumber || null,
          dueDate: holding.dueDate || holding.returnDate || null,
          copies: holding.copies || null,
        });
      });
    }
    
    // Vaihtoehtoisesti buildings-kenttä
    if (availability.length === 0 && record.buildings) {
      const buildings = Array.isArray(record.buildings) ? record.buildings : [record.buildings];
      buildings.forEach(building => {
        if (typeof building === 'string') {
          availability.push({
            location: building,
            availability: 'unknown',
            callnumber: null,
            dueDate: null,
            copies: null,
          });
        } else if (building && typeof building === 'object' && 'translated' in building) {
          const b = building as FinnaBuilding;
          availability.push({
            location: b.translated,
            availability: 'unknown',
            callnumber: null,
            dueDate: null,
            copies: null,
          });
        }
      });
    }

    return availability;
  };

  const formatAvailability = (avail: string): string => {
    if (avail === 'available') return 'Saatavissa';
    if (avail === 'checkedout') return 'Lainassa';
    if (avail === 'onorder') return 'Tilauksessa';
    if (avail === 'missing') return 'Puuttuu';
    return avail;
  };

  // Hae record-data API-vastauksesta tai käytä bookDataa fallbackina
  const record: FinnaRecord = (details?.records && details.records.length > 0) 
    ? details.records[0] 
    : (bookData || {} as FinnaRecord);
  const imageUrl = details ? getImageUrl() : null;
  const availability = details ? getAvailability() : [];

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
    return (
      <SafeAreaView style={styles.container}>
        <ExpoStatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Ladataan tietoja...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ExpoStatusBar style="dark" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadBookDetails}
          >
            <Text style={styles.retryButtonText}>Yritä uudelleen</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="dark" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="contain"
              onError={() => console.log('Kuvaa ei voitu ladata')}
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>Kuvaa ei saatavilla</Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title}>
            {record.title || 'Ei nimeä'}
          </Text>
          
          {!record.id && !bookData && (
            <View style={styles.section}>
              <Text style={styles.errorText}>
                ⚠️ Teoksen tietoja ei löytynyt. Tarkista konsoli debug-tietoja varten.
              </Text>
            </View>
          )}

          {/* Tekijät */}
          {(record.authors && Array.isArray(record.authors) && record.authors.length > 0) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tekijät:</Text>
              {record.authors.map((author, idx) => (
                <Text key={idx} style={styles.sectionContent}>
                  {typeof author === 'string' ? author : (author as FinnaAuthor).name || JSON.stringify(author)}
                </Text>
              ))}
            </View>
          )}

          {record.author && !record.authors && (
            <Text style={styles.author}>
              {Array.isArray(record.author) 
                ? record.author.join(', ') 
                : record.author}
            </Text>
          )}

          {/* Esittäjät */}
          {record.presenters && (
            (Array.isArray(record.presenters) && record.presenters.length > 0) ||
            (typeof record.presenters === 'object' && !Array.isArray(record.presenters) && 
             'presenters' in record.presenters && (record.presenters as FinnaPresenters).presenters.length > 0)
          ) ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Esittäjät:</Text>
              {Array.isArray(record.presenters) ? (
                (record.presenters as FinnaPresenter[]).map((presenter, idx) => (
                  <Text key={idx} style={styles.sectionContent}>
                    {presenter.name || String(presenter)}
                    {presenter.role && ` (${presenter.role})`}
                  </Text>
                ))
              ) : (record.presenters as FinnaPresenters).presenters ? (
                (record.presenters as FinnaPresenters).presenters.map((presenter, idx) => (
                  <Text key={idx} style={styles.sectionContent}>
                    {presenter.name}
                    {presenter.role && ` (${presenter.role})`}
                  </Text>
                ))
              ) : null}
            </View>
          ) : null}

          {/* Muut tekijät */}
          {record.nonPresenterAuthors && record.nonPresenterAuthors.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Muut tekijät:</Text>
              {record.nonPresenterAuthors.map((author, idx) => (
                <Text key={idx} style={styles.sectionContent}>
                  {author.name || String(author)}
                  {author.role && ` (${author.role})`}
                  {author.type && ` - ${author.type}`}
                </Text>
              ))}
            </View>
          )}

          {/* Perustiedot */}
          <View style={styles.metadataRow}>
            {record.year && (
              <Text style={styles.metadataItem}>Vuosi: {record.year}</Text>
            )}
          </View>

          {record.publicationDates && (
            <Text style={styles.publicationDate}>
              Julkaistu: {Array.isArray(record.publicationDates) 
                ? record.publicationDates.join(', ') 
                : record.publicationDates}
            </Text>
          )}

          {/* Julkaisutiedot */}
          {record.publishers && (
            <Text style={styles.publisher}>
              Julkaisija: {Array.isArray(record.publishers) 
                ? record.publishers.join(', ') 
                : record.publishers}
            </Text>
          )}

          {/* Muodot */}
          {record.formats && record.formats.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Muoto:</Text>
              {record.formats.map((format, idx) => (
                <Text key={idx} style={styles.sectionContent}>
                  {typeof format === 'object' && 'translated' in format
                    ? (format as FinnaFormat).translated
                    : typeof format === 'object' && 'value' in format
                    ? (format as FinnaFormat).value
                    : String(format)}
                </Text>
              ))}
            </View>
          )}

          {/* Fyysinen kuvaus */}
          {record.physicalDescriptions && (
            (Array.isArray(record.physicalDescriptions) && record.physicalDescriptions.length > 0) ||
            (typeof record.physicalDescriptions === 'string' && record.physicalDescriptions.length > 0)
          ) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fyysinen kuvaus:</Text>
              <Text style={styles.sectionContent}>
                {Array.isArray(record.physicalDescriptions)
                  ? record.physicalDescriptions.join(', ')
                  : record.physicalDescriptions}
              </Text>
            </View>
          )}

          {/* Kielet */}
          {record.languages && record.languages.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Kieli:</Text>
              <Text style={styles.sectionContent}>
                {record.languages.map(lang => {
                  const langNames: Record<string, string> = {
                    'fin': 'Suomi',
                    'swe': 'Ruotsi',
                    'eng': 'Englanti',
                    'ger': 'Saksa',
                    'fra': 'Ranska',
                    'spa': 'Espanja',
                  };
                  return langNames[lang] || lang;
                }).join(', ')}
              </Text>
            </View>
          )}

          {/* ISBN/ISSN */}
          {(record.isbns && record.isbns.length > 0) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ISBN:</Text>
              <Text style={styles.sectionContent}>
                {record.isbns.join(', ')}
              </Text>
            </View>
          )}

          {(record.issn && record.issn.length > 0) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ISSN:</Text>
              <Text style={styles.sectionContent}>
                {record.issn.join(', ')}
              </Text>
            </View>
          )}

          {/* Sarjat */}
          {record.series && record.series.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sarjat:</Text>
              <Text style={styles.sectionContent}>
                {record.series.join(', ')}
              </Text>
            </View>
          )}

          {/* Muistiinpanot */}
          {record.notes && record.notes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Muistiinpanot:</Text>
              {record.notes.map((note, idx) => (
                <Text key={idx} style={styles.sectionContent}>
                  {note}
                </Text>
              ))}
            </View>
          )}

          {/* Arvostelut */}
          {record.rating && record.rating.count > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Arvostelut:</Text>
              <Text style={styles.sectionContent}>
                Keskiarvo: {record.rating.average.toFixed(1)} / 5.0
                {'\n'}Arvosteluja: {record.rating.count}
              </Text>
            </View>
          )}

          {/* Verkkolinkit */}
          {record.onlineUrls && record.onlineUrls.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Verkkolinkit:</Text>
              {record.onlineUrls.map((url, idx) => (
                <Text key={idx} style={[styles.sectionContent, styles.link]}>
                  {typeof url === 'string' ? url : (url as { url: string }).url || JSON.stringify(url)}
                </Text>
              ))}
            </View>
          )}

          {record.url && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>URL:</Text>
              <Text style={[styles.sectionContent, styles.link]}>
                {Array.isArray(record.url) 
                  ? record.url.join('\n') 
                  : record.url}
              </Text>
            </View>
          )}

          {record.subjects && record.subjects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Aiheet:</Text>
              {record.subjects.map((subject, idx) => (
                <Text key={idx} style={styles.sectionContent}>
                  {Array.isArray(subject) 
                    ? subject.join(' / ') 
                    : String(subject)}
                </Text>
              ))}
            </View>
          )}

          {record.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Kuvaus:</Text>
              <Text style={styles.sectionContent}>
                {Array.isArray(record.description) 
                  ? record.description.join('\n\n') 
                  : record.description}
              </Text>
            </View>
          )}

          {availability.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Saatavuus kirjastoissa:</Text>
              {availability.map((item, index) => (
                <View key={index} style={styles.availabilityItem}>
                  <View style={styles.availabilityHeader}>
                    <Text style={styles.availabilityLocation}>
                      {item.location}
                    </Text>
                    <View
                      style={[
                        styles.availabilityBadge,
                        item.availability === 'available' && styles.availabilityBadgeAvailable,
                        item.availability === 'checkedout' && styles.availabilityBadgeCheckedOut,
                      ]}
                    >
                      <Text style={styles.availabilityBadgeText}>
                        {formatAvailability(item.availability)}
                      </Text>
                    </View>
                  </View>
                  {item.callnumber && (
                    <Text style={styles.callNumber}>
                      Hyllypaikka: {item.callnumber}
                    </Text>
                  )}
                  {item.copies && (
                    <Text style={styles.callNumber}>
                      Kappaleita: {item.copies}
                    </Text>
                  )}
                  {item.dueDate && (
                    <Text style={styles.dueDate}>
                      Palautus: {item.dueDate}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {availability.length === 0 && (
            <View style={styles.section}>
              <Text style={styles.noAvailability}>
                Saatavuustietoja ei saatavilla
              </Text>
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  placeholderText: {
    fontSize: 16,
    color: '#95a5a6',
    fontStyle: 'italic',
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
  author: {
    fontSize: 18,
    color: '#34495e',
    marginBottom: 8,
  },
  year: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  metadataRow: {
    marginBottom: 8,
  },
  metadataItem: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  link: {
    color: '#3498db',
    textDecorationLine: 'underline',
  },
  publicationDate: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  publisher: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 15,
    color: '#34495e',
    lineHeight: 22,
  },
  availabilityItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  availabilityLocation: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  availabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#95a5a6',
  },
  availabilityBadgeAvailable: {
    backgroundColor: '#27ae60',
  },
  availabilityBadgeCheckedOut: {
    backgroundColor: '#e67e22',
  },
  availabilityBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  callNumber: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  dueDate: {
    fontSize: 14,
    color: '#e67e22',
    marginTop: 4,
    fontWeight: '500',
  },
  noAvailability: {
    fontSize: 15,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
});

