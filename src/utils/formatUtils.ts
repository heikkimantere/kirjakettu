import { FinnaRecord, FinnaFormat } from '../types/finna';

/**
 * Palauttaa emoji-ikonin teoksen tyypin perusteella
 */
export const getFormatIcon = (formats: FinnaRecord['formats']): string => {
  if (!formats || formats.length === 0) {
    return '📄';
  }

  // Ota ensimmäinen format
  const format = formats[0];
  let formatValue = '';
  let formatTranslated = '';

  if (typeof format === 'object' && 'value' in format) {
    formatValue = (format as FinnaFormat).value || '';
    formatTranslated = (format as FinnaFormat).translated || '';
  } else if (typeof format === 'string') {
    formatValue = format;
  }

  // Tarkista format-arvo tai käännös
  const formatLower = formatValue.toLowerCase();
  const translatedLower = formatTranslated.toLowerCase();

  // Kirja
  if (formatLower.includes('book') || translatedLower.includes('kirja')) {
    return '📖';
  }
  // Lehti/Journal
  if (formatLower.includes('journal') || formatLower.includes('magazine') || 
      translatedLower.includes('lehti') || translatedLower.includes('aikakauslehti')) {
    return '📰';
  }
  // DVD/Video
  if (formatLower.includes('video') || formatLower.includes('dvd') || 
      translatedLower.includes('video') || translatedLower.includes('dvd')) {
    return '📀';
  }
  // CD/Äänite
  if (formatLower.includes('audio') || formatLower.includes('cd') || 
      translatedLower.includes('ääni') || translatedLower.includes('cd')) {
    return '💿';
  }
  // Peli/Game
  if (formatLower.includes('game') || translatedLower.includes('peli')) {
    return '🎮';
  }
  // E-kirja
  if (formatLower.includes('ebook') || formatLower.includes('e-kirja') || 
      translatedLower.includes('e-kirja') || translatedLower.includes('sähköinen')) {
    return '📱';
  }
  // Äänikirja
  if (formatLower.includes('audiobook') || translatedLower.includes('äänikirja')) {
    return '🎧';
  }
  // Kartta
  if (formatLower.includes('map') || translatedLower.includes('kartta')) {
    return '🗺️';
  }
  // Nuottikirja
  if (formatLower.includes('music') || formatLower.includes('score') || 
      translatedLower.includes('nuotti') || translatedLower.includes('musiikki')) {
    return '🎵';
  }

  // Oletus
  return '📄';
};

