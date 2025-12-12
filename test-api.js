const fetch = require('node-fetch');

// Finnan API:n perusosoite
const FINNA_API_BASE = 'https://api.finna.fi';

/**
 * Testaa Finnan API:n toimivuutta tekemällä hakuja
 */
async function testFinnaAPI() {
  console.log('Testataan Finnan API:n toimivuutta...\n');

  // Testi 1: Yksinkertainen haku
  console.log('Testi 1: Yksinkertainen haku "kirja"');
  try {
    const searchUrl = `${FINNA_API_BASE}/api/v1/search?lookfor=kirja&type=AllFields&limit=5&field[]=title&field[]=author&field[]=year&field[]=id`;
    console.log(`URL: ${searchUrl}\n`);
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (response.ok && data.resultCount > 0) {
      console.log(`✓ Haku onnistui! Löytyi ${data.resultCount} tulosta`);
      console.log(`\nEsimerkkitulokset:`);
      if (data.records && data.records.length > 0) {
        data.records.slice(0, 3).forEach((record, index) => {
          console.log(`\n${index + 1}. ${record.title || 'Ei nimeä'}`);
          if (record.author) console.log(`   Tekijä: ${Array.isArray(record.author) ? record.author.join(', ') : record.author}`);
          if (record.year) console.log(`   Vuosi: ${record.year}`);
        });
      }
    } else {
      console.log(`✗ Haku epäonnistui tai ei tuloksia`);
      console.log(`Vastaus: ${JSON.stringify(data, null, 2)}`);
    }
  } catch (error) {
    console.error(`✗ Virhe: ${error.message}`);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Testi 2: Haku Helmet-kirjastosta (jos mahdollista)
  console.log('Testi 2: Haku Helmet-kirjastosta');
  try {
    // Yritetään hakea Helmet-kirjastojen aineistoa
    // Finna API:ssa voidaan suodattaa kirjastokohtaisesti
    const searchUrl = `${FINNA_API_BASE}/api/v1/search?lookfor=helsinki&type=AllFields&limit=5&field[]=title&field[]=author&field[]=year&field[]=id&field[]=buildings`;
    console.log(`URL: ${searchUrl}\n`);
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✓ Haku onnistui! Löytyi ${data.resultCount} tulosta`);
      if (data.records && data.records.length > 0) {
        console.log(`\nEsimerkkitulokset:`);
        data.records.slice(0, 3).forEach((record, index) => {
          console.log(`\n${index + 1}. ${record.title || 'Ei nimeä'}`);
          if (record.buildings) {
            console.log(`   Kirjastot: ${Array.isArray(record.buildings) ? record.buildings.join(', ') : record.buildings}`);
          }
        });
      }
    } else {
      console.log(`✗ Haku epäonnistui`);
      console.log(`Vastaus: ${JSON.stringify(data, null, 2)}`);
    }
  } catch (error) {
    console.error(`✗ Virhe: ${error.message}`);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Testi 3: API:n perustiedot
  console.log('Testi 3: API:n perustiedot');
  try {
    // Yritetään hakea API:n versiotietoja tai muita metatietoja
    const infoUrl = `${FINNA_API_BASE}/api/v1/search?lookfor=*&type=AllFields&limit=1`;
    const response = await fetch(infoUrl);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✓ API vastaa pyyntöihin');
      if (data.resultCount !== undefined) {
        console.log(`  Yhteensä saatavilla: ${data.resultCount} tulosta (tässä haussa)`);
      }
    }
  } catch (error) {
    console.error(`✗ Virhe: ${error.message}`);
  }
}

// Suorita testit
testFinnaAPI()
  .then(() => {
    console.log('\n✓ API-testit suoritettu');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Testit epäonnistuivat:', error);
    process.exit(1);
  });


