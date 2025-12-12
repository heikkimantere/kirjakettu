// Finnan API tyypit

export interface FinnaBuilding {
  value: string;
  translated: string;
}

export interface FinnaFormat {
  value: string;
  translated: string;
}

export interface FinnaAuthor {
  name: string;
  type?: string;
  role?: string;
}

export interface FinnaPresenter {
  name: string;
  role?: string;
  id?: string;
}

export interface FinnaPresenters {
  presenters: FinnaPresenter[];
  details?: string[];
}

export interface FinnaRating {
  count: number;
  average: number;
}

export interface FinnaHolding {
  location?: string;
  building?: string;
  availability?: string;
  status?: string;
  callnumber?: string;
  shelfnumber?: string;
  dueDate?: string;
  returnDate?: string;
  copies?: number;
}

export interface FinnaRecord {
  id: string;
  title?: string;
  year?: string;
  author?: string | string[];
  authors?: string[] | FinnaAuthor[];
  nonPresenterAuthors?: FinnaAuthor[];
  presenters?: FinnaPresenter[] | FinnaPresenters;
  publishers?: string | string[];
  publicationDates?: string | string[];
  formats?: FinnaFormat[] | string[];
  physicalDescriptions?: string | string[];
  languages?: string[];
  isbns?: string[];
  issn?: string[];
  subjects?: string[][] | string[];
  description?: string | string[];
  series?: string[];
  notes?: string[];
  images?: string[];
  imageURLs?: string[];
  buildings?: FinnaBuilding[] | string[];
  holdings?: FinnaHolding[];
  onlineUrls?: string[] | Array<{ url: string }>;
  url?: string | string[];
  rating?: FinnaRating;
}

export interface FinnaSearchResponse {
  resultCount: number;
  records: FinnaRecord[];
  status?: string;
  error?: string;
}

export interface FinnaRecordResponse {
  resultCount: number;
  records: FinnaRecord[];
  status?: string;
  error?: string;
}

