import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

interface BookImageProps {
  imageUrl: string | null;
}

export default function BookImage({ imageUrl }: BookImageProps): JSX.Element {
  return (
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
  );
}

const styles = StyleSheet.create({
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
});

