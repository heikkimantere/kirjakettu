import { FinnaRecordResponse } from '../types/finna';

/**
 * Hakee kuvan URL:n teoksen tiedoista
 */
export const getImageUrl = (details: FinnaRecordResponse | null): string | null => {
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

