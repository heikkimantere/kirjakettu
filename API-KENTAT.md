# Finnan API:n saatavilla olevat teostiedot

Tämä dokumentti listaa teoksista saatavilla olevat kentät Finnan API:n kautta.

## Perustiedot (aina saatavilla)

### Perusidentifikaatio
- **id** (string) - Teoksen yksilöllinen tunniste
- **title** (string) - Teoksen otsikko/nimi
- **year** (string) - Julkaisuvuosi

### Tekijät ja esittäjät
- **author** (string/array) - Tekijä (hakutuloksissa)
- **authors** (array) - Tekijät (yksityiskohtanäkymässä)
- **nonPresenterAuthors** (array) - Tekijät, jotka eivät ole esittäjiä
  - `name` - Tekijän nimi
  - `type` - Tekijän tyyppi (esim. "Personal Name")
  - `role` - Rooli (esim. "Taiteilija")
- **presenters** (object/array) - Esittäjät (esim. yhtyeet, esiintyjät)
  - `presenters` (array) - Esittäjälista
    - `name` - Nimi
    - `role` - Rooli (esim. "esittäjä")
    - `id` - ID-tunniste
  - `details` (array) - Yksityiskohtaiset tiedot

### Julkaisutiedot
- **publishers** (array/string) - Julkaisijat
- **publicationDates** (array/string) - Julkaisupäivät

### Fyysinen kuvaus
- **formats** (array) - Teoksen muodot
  - `value` - Muodon arvo (esim. "0/Book/")
  - `translated` - Käännös (esim. "Kirja")
- **physicalDescriptions** (array) - Fyysinen kuvaus (sivumäärä, koko jne.)

### Kuvat
- **images** (array) - Kuvien URLit
  - Yleensä muodossa: `/Cover/Show?source=Solr&id={id}&index=0&size=large`
  - Täydellinen URL: `https://api.finna.fi/Cover/Show?id={id}&index=0&size=large`
- **imageURLs** (array) - Vaihtoehtoiset kuva-URLit

### Sisältötiedot
- **subjects** (array) - Aiheet/aihepiirit
  - Usein sisäkkäisiä taulukoita
- **description** (string/array) - Kuvaus/sisältöseloste
- **series** (array) - Sarjat, joihin teos kuuluu
- **notes** (array) - Muistiinpanot

### Kieli ja luokitus
- **languages** (array) - Teoksen kielet (esim. ["fin", "swe"])
- **isbns** (array) - ISBN-tunnukset
- **issn** (array) - ISSN-tunnukset

### Kirjastotiedot
- **buildings** (array) - Kirjastot, joissa teos on
  - `value` - Kirjaston arvo (esim. "0/Helmet/")
  - `translated` - Käännös (esim. "Helmet-kirjastot")
- **holdings** (array) - Saatavuustiedot kirjastoittain
  - `location` / `building` - Kirjaston sijainti
  - `availability` / `status` - Saatavuustila
    - "available" - Saatavissa
    - "checkedout" - Lainassa
    - "onorder" - Tilauksessa
    - "missing" - Puuttuu
  - `callnumber` / `shelfnumber` - Hyllypaikka
  - `dueDate` / `returnDate` - Palautuspäivä (jos lainassa)
  - `copies` - Kappalemäärä

### Verkkolinkit
- **onlineUrls** (array) - Verkkolinkit teokseen
- **url** (string/array) - URLit

### Arvostelut
- **rating** (object) - Arvostelutiedot
  - `count` - Arvostelujen määrä
  - `average` - Keskiarvo

## Huomioita

1. **Kenttien saatavuus vaihtelee**: Kaikki kentät eivät ole saatavilla kaikille teoksille. Esimerkiksi kaikilla teoksilla ei ole kuvaa tai kuvailua.

2. **Array vs. string**: Jotkut kentät voivat olla joko string tai array riippuen teoksesta.

3. **Sisäkkäiset rakenteet**: Esimerkiksi `subjects` voi olla sisäkkäisiä taulukoita.

4. **Käännökset**: Monet kentät sisältävät sekä alkuperäisen arvon (`value`) että käännöksen (`translated`).

5. **API-parametrit**: Yksityiskohtaiset tiedot saadaan pyytämällä `field[]=*` parametrilla, mutta kaikki kentät eivät välttämättä ole saatavilla kaikille teoksille.

## Esimerkki käytöstä

```javascript
// Haetaan teoksen yksityiskohtaiset tiedot
const details = await getBookDetails('helmet.123456');

const record = details.records[0];

// Perustiedot
console.log(record.title);        // Otsikko
console.log(record.year);         // Vuosi
console.log(record.authors);      // Tekijät

// Kuvat
if (record.images && record.images.length > 0) {
  const imageUrl = `https://api.finna.fi${record.images[0]}`;
}

// Saatavuus
if (record.holdings) {
  record.holdings.forEach(holding => {
    console.log(holding.location, holding.availability);
  });
}
```

