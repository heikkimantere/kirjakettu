const fetch = require('node-fetch');

const FINNA_API_BASE = 'https://api.finna.fi';

/**
 * Testaa mitä tietoja yksittäisestä teoksesta on saatavilla
 */
async function testBookDetails() {
  console.log('Haetaan esimerkkiteos nähdäksemme saatavilla olevat kentät...\n');

  // 1. Haetaan yksi teos hakutuloksista
  console.log('Vaihe 1: Haetaan yksi teos hakutuloksista');
  try {
    // Haetaan useita teoksia löytääksemme sellaisen, jossa on paljon tietoja
    // Kokeillaan eri hakuja löytääksemme kirjan, jossa on paljon tietoja
    const searchUrl = `${FINNA_API_BASE}/api/v1/search?lookfor=suomi&type=AllFields&limit=10`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    console.log('Hakutulokset:', JSON.stringify(searchData, null, 2).substring(0, 500));
    
    if (searchData.records && searchData.records.length > 0) {
      // Valitaan ensimmäinen teos, jossa on kuva tai paljon tietoja
      let selectedRecord = searchData.records[0];
      for (const record of searchData.records) {
        // Etsitään teos, jossa on kuva ja mahdollisesti muita tietoja
        if (record.images && record.images.length > 0) {
          selectedRecord = record;
          break;
        }
      }
      // Jos ei löytynyt kuvaa, valitaan ensimmäinen
      if (!selectedRecord.images || selectedRecord.images.length === 0) {
        selectedRecord = searchData.records[0];
      }
      const bookId = selectedRecord.id;
      
      console.log(`✓ Löytyi teos ID:llä ${bookId}`);
      console.log(`  Otsikko: ${selectedRecord.title || 'Ei saatavilla'}\n`);
      
      // 2. Haetaan yksityiskohtaiset tiedot
      console.log('Vaihe 2: Haetaan yksityiskohtaiset tiedot');
      const detailUrl = `${FINNA_API_BASE}/api/v1/record?id=${encodeURIComponent(bookId)}`;
      console.log(`Detail URL: ${detailUrl}`);
      const detailResponse = await fetch(detailUrl);
      const detailData = await detailResponse.json();
      
      console.log('Detail vastaus:', JSON.stringify(detailData, null, 2).substring(0, 1000));
      
      if (detailData.records && detailData.records.length > 0) {
        const record = detailData.records[0];
        
        console.log('\n=== SAAVUTTAVISSA OLEVAT TIEDOT ===\n');
        
        // Listataan kaikki kentät
        const fields = Object.keys(record).sort();
        console.log(`Yhteensä ${fields.length} kenttää:\n`);
        
        fields.forEach(field => {
          const value = record[field];
          const type = Array.isArray(value) ? 'array' : typeof value;
          let preview = '';
          
          if (Array.isArray(value)) {
            if (value.length === 0) {
              preview = '[tyhjä]';
            } else if (value.length <= 3) {
              preview = JSON.stringify(value).substring(0, 100);
            } else {
              preview = `[${value.length} kpl] ${JSON.stringify(value.slice(0, 2)).substring(0, 80)}...`;
            }
          } else if (typeof value === 'object' && value !== null) {
            const keys = Object.keys(value);
            preview = `{${keys.length} kenttää: ${keys.join(', ')}`;
            if (preview.length > 80) preview = preview.substring(0, 77) + '...';
            preview += '}';
          } else {
            preview = String(value).substring(0, 80);
          }
          
          console.log(`  ${field.padEnd(30)} (${type.padEnd(6)}) : ${preview}`);
        });
        
        // Näytetään tärkeimmät kentät tarkemmin
        console.log('\n\n=== TÄRKEIMMÄT KENTÄT TARKEMMIN ===\n');
        
        if (record.title) {
          console.log('Otsikko:', record.title);
        }
        
        if (record.authors) {
          console.log('Tekijät:', JSON.stringify(record.authors, null, 2));
        }
        
        if (record.year) {
          console.log('Vuosi:', record.year);
        }
        
        if (record.publishers) {
          console.log('Julkaisijat:', JSON.stringify(record.publishers, null, 2));
        }
        
        if (record.publicationDates) {
          console.log('Julkaisupäivät:', JSON.stringify(record.publicationDates, null, 2));
        }
        
        if (record.subjects) {
          console.log('Aiheet:', JSON.stringify(record.subjects, null, 2));
        }
        
        if (record.description) {
          console.log('Kuvaus:', JSON.stringify(record.description, null, 2));
        }
        
        if (record.images) {
          console.log('Kuvat:', JSON.stringify(record.images, null, 2));
        }
        
        if (record.imageURLs) {
          console.log('Kuva-URLit:', JSON.stringify(record.imageURLs, null, 2));
        }
        
        if (record.holdings) {
          console.log('\nSaatavuustiedot (holdings):');
          console.log(JSON.stringify(record.holdings, null, 2));
        }
        
        if (record.buildings) {
          console.log('\nKirjastot (buildings):');
          console.log(JSON.stringify(record.buildings, null, 2));
        }
        
        if (record.formats) {
          console.log('\nMuodot (formats):');
          console.log(JSON.stringify(record.formats, null, 2));
        }
        
        if (record.languages) {
          console.log('\nKielet:');
          console.log(JSON.stringify(record.languages, null, 2));
        }
        
        if (record.isbns) {
          console.log('\nISBN-tunnukset:');
          console.log(JSON.stringify(record.isbns, null, 2));
        }
        
        if (record.issn) {
          console.log('\nISSN-tunnukset:');
          console.log(JSON.stringify(record.issn, null, 2));
        }
        
        if (record.physicalDescriptions) {
          console.log('\nFyysinen kuvaus:');
          console.log(JSON.stringify(record.physicalDescriptions, null, 2));
        }
        
        if (record.series) {
          console.log('\nSarjat:');
          console.log(JSON.stringify(record.series, null, 2));
        }
        
        if (record.notes) {
          console.log('\nMuistiinpanot:');
          console.log(JSON.stringify(record.notes, null, 2));
        }
        
        if (record.url) {
          console.log('\nURL:');
          console.log(JSON.stringify(record.url, null, 2));
        }
        
      } else {
        console.log('✗ Yksityiskohtaisia tietoja ei löytynyt');
      }
    } else {
      console.log('✗ Hakutuloksia ei löytynyt');
    }
  } catch (error) {
    console.error('✗ Virhe:', error.message);
  }
}

testBookDetails()
  .then(() => {
    console.log('\n✓ Testi valmis');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Testi epäonnistui:', error);
    process.exit(1);
  });

