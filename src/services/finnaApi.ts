import { FinnaSearchResponse, FinnaRecordResponse } from '../types/finna';

const FINNA_API_BASE = 'https://api.finna.fi';

/**
 * Hakee teoksia Finnan API:sta
 * @param query - Hakusana
 * @param limit - Maksimimäärä tuloksia (oletus: 20)
 * @returns API-vastaus
 */
export async function searchBooks(query: string, limit: number = 20): Promise<FinnaSearchResponse> {
  if (!query || !query.trim()) {
    throw new Error('Hakusana ei voi olla tyhjä');
  }

  const fields = ['title', 'author', 'year', 'id', 'buildings', 'formats'];
  const params = new URLSearchParams({
    lookfor: query.trim(),
    type: 'AllFields',
    limit: limit.toString(),
  });
  
  // Lisätään field-parametrit oikein (field[]=title&field[]=author jne.)
  fields.forEach(field => {
    params.append('field[]', field);
  });

  const url = `${FINNA_API_BASE}/api/v1/search?${params.toString()}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API-virhe: ${response.status} ${response.statusText}`);
    }

    const data: FinnaSearchResponse = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.message.includes('API-virhe')) {
      throw error;
    }
    throw new Error(`Verkkoyhteyden virhe: ${error instanceof Error ? error.message : 'Tuntematon virhe'}`);
  }
}

/**
 * Hakee yksittäisen teoksen tiedot ID:n perusteella
 * @param id - Teoksen ID
 * @returns Teoksen tiedot
 */
export async function getBookDetails(id: string): Promise<FinnaRecordResponse> {
  if (!id) {
    throw new Error('ID ei voi olla tyhjä');
  }

  // Finnan API palauttaa kaikki kentät oletuksena ilman field-parametria
  // field[]=* parametri estää records-taulukon palautuksen
  const params = new URLSearchParams({
    id: id,
  });

  const url = `${FINNA_API_BASE}/api/v1/record?${params.toString()}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API-virhe: ${response.status} ${response.statusText}`);
    }

    const data: FinnaRecordResponse = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.message.includes('API-virhe')) {
      throw error;
    }
    throw new Error(`Verkkoyhteyden virhe: ${error instanceof Error ? error.message : 'Tuntematon virhe'}`);
  }
}

