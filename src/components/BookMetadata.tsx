import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FinnaRecord, FinnaFormat, FinnaAuthor, FinnaPresenter, FinnaPresenters } from '../types/finna';
import BookSection from './BookSection';

interface BookMetadataProps {
  record: FinnaRecord;
}

export default function BookMetadata({ record }: BookMetadataProps): JSX.Element {
  return (
    <>
      {/* Tekijät */}
      {(record.authors && Array.isArray(record.authors) && record.authors.length > 0) && (
        <BookSection title="Tekijät:">
          {record.authors.map((author, idx) => (
            <Text key={idx} style={styles.sectionContent}>
              {typeof author === 'string' ? author : (author as FinnaAuthor).name || JSON.stringify(author)}
            </Text>
          ))}
        </BookSection>
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
        <BookSection title="Esittäjät:">
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
        </BookSection>
      ) : null}

      {/* Muut tekijät */}
      {record.nonPresenterAuthors && record.nonPresenterAuthors.length > 0 && (
        <BookSection title="Muut tekijät:">
          {record.nonPresenterAuthors.map((author, idx) => (
            <Text key={idx} style={styles.sectionContent}>
              {author.name || String(author)}
              {author.role && ` (${author.role})`}
              {author.type && ` - ${author.type}`}
            </Text>
          ))}
        </BookSection>
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
        <BookSection title="Muoto:">
          {record.formats.map((format, idx) => (
            <Text key={idx} style={styles.sectionContent}>
              {typeof format === 'object' && 'translated' in format
                ? (format as FinnaFormat).translated
                : typeof format === 'object' && 'value' in format
                ? (format as FinnaFormat).value
                : String(format)}
            </Text>
          ))}
        </BookSection>
      )}

      {/* Fyysinen kuvaus */}
      {record.physicalDescriptions && (
        (Array.isArray(record.physicalDescriptions) && record.physicalDescriptions.length > 0) ||
        (typeof record.physicalDescriptions === 'string' && record.physicalDescriptions.length > 0)
      ) && (
        <BookSection title="Fyysinen kuvaus:">
          <Text style={styles.sectionContent}>
            {Array.isArray(record.physicalDescriptions)
              ? record.physicalDescriptions.join(', ')
              : record.physicalDescriptions}
          </Text>
        </BookSection>
      )}

      {/* Kielet */}
      {record.languages && record.languages.length > 0 && (
        <BookSection title="Kieli:">
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
        </BookSection>
      )}

      {/* ISBN/ISSN */}
      {(record.isbns && record.isbns.length > 0) && (
        <BookSection title="ISBN:">
          <Text style={styles.sectionContent}>
            {record.isbns.join(', ')}
          </Text>
        </BookSection>
      )}

      {(record.issn && record.issn.length > 0) && (
        <BookSection title="ISSN:">
          <Text style={styles.sectionContent}>
            {record.issn.join(', ')}
          </Text>
        </BookSection>
      )}

      {/* Sarjat */}
      {record.series && record.series.length > 0 && (
        <BookSection title="Sarjat:">
          <Text style={styles.sectionContent}>
            {record.series.join(', ')}
          </Text>
        </BookSection>
      )}

      {/* Muistiinpanot */}
      {record.notes && record.notes.length > 0 && (
        <BookSection title="Muistiinpanot:">
          {record.notes.map((note, idx) => (
            <Text key={idx} style={styles.sectionContent}>
              {note}
            </Text>
          ))}
        </BookSection>
      )}

      {/* Arvostelut */}
      {record.rating && record.rating.count > 0 && (
        <BookSection title="Arvostelut:">
          <Text style={styles.sectionContent}>
            Keskiarvo: {record.rating.average.toFixed(1)} / 5.0
            {'\n'}Arvosteluja: {record.rating.count}
          </Text>
        </BookSection>
      )}

      {/* Verkkolinkit */}
      {record.onlineUrls && record.onlineUrls.length > 0 && (
        <BookSection title="Verkkolinkit:">
          {record.onlineUrls.map((url, idx) => (
            <Text key={idx} style={[styles.sectionContent, styles.link]}>
              {typeof url === 'string' ? url : (url as { url: string }).url || JSON.stringify(url)}
            </Text>
          ))}
        </BookSection>
      )}

      {record.url && (
        <BookSection title="URL:">
          <Text style={[styles.sectionContent, styles.link]}>
            {Array.isArray(record.url) 
              ? record.url.join('\n') 
              : record.url}
          </Text>
        </BookSection>
      )}

      {record.subjects && record.subjects.length > 0 && (
        <BookSection title="Aiheet:">
          {record.subjects.map((subject, idx) => (
            <Text key={idx} style={styles.sectionContent}>
              {Array.isArray(subject) 
                ? subject.join(' / ') 
                : String(subject)}
            </Text>
          ))}
        </BookSection>
      )}

      {record.description && (
        <BookSection title="Kuvaus:">
          <Text style={styles.sectionContent}>
            {Array.isArray(record.description) 
              ? record.description.join('\n\n') 
              : record.description}
          </Text>
        </BookSection>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  author: {
    fontSize: 18,
    color: '#34495e',
    marginBottom: 8,
  },
  metadataRow: {
    marginBottom: 8,
  },
  metadataItem: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
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
  sectionContent: {
    fontSize: 15,
    color: '#34495e',
    lineHeight: 22,
  },
  link: {
    color: '#3498db',
    textDecorationLine: 'underline',
  },
});

