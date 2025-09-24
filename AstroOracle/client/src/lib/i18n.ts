// Internationalization configuration and utilities
export interface TranslationResource {
  [key: string]: string | TranslationResource;
}

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

// Supported languages configuration
export const supportedLanguages: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
];

// Translation resources
const translations: Record<string, TranslationResource> = {
  en: {
    navigation: {
      home: 'Home',
      services: 'Services',
      courses: 'Courses',
      products: 'Products',
      about: 'About',
      login: 'Login',
      logout: 'Logout',
      bookConsultation: 'Book Consultation',
      dashboard: 'Dashboard',
    },
    home: {
      title: 'Discover Your Cosmic Destiny',
      subtitle: 'Unlock the secrets of the universe with expert Vedic astrology consultations by Astrologer Arup Shastri - 18+ years of transformative guidance',
      bookReading: 'Book Your Reading Now',
      exploreCourses: 'Explore Courses',
      yearsExperience: 'Years Experience',
      satisfiedClients: 'Satisfied Clients',
      countriesServed: 'Countries Served',
    },
    consultation: {
      types: {
        video: 'Video Call',
        audio: 'Audio Call',
        chat: 'Chat Session',
        inPerson: 'In-Person',
      },
      plans: {
        quickGuidance: 'Quick Guidance',
        focusedAnalysis: 'Focused Analysis',
        inDepthAnalysis: 'In-Depth Analysis',
        comprehensiveAnalysis: 'Comprehensive Analysis',
      },
      status: {
        scheduled: 'Scheduled',
        ongoing: 'In Progress',
        completed: 'Completed',
        cancelled: 'Cancelled',
      },
    },
    forms: {
      fullName: 'Full Name',
      email: 'Email Address',
      phoneNumber: 'Phone Number',
      dateOfBirth: 'Date of Birth',
      timeOfBirth: 'Time of Birth',
      placeOfBirth: 'Place of Birth',
      required: 'Required',
      optional: 'Optional',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
    },
    messages: {
      welcome: 'Welcome to Jai Guru Astro Remedy',
      loginSuccess: 'Login successful',
      loginFailed: 'Login failed',
      registrationSuccess: 'Registration successful',
      bookingConfirmed: 'Booking confirmed',
      paymentRequired: 'Payment required',
      connectionLost: 'Connection lost',
      reconnecting: 'Reconnecting...',
    },
    astrologer: {
      name: 'Astrologer Arup Shastri',
      title: 'Expert Vedic Astrologer',
      experience: '18+ years of experience',
      specialties: {
        vedicAstrology: 'Vedic Astrology',
        palmistry: 'Palmistry',
        numerology: 'Numerology',
        cosmicRemedies: 'Cosmic Remedies',
      },
    },
  },
  hi: {
    navigation: {
      home: 'मुख्य पृष्ठ',
      services: 'सेवाएं',
      courses: 'पाठ्यक्रम',
      products: 'उत्पाद',
      about: 'बारे में',
      login: 'लॉगिन',
      logout: 'लॉगआउट',
      bookConsultation: 'परामर्श बुक करें',
      dashboard: 'डैशबोर्ड',
    },
    home: {
      title: 'अपनी कॉस्मिक नियति खोजें',
      subtitle: 'अरुप शास्त्री के 18+ वर्षों के अनुभव के साथ वैदिक ज्योतिष परामर्श द्वारा ब्रह्मांड के रहस्यों को अनलॉक करें',
      bookReading: 'अभी अपना रीडिंग बुक करें',
      exploreCourses: 'पाठ्यक्रम देखें',
      yearsExperience: 'वर्षों का अनुभव',
      satisfiedClients: 'संतुष्ट ग्राहक',
      countriesServed: 'देश सेवित',
    },
    consultation: {
      types: {
        video: 'वीडियो कॉल',
        audio: 'ऑडियो कॉल',
        chat: 'चैट सेशन',
        inPerson: 'व्यक्तिगत',
      },
      plans: {
        quickGuidance: 'त्वरित मार्गदर्शन',
        focusedAnalysis: 'केंद्रित विश्लेषण',
        inDepthAnalysis: 'गहन विश्लेषण',
        comprehensiveAnalysis: 'व्यापक विश्लेषण',
      },
    },
    astrologer: {
      name: 'अरुप शास्त्री',
      title: 'विशेषज्ञ वैदिक ज्योतिषी',
      experience: '18+ वर्षों का अनुभव',
    },
  },
  bn: {
    navigation: {
      home: 'হোম',
      services: 'সেবা',
      courses: 'কোর্স',
      products: 'পণ্য',
      about: 'সম্পর্কে',
      login: 'লগইন',
      logout: 'লগআউট',
      bookConsultation: 'পরামর্শ বুক করুন',
      dashboard: 'ড্যাশবোর্ড',
    },
    home: {
      title: 'আপনার মহাজাগতিক নিয়তি আবিষ্কার করুন',
      subtitle: 'অরুপ শাস্ত্রীর 18+ বছরের অভিজ্ঞতার সাথে বিশেষজ্ঞ বৈদিক জ্যোতিষ পরামর্শের মাধ্যমে মহাবিশ্বের গোপনীয়তা আনলক করুন',
      bookReading: 'এখনই আপনার রিডিং বুক করুন',
      exploreCourses: 'কোর্স অন্বেষণ করুন',
      yearsExperience: 'বছরের অভিজ্ঞতা',
      satisfiedClients: 'সন্তুষ্ট ক্লায়েন্ট',
      countriesServed: 'দেশ সেবা করা হয়েছে',
    },
    astrologer: {
      name: 'অরুপ শাস্ত্রী',
      title: 'বিশেষজ্ঞ বৈদিক জ্যোতিষী',
      experience: '18+ বছরের অভিজ্ঞতা',
    },
  },
};

// Translation state management
class I18nManager {
  private currentLanguage: string = 'en';
  private fallbackLanguage: string = 'en';
  private listeners: Array<(language: string) => void> = [];

  constructor() {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && this.isLanguageSupported(savedLanguage)) {
      this.currentLanguage = savedLanguage;
    } else {
      // Detect browser language
      const browserLanguage = navigator.language.split('-')[0];
      if (this.isLanguageSupported(browserLanguage)) {
        this.currentLanguage = browserLanguage;
      }
    }

    // Apply RTL if needed
    this.applyLanguageDirection();
  }

  isLanguageSupported(language: string): boolean {
    return supportedLanguages.some(lang => lang.code === language);
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  setLanguage(language: string): void {
    if (!this.isLanguageSupported(language)) {
      console.warn(`Language ${language} is not supported, falling back to ${this.fallbackLanguage}`);
      return;
    }

    this.currentLanguage = language;
    localStorage.setItem('preferred-language', language);
    this.applyLanguageDirection();
    this.notifyListeners();
  }

  subscribe(listener: (language: string) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentLanguage));
  }

  private applyLanguageDirection(): void {
    const languageConfig = supportedLanguages.find(lang => lang.code === this.currentLanguage);
    const isRTL = languageConfig?.rtl || false;
    
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', this.currentLanguage);
  }

  translate(key: string, interpolations?: Record<string, string>): string {
    const keys = key.split('.');
    let translation: any = translations[this.currentLanguage];
    
    // Navigate through nested keys
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        // Fallback to English if key not found
        translation = translations[this.fallbackLanguage];
        for (const k of keys) {
          if (translation && typeof translation === 'object' && k in translation) {
            translation = translation[k];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }

    if (typeof translation !== 'string') {
      return key;
    }

    // Apply interpolations
    if (interpolations) {
      return Object.entries(interpolations).reduce((result, [placeholder, value]) => {
        return result.replace(new RegExp(`{{${placeholder}}}`, 'g'), value);
      }, translation);
    }

    return translation;
  }

  // Helper method to get language configuration
  getLanguageConfig(code?: string): LanguageConfig | undefined {
    const languageCode = code || this.currentLanguage;
    return supportedLanguages.find(lang => lang.code === languageCode);
  }

  // Format numbers according to locale
  formatNumber(number: number): string {
    try {
      const languageConfig = this.getLanguageConfig();
      const locale = languageConfig?.code === 'hi' ? 'hi-IN' : 
                    languageConfig?.code === 'bn' ? 'bn-BD' : 
                    languageConfig?.code === 'ar' ? 'ar-SA' : 
                    'en-US';
      return new Intl.NumberFormat(locale).format(number);
    } catch (error) {
      return number.toString();
    }
  }

  // Format currency according to locale
  formatCurrency(amount: number, currency: string = 'INR'): string {
    try {
      const languageConfig = this.getLanguageConfig();
      const locale = languageConfig?.code === 'hi' ? 'hi-IN' : 
                    languageConfig?.code === 'bn' ? 'bn-BD' : 
                    'en-IN';
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
      }).format(amount);
    } catch (error) {
      return `${currency} ${amount}`;
    }
  }

  // Format dates according to locale
  formatDate(date: Date | string): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const languageConfig = this.getLanguageConfig();
      const locale = languageConfig?.code === 'hi' ? 'hi-IN' : 
                    languageConfig?.code === 'bn' ? 'bn-BD' : 
                    languageConfig?.code === 'ar' ? 'ar-SA' : 
                    'en-US';
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(dateObj);
    } catch (error) {
      return date.toString();
    }
  }
}

// Create and export singleton instance
export const i18n = new I18nManager();

// React hook for using translations
export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = React.useState(i18n.getCurrentLanguage());

  React.useEffect(() => {
    const unsubscribe = i18n.subscribe(setCurrentLanguage);
    return unsubscribe;
  }, []);

  const t = React.useCallback((key: string, interpolations?: Record<string, string>) => {
    return i18n.translate(key, interpolations);
  }, []);

  const changeLanguage = React.useCallback((language: string) => {
    i18n.setLanguage(language);
  }, []);

  return {
    t,
    currentLanguage,
    changeLanguage,
    supportedLanguages,
    formatNumber: i18n.formatNumber.bind(i18n),
    formatCurrency: i18n.formatCurrency.bind(i18n),
    formatDate: i18n.formatDate.bind(i18n),
  };
};

// Add React import for the hook
import * as React from 'react';

// Helper function to add new translations dynamically
export const addTranslations = (language: string, newTranslations: TranslationResource) => {
  if (!translations[language]) {
    translations[language] = {};
  }
  
  // Deep merge translations
  const merge = (target: any, source: any) => {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        merge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  };
  
  merge(translations[language], newTranslations);
};

// Export useful utilities
export const getCurrentLanguage = () => i18n.getCurrentLanguage();
export const setLanguage = (language: string) => i18n.setLanguage(language);
export const translate = (key: string, interpolations?: Record<string, string>) => i18n.translate(key, interpolations);
