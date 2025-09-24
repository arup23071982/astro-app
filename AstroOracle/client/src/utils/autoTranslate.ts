// Auto-translate utility using MyMemory API (1000 free requests/day)
interface TranslationResponse {
  responseData: {
    translatedText: string;
  };
  responseStatus: number;
}

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

// Cache translations to avoid re-requesting
const translationCache = new Map<string, string>();

export async function translateText(text: string, targetLang: string): Promise<string> {
  const cacheKey = `${text}-${targetLang}`;
  
  // Return cached translation if exists
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  // Skip translation if target is English or text is very short
  if (targetLang === 'en' || text.length < 2) {
    return text;
  }

  try {
    const response = await fetch(`${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
    const data: TranslationResponse = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translatedText = data.responseData.translatedText;
      // Cache the result
      translationCache.set(cacheKey, translatedText);
      return translatedText;
    }
  } catch (error) {
    console.warn('Translation failed:', error);
  }
  
  // Return original text if translation fails
  return text;
}

// Language code mapping for MyMemory API
export const getMyMemoryLangCode = (langCode: string): string => {
  const langMap: Record<string, string> = {
    'bn': 'bn', // Bengali
    'hi': 'hi', // Hindi
    'te': 'te', // Telugu
    'ta': 'ta', // Tamil
    'mr': 'mr', // Marathi
    'gu': 'gu', // Gujarati
    'kn': 'kn', // Kannada
    'or': 'or', // Odia
    'pa': 'pa', // Punjabi
    'as': 'as', // Assamese
    'ml': 'ml', // Malayalam
    'ur': 'ur', // Urdu
    'es': 'es', // Spanish
    'fr': 'fr', // French
    'de': 'de', // German
    'it': 'it', // Italian
    'pt': 'pt', // Portuguese
    'ru': 'ru', // Russian
    'ja': 'ja', // Japanese
    'ko': 'ko', // Korean
    'zh': 'zh-cn', // Chinese
    'ar': 'ar', // Arabic
    'th': 'th', // Thai
    'vi': 'vi', // Vietnamese
    'id': 'id', // Indonesian
    'ms': 'ms', // Malay
    'tl': 'tl', // Filipino
    'sw': 'sw', // Swahili
    'tr': 'tr', // Turkish
    'pl': 'pl', // Polish
    'nl': 'nl', // Dutch
    'sv': 'sv', // Swedish
    'da': 'da', // Danish
    'no': 'no', // Norwegian
    'fi': 'fi', // Finnish
    'he': 'he', // Hebrew
    'cs': 'cs', // Czech
    'sk': 'sk', // Slovak
    'hu': 'hu', // Hungarian
    'ro': 'ro', // Romanian
    'bg': 'bg', // Bulgarian
    'hr': 'hr', // Croatian
    'sr': 'sr', // Serbian
    'sl': 'sl', // Slovenian
    'et': 'et', // Estonian
    'lv': 'lv', // Latvian
    'lt': 'lt', // Lithuanian
    'uk': 'uk', // Ukrainian
  };
  
  return langMap[langCode] || langCode;
};