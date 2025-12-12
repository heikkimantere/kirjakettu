import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AvailabilityItem, formatAvailability } from '../utils/availabilityUtils';
import BookSection from './BookSection';

interface AvailabilityListProps {
  availability: AvailabilityItem[];
}

export default function AvailabilityList({ availability }: AvailabilityListProps): JSX.Element {
  if (availability.length === 0) {
    return (
      <BookSection title="Saatavuus kirjastoissa:">
        <Text style={styles.noAvailability}>
          Saatavuustietoja ei saatavilla
        </Text>
      </BookSection>
    );
  }

  return (
    <BookSection title="Saatavuus kirjastoissa:">
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
    </BookSection>
  );
}

const styles = StyleSheet.create({
  availabilityItem: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

