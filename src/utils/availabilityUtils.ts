import { FinnaRecordResponse, FinnaBuilding } from '../types/finna';

export interface AvailabilityItem {
  location: string;
  availability: string;
  callnumber: string | null;
  dueDate: string | null;
  copies: number | null;
}

/**
 * Hakee saatavuustiedot teoksen tiedoista
 */
export const getAvailability = (details: FinnaRecordResponse | null): AvailabilityItem[] => {
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

/**
 * Muotoilee saatavuustilan suomeksi
 */
export const formatAvailability = (avail: string): string => {
  if (avail === 'available') return 'Saatavissa';
  if (avail === 'checkedout') return 'Lainassa';
  if (avail === 'onorder') return 'Tilauksessa';
  if (avail === 'missing') return 'Puuttuu';
  return avail;
};

