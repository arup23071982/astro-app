import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translateText, getMyMemoryLangCode } from '../utils/autoTranslate';

type Language = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'or' | 'pa' | 'ml' | 'as' | 'ur' | 'sa' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | 'ko' | 'ar' | 'nl' | 'sv' | 'no' | 'da' | 'fi' | 'pl' | 'cs' | 'hu' | 'ro' | 'el' | 'tr' | 'fa' | 'he' | 'th' | 'vi' | 'id' | 'ms' | 'fil' | 'sw' | 'af' | 'uk' | 'bg' | 'hr' | 'sk' | 'sl' | 'et' | 'lv' | 'lt';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Navigation
    home: "Home",
    bookConsultation: "Book Consultation",
    courses: "Courses",
    homeTuition: "Home Tuition", 
    products: "Products",
    adminDashboard: "Admin Dashboard",
    login: "Login",
    logout: "Logout",
    
    // Hero Section
    heroTitle: "Discover Your Cosmic Destiny",
    heroSubtitle: "Unlock the secrets of the universe with expert Vedic astrology consultations by Astrologer Arup Shastri - 18+ years of transformative guidance",
    bookReadingNow: "Book Your Reading Now",
    exploreCourses: "Explore Courses",
    
    // Profile Section
    meetAstrologer: "Meet Astrologer Arup Shastri",
    astrologerDescription: "With over 18 years of dedicated practice in Vedic astrology, Astrologer Arup Shastri has guided thousands of souls towards clarity, purpose, and cosmic alignment.",
    scheduleConsultation: "Schedule Personal Consultation",
    
    // Expertise Areas
    vedicAstrology: "Vedic Astrology",
    vedicAstrologyDesc: "Traditional birth chart analysis",
    palmistry: "Palmistry", 
    palmistryDesc: "Hand reading & life insights",
    numerology: "Numerology",
    numerologyDesc: "Number patterns & destiny",
    cosmicRemedies: "Cosmic Remedies",
    cosmicRemediesDesc: "Healing solutions & guidance",
    vedicVastu: "Vedic Vastu Shastra",
    vedicVastuDesc: "Science of construction & harmony",
    yogaMeditation: "Yoga & Meditation",
    yogaMeditationDesc: "Pranayam & spiritual practices",
    
    // Services Section
    consultationServices: "Consultation Services",
    servicesDescription: "Choose from multiple consultation formats designed to provide you with personalized cosmic guidance",
    
    // Service Types
    videoCall: "Video Call",
    audioCall: "Audio Call", 
    chatSession: "Chat Session",
    inPerson: "In-Person",
    homeService: "Home Service",
    
    // Service Descriptions
    videoCallDesc: "Face-to-face consultation via secure video call using Jitsi Meet",
    audioCallDesc: "Voice-only consultation for focused spiritual guidance and clarity",
    chatSessionDesc: "Text-based consultation through secure in-app messaging system",
    inPersonDesc: "Traditional face-to-face consultations at designated locations",
    homeServiceDesc: "Premium consultation at your home with personalized rituals",
    
    // Service Buttons
    bookVideoSession: "Book Video Session",
    bookAudioSession: "Book Audio Session", 
    startChatSession: "Start Chat Session",
    bookInPerson: "Book In-Person",
    bookHomeService: "Book Home Service",
    
    // Additional Services
    allServices: "All Services",
    allServicesDescription: "Comprehensive astrological solutions designed to guide you on your cosmic journey",
    liveConsultations: "Live Consultations",
    liveConsultationsDesc: "Video, Audio, Chat & In-Person sessions for personalized cosmic guidance",
    vedicAstrologyCourses: "Vedic Astrology Courses",
    vedicAstrologyCoursesDesc: "Master ancient wisdom through comprehensive online and offline learning programs",
    startingFrom: "Starting from",
    beginnerToExpert: "Beginner to Expert",
    
    // Testimonials & CTA
    readyToDiscover: "Ready to Discover Your Cosmic Path?",
    bookPersonalizedConsultation: "Book your personalized consultation today and unlock the mysteries of your destiny with expert guidance from Astrologer Arup Shastri.",
    discoverGuidance: "Discover how Astrologer Arup Shastri's cosmic guidance has transformed lives across the globe",
    quickBooking: "Quick Booking",
    
    // Service full descriptions
    vedicAstrologyFullDesc: "Traditional birth chart analysis with personalized cosmic insights and remedial guidance",
    palmistryFullDesc: "Palmistry, Numerology, and birth chart analysis for deep spiritual insights", 
    numerologyFullDesc: "Sacred number patterns and destiny analysis for life path clarity",
    cosmicRemediesFullDesc: "Authentic gemstones, yantras, and spiritual products for positive energy transformation",
    vedicVastuFullDesc: "Science of construction and architectural harmony for positive living spaces",
    yogaMeditationFullDesc: "Pranayam breathing techniques and spiritual practices for inner peace and balance",
    homeServiceFullDesc: "Premium consultation at your home with personalized rituals and sacred ceremonies",
    
    // Testimonial names (keeping original)
    priyaSharma: "Priya Sharma",
    michaelJohnson: "Michael Johnson", 
    sarahMitchell: "Sarah Mitchell",
    
    // Stats
    yearsExperience: "Years Experience",
    satisfiedClients: "Satisfied Clients",
    countriesServed: "Countries Served",
    
    
    // Additional service tags
    authenticBlessed: "Authentic & Blessed",
    sacredGeometry: "Sacred Geometry", 
    mindBodyHarmony: "Mind Body Harmony",
    sacredHomeVisits: "Sacred Home Visits",
    
    // Footer specific translations
    videoConsultation: "Video Consultation",
    audioConsultation: "Audio Consultation", 
    chatConsultation: "Chat Consultation",
    inPersonReading: "In-Person Reading",
    astrologicalRemedies: "Astrological Remedies",
    contactLegal: "Contact & Legal",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    disclaimer: "Disclaimer",
    refundPolicy: "Refund Policy", 
    quickLinks: "Quick Links",
    services: "Services",
    availableGlobally: "Available Globally",
    copyrightText: "Jai Guru Astro Remedy. All rights reserved.",
    yearsOfExcellence: "18+ Years of Excellence",
    trustedByClients: "Trusted by 10,000+ Clients Worldwide",
    importantDisclaimer: "Important Disclaimer",
    disclaimerText: "Astrological predictions are for guidance purposes only. Results may vary based on individual circumstances and planetary influences.",
    aboutArupShastri: "About Arup Shastri",
    
    // Common
    welcome: "Welcome",
    loading: "Loading...",
    error: "Error",
    success: "Success",
  },
  hi: {
    // Navigation - Hindi
    home: "होम",
    bookConsultation: "परामर्श बुक करें",
    courses: "पाठ्यक्रम",
    homeTuition: "होम ट्यूशन",
    products: "उत्पाद",
    adminDashboard: "एडमिन डैशबोर्ड",
    login: "लॉगिन",
    logout: "लॉगआउट",
    
    // Hero Section - Hindi
    heroTitle: "अपनी ब्रह्मांडीय नियति खोजें",
    heroSubtitle: "ज्योतिषी अरुप शास्त्री के विशेषज्ञ वैदिक ज्योतिष परामर्श के साथ ब्रह्मांड के रहस्यों को अनलॉक करें - 18+ साल का परिवर्तनकारी मार्गदर्शन",
    bookReadingNow: "अपना रीडिंग अभी बुक करें",
    exploreCourses: "पाठ्यक्रम खोजें",
    
    // Stats - Hindi
    yearsExperience: "वर्षों का अनुभव",
    satisfiedClients: "संतुष्ट ग्राहक",
    countriesServed: "देश सेवित",
    
    // Additional service tags - Hindi
    authenticBlessed: "प्रामाणिक और आशीर्वादित",
    sacredGeometry: "पवित्र ज्यामिति", 
    mindBodyHarmony: "मन शरीर सामंजस्य",
    sacredHomeVisits: "पवित्र घर यात्राएं",
    
    // About Section - Hindi
    meetAstrologer: "ज्योतिषी अरुप शास्त्री से मिलें",
    astrologerDescription: "वैदिक ज्योतिष में 18 से अधिक वर्षों के समर्पित अभ्यास के साथ, ज्योतिषी अरुप शास्त्री ने हजारों आत्माओं को स्पष्टता, उद्देश्य और ब्रह्मांडीय संरेखण की दिशा में मार्गदर्शन किया है।",
    scheduleConsultation: "व्यक्तिगत परामर्श निर्धारित करें",
    
    // Footer specific translations - Hindi
    videoConsultation: "वीडियो परामर्श",
    audioConsultation: "ऑडियो परामर्श",
    chatConsultation: "चैट परामर्श",
    inPersonReading: "व्यक्तिगत रीडिंग",
    astrologicalRemedies: "ज्योतिषीय उपचार",
    contactLegal: "संपर्क और कानूनी",
    privacyPolicy: "गोपनीयता नीति",
    termsOfService: "सेवा की शर्तें",
    disclaimer: "अस्वीकरण",
    refundPolicy: "वापसी नीति",
    quickLinks: "त्वरित लिंक",
    services: "सेवाएं",
    availableGlobally: "विश्वव्यापी उपलब्ध",
    copyrightText: "जय गुरु एस्ट्रो रेमेडी। सभी अधिकार सुरक्षित।",
    yearsOfExcellence: "18+ वर्षों की उत्कृष्टता",
    trustedByClients: "दुनिया भर के 10,000+ ग्राहकों द्वारा भरोसेमंद",
    importantDisclaimer: "महत्वपूर्ण अस्वीकरण",
    disclaimerText: "ज्योतिषीय भविष्यवाणियां केवल मार्गदर्शन के उद्देश्यों के लिए हैं। व्यक्तिगत परिस्थितियों और ग्रह प्रभावों के आधार पर परिणाम भिन्न हो सकते हैं।",
    aboutArupShastri: "अरुप शास्त्री के बारे में",
    
    // Common - Hindi
    welcome: "स्वागत",
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",
  },
  bn: {
    // Navigation - Bengali
    home: "হোম",
    bookConsultation: "পরামর্শ বুক করুন",
    courses: "কোর্স",
    homeTuition: "হোম টিউশন",
    products: "পণ্য",
    adminDashboard: "অ্যাডমিন ড্যাশবোর্ড",
    login: "লগইন",
    logout: "লগআউট",
    
    // Hero Section - Bengali
    heroTitle: "আপনার মহাজাগতিক নিয়তি আবিষ্কার করুন",
    heroSubtitle: "জ্যোতিষী অরুপ শাস্ত্রীর বিশেষজ্ঞ বৈদিক জ্যোতিষ পরামর্শের সাথে মহাবিশ্বের রহস্য উন্মোচন করুন - 18+ বছরের রূপান্তরকারী নির্দেশনা",
    bookReadingNow: "এখনই আপনার রিডিং বুক করুন",
    exploreCourses: "কোর্স অন্বেষণ করুন",
    
    // Stats - Bengali
    yearsExperience: "বছরের অভিজ্ঞতা",
    satisfiedClients: "সন্তুষ্ট ক্লায়েন্ট",
    countriesServed: "দেশ পরিবেশিত",
    
    // Profile Section - Bengali
    meetAstrologer: "জ্যোতিষী অরুপ শাস্ত্রীর সাথে দেখা করুন",
    astrologerDescription: "বৈদিক জ্যোতিষশাস্ত্রে 18 বছরের বেশি নিবেদিত অনুশীলনের সাথে, জ্যোতিষী অরুপ শাস্ত্রী হাজার হাজার আত্মাকে স্পষ্টতা, উদ্দেশ্য এবং মহাজাগতিক সংযোগের দিকে পরিচালিত করেছেন।",
    scheduleConsultation: "ব্যক্তিগত পরামর্শের সময়সূচী",
    
    // Price ranges
    under1000: "১,০০০ টাকার নীচে",
    from1000To5000: "১,০০০ - ৥,০০০ টাকা",
    over5000: "৥,০০০ টাকার উপরে",
    productsBn: "পণ্যগুলি",
    
    // Expertise Areas - Bengali  
    vedicAstrology: "বৈদিক জ্যোতিষশাস্ত্র",
    vedicAstrologyDesc: "ঐতিহ্যবাহী জন্ম তালিকা বিশ্লেষণ",
    palmistry: "হস্তরেখা বিদ্যা",
    palmistryDesc: "হাত পড়া এবং জীবনের অন্তর্দৃষ্টি",
    numerology: "সংখ্যাতত্ত্ব",
    numerologyDesc: "সংখ্যার নিদর্শন এবং নিয়তি",
    cosmicRemedies: "মহাজাগতিক প্রতিকার",
    cosmicRemediesDesc: "নিরাময় সমাধান এবং নির্দেশনা",
    vedicVastu: "বৈদিক বাস্তু শাস্ত্র",
    vedicVastuDesc: "নির্মাণ ও সামঞ্জস্যের বিজ্ঞান",
    yogaMeditation: "যোগব্যায়াম ও ধ্যান",
    yogaMeditationDesc: "প্রাণায়াম এবং আধ্যাত্মিক অনুশীলন",
    
    // Services Section - Bengali
    consultationServices: "পরামর্শ সেবা",
    servicesDescription: "ব্যক্তিগতকৃত মহাজাগতিক নির্দেশনা প্রদানের জন্য ডিজাইন করা একাধিক পরামর্শ ফরম্যাট থেকে বেছে নিন",
    
    // Service Types - Bengali
    videoCall: "ভিডিও কল",
    audioCall: "অডিও কল",
    chatSession: "চ্যাট সেশন", 
    inPerson: "ব্যক্তিগতভাবে",
    homeService: "বাড়ির সেবা",
    
    // Service Descriptions - Bengali
    videoCallDesc: "জিটসি মিট ব্যবহার করে নিরাপদ ভিডিও কলের মাধ্যমে মুখোমুখি পরামর্শ",
    audioCallDesc: "কেন্দ্রীভূত আধ্যাত্মিক নির্দেশনা এবং স্পষ্টতার জন্য শুধুমাত্র ভয়েস পরামর্শ",
    chatSessionDesc: "নিরাপদ ইন-অ্যাপ মেসেজিং সিস্টেমের মাধ্যমে টেক্সট-ভিত্তিক পরামর্শ",
    inPersonDesc: "মনোনীত স্থানে ঐতিহ্যবাহী মুখোমুখি পরামর্শ",
    homeServiceDesc: "ব্যক্তিগতকৃত আচার-অনুষ্ঠান সহ আপনার বাড়িতে প্রিমিয়াম পরামর্শ",
    
    // Service Buttons - Bengali
    bookVideoSession: "ভিডিও সেশন বুক করুন",
    bookAudioSession: "অডিও সেশন বুক করুন",
    startChatSession: "চ্যাট সেশন শুরু করুন", 
    bookInPerson: "ব্যক্তিগত বুকিং",
    bookHomeService: "হোম সার্ভিস বুক করুন",
    
    // Additional Services - Bengali
    allServices: "সমস্ত সেবা",
    
    // Course specific translations
    astrologyFundamentals: "জ্যোতিষশাস্ত্রের মৌলিক বিষয়",
    perfectForBeginners: "নতুনদের জন্য নিখুঁত। বৈদিক জ্যোতিষশাস্ত্র, রাশিচক্র, ঘর এবং গ্রহের প্রভাবের মূল বিষয়গুলি শিখুন।",
    traditionalWisdom: "ঐতিহ্যগত জ্ঞান",
    sacredHomeVisits: "পবিত্র বাড়িতে ভিজিট",
    beginner: "সাধারণ",
    intermediate: "মধ্যম",
    expert: "দক্ষ",
    learnMore: "আরও জানুন",
    yogaMeditationBn: "যোগ ও ধ্যান",
    
    // Testimonials
    priyaSharma: "প্রিয়া শর্মা",
    michaelJohnson: "মাইকেল জনসন",
    sarahMitchell: "সারা মিচেল",
    testimonial1: "জ্যোতিষী অরুপ শাস্ত্রীর অন্তর্দৃষ্টি আমার জীবনের দৃষ্টিভঙ্গি সম্পূর্ণভাবে পরিবর্তন করেছে। তার নির্ভুল ভবিষ্যদ্বাণী এবং প্রতিকার আমাকে আমার কর্মজীবনের পথে স্পষ্টতা খুঁজে পেতে সাহায্য করেছে। অত্যন্ত সুপারিশযোগ্য!",
    testimonial2: "আশ্চর্যজনক অভিজ্ঞতা! ভিডিও পরামর্শ ছিল স্ফটিক স্বচ্ছ এবং অরুপের জ্ঞান গভীর। রত্ন পাথরের সুপারিশগুলি আমার সম্পর্কের জন্য বিস্ময়কর কাজ করেছে।",
    testimonial3: "জ্যোতিষশাস্ত্র কোর্সটি অবিশ্বাস্যভাবে ব্যাপক ছিল। অরুপের শিক্ষাদানের ধরন স্পষ্ট এবং ব্যবহারিক অনুশীলন সত্যিই আমাকে গভীরভাবে ধারণাগুলি বুঝতে সাহায্য করেছে।",
    
    // Location names in Bengali script
    mumbaiIndia: "মুম্বাই, ভারত",
    newYorkUSA: "নিউ ইয়র্ক, যুক্তরাষ্ট্র",
    londonUK: "লন্দন, যুক্তরাজ্য",
    allServicesDescription: "আপনার মহাজাগতিক যাত্রায় গাইড করার জন্য ডিজাইন করা ব্যাপক জ্যোতিষশাস্ত্রীয় সমাধান",
    liveConsultations: "লাইভ পরামর্শ",
    liveConsultationsDesc: "ব্যক্তিগত মহাজাগতিক নির্দেশনার জন্য ভিডিও, অডিও, চ্যাট এবং ব্যক্তিগত সেশন",
    vedicAstrologyCourses: "বৈদিক জ্যোতিষশাস্ত্র কোর্স",
    vedicAstrologyCoursesDesc: "ব্যাপক অনলাইন এবং অফলাইন শিক্ষা প্রোগ্রামের মাধ্যমে প্রাচীন জ্ঞানে দক্ষতা অর্জন করুন",
    startingFrom: "থেকে শুরু",
    beginnerToExpert: "শিক্ষানবিস থেকে বিশেষজ্ঞ",
    
    // Additional service tags - Bengali
    authenticBlessed: "প্রামাণিক ও আশীর্বাদপ্রাপ্ত",
    sacredGeometry: "পবিত্র জ্যামিতি", 
    mindBodyHarmony: "মন দেহ সামঞ্জস্য",
    
    // Footer specific translations - Bengali
    videoConsultation: "ভিডিও পরামর্শ",
    audioConsultation: "অডিও পরামর্শ",
    chatConsultation: "চ্যাট পরামর্শ",
    inPersonReading: "ব্যক্তিগত রিডিং",
    astrologicalRemedies: "জ্যোতিষশাস্ত্রীয় প্রতিকার",
    contactLegal: "যোগাযোগ ও আইনি",
    privacyPolicy: "গোপনীয়তা নীতি",
    termsOfService: "সেবার শর্তাবলী",
    disclaimer: "দাবিত্যাগ",
    refundPolicy: "ফেরত নীতি",
    quickLinks: "দ্রুত লিঙ্ক",
    services: "সেবা",
    availableGlobally: "বিশ্বব্যাপী উপলব্ধ",
    copyrightText: "জয় গুরু এস্ট্রো রেমেডি। সকল অধিকার সংরক্ষিত।",
    yearsOfExcellence: "১৮+ বছরের উৎকর্ষতা",
    trustedByClients: "বিশ্বব্যাপী ১০,০০০+ ক্লায়েন্টের বিশ্বস্ত",
    importantDisclaimer: "গুরুত্বপূর্ণ দাবিত্যাগ",
    disclaimerText: "জ্যোতিষশাস্ত্রীয় ভবিষ্যদ্বাণী শুধুমাত্র নির্দেশনার উদ্দেশ্যে। ব্যক্তিগত পরিস্থিতি এবং গ্রহের প্রভাবের ভিত্তিতে ফলাফল ভিন্ন হতে পারে।",
    aboutArupShastri: "অরুপ শাস্ত্রী সম্পর্কে",
    
    // Common UI elements
    select: "নির্বাচন করুন",
    language: "ভাষা",
    english: "ইংরেজি",
    bengali: "বাংলা",
    profile: "প্রোফাইল",
    logoutBn: "লগআউট",
    menu: "মেনু",
    close: "বন্ধ করুন",
    
    // Form elements
    submit: "জমা দিন",
    cancel: "বাতিল",
    save: "সংরক্ষণ",
    edit: "সম্পাদনা",
    delete: "মুছে ফেলুন",
    name: "নাম",
    email: "ইমেইল",
    phone: "ফোন",
    message: "বার্তা",
    
    // Product categories
    allProducts: "সকল পণ্য",
    gemstones: "রত্ন পাথর",
    sacredYantras: "পবিত্র যন্ত্র",
    spiritualMalas: "আধ্যাত্মিক মালা",
    astrologyBooks: "জ্যোতিষশাস্ত্রের বই",
    remedyKits: "প্রতিকার কিট",
    
    // Product descriptions
    browseAllCosmicRemedies: "আমাদের সকল মহাজাগতিক প্রতিকার দেখুন",
    authenticCertifiedGemstones: "গ্রহের প্রতিকারের জন্য প্রামাণিক প্রমাণিত রত্ন পাথর",
    energizedGeometricPatterns: "সমৃদ্ধির জন্য শক্তিশালী জ্যামিতিক নমুনা",
    rudrakshaGemstoneForMeditation: "ধ্যানের জন্য রুদ্রাক্ষ এবং রত্ন মালা",
    comprehensiveAncientWisdom: "ব্যাপক গাইড এবং প্রাচীন জ্ঞানের গ্রন্থ",
    completePersonalizedRemedySolutions: "সম্পূর্ণ ব্যক্তিগতকৃত প্রতিকার সমাধাঢ",
    
    // Search and filter placeholders
    searchProductsByName: "নাম বা বর্ণনা দিয়ে পণ্য অনুসন্ধান করুন...",
    searchCoursesByTitle: "শীর্ষক বা বর্ণনা দিয়ে কোর্স অনুসন্ধান করুন...",
    category: "বিভাগ",
    price: "দাম",
    level: "স্তর",
    allLevels: "সকল স্তর",
    allPrices: "সকল দাম",
    allLanguages: "সকল ভাষা",
    selectTime: "সময় নির্বাচন করুন",
    
    // Status messages
    noProductsFound: "কোন পণ্য পাওয়া যায়নি",
    noCoursesFound: "কোন কোর্স পাওয়া যায়নি",
    loginRequired: "লগইন প্রয়োজন",
    tryAdjustingSearchCriteria: "আপনার অনুসন্ধানের মাপদণ্ড সমন্বয় করার চেষ্টা করুন",
    productsAvailableSoon: "পণ্য খুব শীঘ্রই উপলব্ধ হবে",
    coursesAvailableSoon: "কোর্স খুব শীঘ্রই উপলব্ধ হবে",
    
    // Button text
    enrollNow: "এখনই ভর্তি হন",
    enrolling: "ভর্তি হচ্ছে...",
    bookConsultationNow: "এখনই পরামর্শ বুক করুন",
    viewAllCourses: "সকল কোর্স দেখুন",
    browseAllProducts: "সকল পণ্য ব্রাউজ করুন",
    
    // Statistics
    totalCourses: "মোট কোর্স",
    activeStudents: "সক্রিয় ছাত্রছাত্রী",
    averageRating: "গড় রেটিং",
    hoursOfContent: "ঘন্টা বিষয়বস্তু",
    
    // Error messages
    enrollmentFailed: "নামনিবন্ধন ব্যর্থ",
    failedToEnrollInCourse: "কোর্সে নামনিবন্ধন ব্যর্থ হয়েছে",
    pleaseLoginToEnrollInCourses: "কোর্সে নামনিবন্ধনের জন্য অনুগ্রহ করে লগইন করুন",
    
    // English labels for SelectItems
    englishBn: "ইংরেজি",
    hindiBn: "হিন্দি",
    
    // Testimonials & CTA - Bengali
    readyToDiscover: "আপনার মহাজাগতিক পথ আবিষ্কার করতে প্রস্তুত?",
    bookPersonalizedConsultation: "আজই আপনার ব্যক্তিগতকৃত পরামর্শ বুক করুন এবং জ্যোতিষী অরুপ শাস্ত্রীর বিশেষজ্ঞ নির্দেশনার সাথে আপনার নিয়তির রহস্য উন্মোচন করুন।",
    discoverGuidance: "আবিষ্কার করুন কীভাবে জ্যোতিষী অরুপ শাস্ত্রীর মহাজাগতিক নির্দেশনা বিশ্বব্যাপী জীবনকে রূপান্তরিত করেছে",
    quickBooking: "দ্রুত বুকিং",
    
    // Service full descriptions - Bengali
    vedicAstrologyFullDesc: "ব্যক্তিগতকৃত মহাজাগতিক অন্তর্দৃষ্টি এবং প্রতিকারমূলক নির্দেশনা সহ ঐতিহ্যগত জন্ম চার্ট বিশ্লেষণ",
    palmistryFullDesc: "গভীর আধ্যাত্মিক অন্তর্দৃষ্টির জন্য হস্তরেখা, সংখ্যাতত্ত্ব এবং জন্ম চার্ট বিশ্লেষণ", 
    numerologyFullDesc: "জীবনের পথের স্বচ্ছতার জন্য পবিত্র সংখ্যার নিদর্শন এবং ভাগ্য বিশ্লেষণ",
    cosmicRemediesFullDesc: "ইতিবাচক শক্তি রূপান্তরের জন্য প্রামাণিক রত্ন, যন্ত্র এবং আধ্যাত্মিক পণ্য",
    vedicVastuFullDesc: "ইতিবাচক জীবনযাত্রার স্থানের জন্য নির্মাণ এবং স্থাপত্য সামঞ্জস্যের বিজ্ঞান",
    yogaMeditationFullDesc: "অভ্যন্তরীণ শান্তি এবং ভারসাম্যের জন্য প্রাণায়াম শ্বাস কৌশল এবং আধ্যাত্মিক অনুশীলন",
    homeServiceFullDesc: "ব্যক্তিগত আচার-অনুষ্ঠান এবং পবিত্র অনুষ্ঠান সহ আপনার বাড়িতে প্রিমিয়াম পরামর্শ",
    
    // Testimonial names (keeping original)  
    priyaSharmaBn: "প্রিয়া শর্মা",
    michaelJohnsonBn: "মাইকেল জনসন", 
    sarahMitchellBn: "সারাহ মিচেল",
    
    // Common - Bengali
    welcome: "স্বাগতম",
    loading: "লোড হচ্ছে...",
    error: "ত্রুটি",
    success: "সফল",
  },
  es: {
    // Navigation - Spanish
    home: "Inicio",
    bookConsultation: "Reservar Consulta",
    courses: "Cursos",
    homeTuition: "Tutoría en Casa",
    products: "Productos",
    adminDashboard: "Panel de Administrador",
    login: "Iniciar Sesión",
    logout: "Cerrar Sesión",
    
    // Hero Section - Spanish
    heroTitle: "Descubre Tu Destino Cósmico",
    heroSubtitle: "Desbloquea los secretos del universo con consultas expertas de astrología védica por el Astrólogo Arup Shastri - 18+ años de guía transformadora",
    bookReadingNow: "Reserva Tu Lectura Ahora",
    exploreCourses: "Explorar Cursos",
    
    // Stats - Spanish
    yearsExperience: "Años de Experiencia",
    satisfiedClients: "Clientes Satisfechos",
    countriesServed: "Países Atendidos",
    
    // Profile Section - Spanish
    meetAstrologer: "Conoce al Astrólogo Arup Shastri",
    astrologerDescription: "Con más de 18 años de práctica dedicada en astrología védica, el Astrólogo Arup Shastri ha guiado a miles de almas hacia la claridad, propósito y alineación cósmica.",
    scheduleConsultation: "Programar Consulta Personal",
    
    // Expertise Areas - Spanish
    vedicAstrology: "Astrología Védica",
    vedicAstrologyDesc: "Análisis tradicional de carta natal",
    palmistry: "Quiromancia",
    palmistryDesc: "Lectura de manos e insights de vida",
    numerology: "Numerología",
    numerologyDesc: "Patrones numéricos y destino",
    cosmicRemedies: "Remedios Cósmicos",
    cosmicRemediesDesc: "Soluciones curativas y orientación",
    vedicVastu: "Vedic Vastu Shastra",
    vedicVastuDesc: "Ciencia de construcción y armonía",
    yogaMeditation: "Yoga y Meditación",
    yogaMeditationDesc: "Pranayam y prácticas espirituales",
    
    // Services Section - Spanish
    consultationServices: "Servicios de Consulta",
    servicesDescription: "Elige entre múltiples formatos de consulta diseñados para brindarte orientación cósmica personalizada",
    
    // Service Types - Spanish
    videoCall: "Videollamada",
    audioCall: "Llamada de Audio",
    chatSession: "Sesión de Chat",
    inPerson: "En Persona",
    homeService: "Servicio a Domicilio",
    
    // Service Descriptions - Spanish
    videoCallDesc: "Consulta cara a cara a través de videollamada segura usando Jitsi Meet",
    audioCallDesc: "Consulta solo de voz para orientación espiritual enfocada y claridad",
    chatSessionDesc: "Consulta basada en texto a través del sistema de mensajería segura en la aplicación",
    inPersonDesc: "Consultas tradicionales cara a cara en ubicaciones designadas",
    homeServiceDesc: "Consulta premium en tu hogar con rituales personalizados",
    
    // Service Buttons - Spanish
    bookVideoSession: "Reservar Sesión de Video",
    bookAudioSession: "Reservar Sesión de Audio",
    startChatSession: "Iniciar Sesión de Chat",
    bookInPerson: "Reservar En Persona",
    bookHomeService: "Reservar Servicio a Domicilio",
    
    // Additional Services - Spanish
    allServices: "Todos los Servicios",
    allServicesDescription: "Soluciones astrológicas integrales diseñadas para guiarte en tu viaje cósmico",
    liveConsultations: "Consultas en Vivo",
    liveConsultationsDesc: "Sesiones de Video, Audio, Chat y En Persona para orientación cósmica personalizada",
    vedicAstrologyCourses: "Cursos de Astrología Védica",
    vedicAstrologyCoursesDesc: "Domina la sabiduría antigua a través de programas de aprendizaje completos en línea y fuera de línea",
    startingFrom: "A partir de",
    beginnerToExpert: "De Principiante a Experto",
    
    // Common - Spanish
    welcome: "Bienvenido",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
  },
  fr: {
    // Navigation - French
    home: "Accueil",
    bookConsultation: "Réserver une Consultation",
    courses: "Cours",
    homeTuition: "Cours à Domicile",
    products: "Produits",
    adminDashboard: "Tableau de Bord Admin",
    login: "Connexion",
    logout: "Déconnexion",
    
    // Hero Section - French
    heroTitle: "Découvrez Votre Destin Cosmique",
    heroSubtitle: "Débloquez les secrets de l'univers avec des consultations expertes d'astrologie védique par l'Astrologue Arup Shastri - 18+ années de guidance transformatrice",
    bookReadingNow: "Réservez Votre Lecture Maintenant",
    exploreCourses: "Explorer les Cours",
    
    // Stats - French
    yearsExperience: "Années d'Expérience",
    satisfiedClients: "Clients Satisfaits",
    countriesServed: "Pays Servis",
    
    // Profile Section - French
    meetAstrologer: "Rencontrez l'Astrologue Arup Shastri",
    astrologerDescription: "Avec plus de 18 années de pratique dédiée en astrologie védique, l'Astrologue Arup Shastri a guidé des milliers d'âmes vers la clarté, le but et l'alignement cosmique.",
    scheduleConsultation: "Planifier une Consultation Personnelle",
    
    // Expertise Areas - French
    vedicAstrology: "Astrologie Védique",
    vedicAstrologyDesc: "Analyse traditionnelle de thème natal",
    palmistry: "Chiromancie",
    palmistryDesc: "Lecture des mains et insights de vie",
    numerology: "Numérologie",
    numerologyDesc: "Modèles numériques et destin",
    cosmicRemedies: "Remèdes Cosmiques",
    cosmicRemediesDesc: "Solutions de guérison et orientation",
    vedicVastu: "Vedic Vastu Shastra",
    vedicVastuDesc: "Science de construction et harmonie",
    yogaMeditation: "Yoga et Méditation",
    yogaMeditationDesc: "Pranayam et pratiques spirituelles",
    
    // Services Section - French
    consultationServices: "Services de Consultation",
    servicesDescription: "Choisissez parmi plusieurs formats de consultation conçus pour vous fournir des conseils cosmiques personnalisés",
    
    // Service Types - French
    videoCall: "Appel Vidéo",
    audioCall: "Appel Audio",
    chatSession: "Session de Chat",
    inPerson: "En Personne",
    homeService: "Service à Domicile",
    
    // Service Descriptions - French
    videoCallDesc: "Consultation face à face via appel vidéo sécurisé utilisant Jitsi Meet",
    audioCallDesc: "Consultation audio uniquement pour des conseils spirituels ciblés et de la clarté",
    chatSessionDesc: "Consultation basée sur le texte via le système de messagerie sécurisé de l'application",
    inPersonDesc: "Consultations traditionnelles face à face dans des lieux désignés",
    homeServiceDesc: "Consultation premium à votre domicile avec des rituels personnalisés",
    
    // Service Buttons - French
    bookVideoSession: "Réserver une Séance Vidéo",
    bookAudioSession: "Réserver une Séance Audio",
    startChatSession: "Démarrer une Séance de Chat",
    bookInPerson: "Réserver En Personne",
    bookHomeService: "Réserver un Service à Domicile",
    
    // Additional Services - French
    allServices: "Tous les Services",
    allServicesDescription: "Solutions astrologiques complètes conçues pour vous guider dans votre voyage cosmique",
    liveConsultations: "Consultations en Direct",
    liveConsultationsDesc: "Séances Vidéo, Audio, Chat et En Personne pour des conseils cosmiques personnalisés",
    vedicAstrologyCourses: "Cours d'Astrologie Védique",
    vedicAstrologyCoursesDesc: "Maîtrisez la sagesse ancienne grâce à des programmes d'apprentissage complets en ligne et hors ligne",
    startingFrom: "À partir de",
    beginnerToExpert: "Débutant à Expert",
    
    // Common - French
    welcome: "Bienvenue",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
  },
  // Adding basic translations for other languages
  de: {
    home: "Startseite",
    bookConsultation: "Beratung Buchen",
    courses: "Kurse",
    homeTuition: "Hausunterricht",
    products: "Produkte",
    adminDashboard: "Admin Dashboard",
    login: "Anmelden",
    logout: "Abmelden",
    heroTitle: "Entdecke Dein Kosmisches Schicksal",
    heroSubtitle: "Entsperren Sie die Geheimnisse des Universums mit Expertenkonsultationen der vedischen Astrologie von Astrologe Arup Shastri - 18+ Jahre transformative Führung",
    bookReadingNow: "Buche Deine Lesung Jetzt",
    exploreCourses: "Kurse Erkunden",
    yearsExperience: "Jahre Erfahrung",
    satisfiedClients: "Zufriedene Kunden",
    countriesServed: "Bediente Länder",
    meetAstrologer: "Treffe Astrologe Arup Shastri",
    welcome: "Willkommen",
    loading: "Lädt...",
    error: "Fehler",
    success: "Erfolg",
  },
  it: {
    home: "Home",
    bookConsultation: "Prenota Consulenza",
    courses: "Corsi",
    homeTuition: "Lezioni a Casa",
    products: "Prodotti",
    adminDashboard: "Dashboard Admin",
    login: "Accedi",
    logout: "Esci",
    heroTitle: "Scopri Il Tuo Destino Cosmico",
    heroSubtitle: "Sblocca i segreti dell'universo con consultazioni esperte di astrologia vedica dall'Astrologo Arup Shastri - 18+ anni di guida trasformativa",
    bookReadingNow: "Prenota La Tua Lettura Ora",
    exploreCourses: "Esplora Corsi",
    yearsExperience: "Anni di Esperienza",
    satisfiedClients: "Clienti Soddisfatti",
    countriesServed: "Paesi Serviti",
    meetAstrologer: "Incontra l'Astrologo Arup Shastri",
    welcome: "Benvenuto",
    loading: "Caricamento...",
    error: "Errore",
    success: "Successo",
  },
  pt: {
    home: "Início",
    bookConsultation: "Reservar Consulta",
    courses: "Cursos",
    homeTuition: "Aulas em Casa",
    products: "Produtos",
    adminDashboard: "Painel Admin",
    login: "Entrar",
    logout: "Sair",
    heroTitle: "Descubra Seu Destino Cósmico",
    heroSubtitle: "Desbloqueie os segredos do universo com consultas especializadas em astrologia védica pelo Astrólogo Arup Shastri - 18+ anos de orientação transformadora",
    bookReadingNow: "Reserve Sua Leitura Agora",
    exploreCourses: "Explorar Cursos",
    yearsExperience: "Anos de Experiência",
    satisfiedClients: "Clientes Satisfeitos",
    countriesServed: "Países Atendidos",
    meetAstrologer: "Conheça o Astrólogo Arup Shastri",
    welcome: "Bem-vindo",
    loading: "Carregando...",
    error: "Erro",
    success: "Sucesso",
  },
  ru: {
    home: "Главная",
    bookConsultation: "Записаться на Консультацию",
    courses: "Курсы",
    homeTuition: "Домашнее Обучение",
    products: "Продукты",
    adminDashboard: "Админ Панель",
    login: "Войти",
    logout: "Выйти",
    heroTitle: "Откройте Свою Космическую Судьбу",
    heroSubtitle: "Разблокируйте секреты вселенной с экспертными консультациями ведической астрологии от Астролога Арупа Шастри - 18+ лет трансформирующего руководства",
    bookReadingNow: "Забронируйте Чтение Сейчас",
    exploreCourses: "Изучить Курсы",
    yearsExperience: "Лет Опыта",
    satisfiedClients: "Довольные Клиенты", 
    countriesServed: "Обслуженные Страны",
    meetAstrologer: "Познакомьтесь с Астрологом Арупом Шастри",
    welcome: "Добро пожаловать",
    loading: "Загрузка...",
    error: "Ошибка",
    success: "Успех",
  },
  zh: {
    home: "首页",
    bookConsultation: "预约咨询",
    courses: "课程",
    homeTuition: "家教",
    products: "产品",
    adminDashboard: "管理面板",
    login: "登录",
    logout: "退出",
    heroTitle: "发现您的宇宙命运",
    heroSubtitle: "通过占星师阿鲁普·沙斯特里的专业吠陀占星咨询解锁宇宙的秘密 - 18+年的变革性指导",
    bookReadingNow: "立即预订阅读",
    exploreCourses: "探索课程",
    yearsExperience: "年经验",
    satisfiedClients: "满意客户",
    countriesServed: "服务国家",
    meetAstrologer: "认识占星师阿鲁普·沙斯特里",
    welcome: "欢迎",
    loading: "加载中...",
    error: "错误",
    success: "成功",
  },
  ja: {
    home: "ホーム",
    bookConsultation: "相談を予約",
    courses: "コース",
    homeTuition: "家庭教師",
    products: "製品",
    adminDashboard: "管理ダッシュボード",
    login: "ログイン",
    logout: "ログアウト",
    heroTitle: "あなたの宇宙的運命を発見",
    heroSubtitle: "占星術師アルップ・シャストリによる専門的なヴェーダ占星術相談で宇宙の秘密を解き明かす - 18+年の変革的指導",
    bookReadingNow: "今すぐリーディングを予約",
    exploreCourses: "コースを探索",
    yearsExperience: "年の経験",
    satisfiedClients: "満足したクライアント",
    countriesServed: "サービス提供国",
    meetAstrologer: "占星術師アルップ・シャストリに会う",
    welcome: "ようこそ",
    loading: "読み込み中...",
    error: "エラー",
    success: "成功",
  },
  ko: {
    home: "홈",
    bookConsultation: "상담 예약",
    courses: "강의",
    homeTuition: "홈 튜터링",
    products: "제품",
    adminDashboard: "관리자 대시보드",
    login: "로그인",
    logout: "로그아웃",
    heroTitle: "당신의 우주적 운명을 발견하세요",
    heroSubtitle: "점성술사 아룹 샤스트리의 전문적인 베다 점성술 상담으로 우주의 비밀을 풀어보세요 - 18+년의 변화적 안내",
    bookReadingNow: "지금 리딩 예약",
    exploreCourses: "강의 탐색",
    yearsExperience: "년 경험",
    satisfiedClients: "만족한 고객",
    countriesServed: "서비스 제공 국가",
    meetAstrologer: "점성술사 아룹 샤스트리를 만나보세요",
    welcome: "환영합니다",
    loading: "로딩 중...",
    error: "오류",
    success: "성공",
  },
  ar: {
    home: "الرئيسية",
    bookConsultation: "حجز استشارة",
    courses: "الدورات",
    homeTuition: "التدريس المنزلي",
    products: "المنتجات",
    adminDashboard: "لوحة الإدارة",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    heroTitle: "اكتشف مصيرك الكوني",
    heroSubtitle: "اكتشف أسرار الكون مع استشارات علم التنجيم الفيدي المتخصصة من المنجم أروب شاستري - 18+ عامًا من التوجيه التحويلي",
    bookReadingNow: "احجز قراءتك الآن",
    exploreCourses: "استكشف الدورات",
    yearsExperience: "سنوات الخبرة",
    satisfiedClients: "العملاء الراضون",
    countriesServed: "البلدان المخدومة",
    meetAstrologer: "التق بالمنجم أروب شاستري",
    welcome: "أهلاً وسهلاً",
    loading: "جاري التحميل...",
    error: "خطأ",
    success: "نجح",
  },
  
  // Indian Languages
  te: { // Telugu
    home: "హోమ్", bookConsultation: "సంప్రదింపు బుక్ చేయండి", courses: "కోర్సులు", homeTuition: "హోమ్ ట్యూషన్", products: "ఉత్పత్తులు", adminDashboard: "అడ్మిన్ డ్యాష్‌బోర్డ్", login: "లాగిన్", logout: "లాగౌట్",
    heroTitle: "మీ కాస్మిక్ విధిని కనుగొనండి", heroSubtitle: "జ్యోతిష్కుడు అరుప్ శాస్త్రి యొక్క నిపుణ వేద జ్యోతిష్య సంప్రదింపులతో విశ్వం యొక్క రహస్యాలను అన్లాక్ చేయండి", bookReadingNow: "ఇప్పుడే మీ రీడింగ్ బుక్ చేయండి", exploreCourses: "కోర్సులను అన్వేషించండి",
    yearsExperience: "సంవత్సరాల అనుభవం", satisfiedClients: "సంతృప్త క్లయింట్లు", countriesServed: "దేశాలు సేవించబడ్డాయి", meetAstrologer: "జ్యోతిష్కుడు అరుప్ శాస్త్రిని కలవండి", welcome: "స్వాగతం", loading: "లోడ్ అవుతుంది...", error: "లోపం", success: "విజయం"
  },
  
  mr: { // Marathi
    home: "होम", bookConsultation: "सल्लामसलत बुक करा", courses: "अभ्यासक्रम", homeTuition: "होम ट्यूशन", products: "उत्पादने", adminDashboard: "अॅडमिन डॅशबोर्ड", login: "लॉगिन", logout: "लॉगआउट",
    heroTitle: "तुमचे कॉस्मिक नशीब शोधा", heroSubtitle: "ज्योतिषी अरुप शास्त्री यांच्या तज्ज्ञ वैदिक ज्योतिष सल्लामसलतीसह विश्वाचे रहस्य अनलॉक करा", bookReadingNow: "आताच तुमचे वाचन बुक करा", exploreCourses: "अभ्यासक्रम अन्वेषण करा",
    yearsExperience: "वर्षांचा अनुभव", satisfiedClients: "समाधानी क्लायंट", countriesServed: "देश सेवा दिली", meetAstrologer: "ज्योतिषी अरुप शास्त्री यांना भेटा", welcome: "स्वागत", loading: "लोड होत आहे...", error: "चूक", success: "यश"
  },
  
  ta: { // Tamil  
    home: "முகப்பு", bookConsultation: "ஆலோசனை பதிவு", courses: "பாடப்பிரிவுகள்", homeTuition: "வீட்டுப் பயிற்சி", products: "பொருள்கள்", adminDashboard: "நிர்வாக டாஷ்போர்டு", login: "உள்நுழை", logout: "வெளியேறு",
    heroTitle: "உங்கள் பிரபஞ்ச விதியைக் கண்டறியுங்கள்", heroSubtitle: "ஜோதிடர் அருப் ஷாஸ்திரியின் நிபுண வேத ஜோதிட ஆலோசனைகளுடன் பிரபஞ்சத்தின் ரகசியங்களை திறக்கவும்", bookReadingNow: "இப்போதே உங்கள் வாசிப்பை பதிவு செய்யுங்கள்", exploreCourses: "பாடப்பிரிவுகளை ஆராயுங்கள்",
    yearsExperience: "வருட அனுபவம்", satisfiedClients: "திருப்தியான வாடிக்கையாளர்கள்", countriesServed: "நாடுகள் சேவை", meetAstrologer: "ஜோதிடர் அருப் ஷாஸ்திரியை சந்திக்கவும்", welcome: "வருக", loading: "ஏற்றுகிறது...", error: "பிழை", success: "வெற்றி"
  },
  
  gu: { // Gujarati
    home: "ઘર", bookConsultation: "સલાહ બુક કરો", courses: "કોર્સ", homeTuition: "હોમ ટ્યુશન", products: "ઉત્પાદનો", adminDashboard: "એડમિન ડૅશબોર્ડ", login: "લોગિન", logout: "લોગઆઉટ",
    heroTitle: "તમારા કોસ્મિક નસીબ શોધો", heroSubtitle: "જ્યોતિષી અરૂપ શાસ્ત્રીના નિષ્ણાત વૈદિક જ્યોતિષ સલાહ સાથે બ્રહ્માંડના રહસ્યો અનલોક કરો", bookReadingNow: "હવે તમારું વાંચન બુક કરો", exploreCourses: "કોર્સ અન્વેષણ કરો",
    yearsExperience: "વર્ષોનો અનુભવ", satisfiedClients: "સંતુષ્ટ ગ્રાહકો", countriesServed: "દેશો સેવા આપી", meetAstrologer: "જ્યોતિષી અરૂપ શાસ્ત્રીને મળો", welcome: "સ્વાગત", loading: "લોડ થઈ રહ્યું છે...", error: "ભૂલ", success: "સફળતા"
  },
  
  kn: { // Kannada
    home: "ಮನೆ", bookConsultation: "ಸಲಹೆ ಬುಕ್ ಮಾಡಿ", courses: "ಕೋರ್ಸ್‌ಗಳು", homeTuition: "ಹೋಮ್ ಟ್ಯೂಷನ್", products: "ಉತ್ಪನ್ನಗಳು", adminDashboard: "ಅಡ್ಮಿನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", login: "ಲಾಗಿನ್", logout: "ಲಾಗೌಟ್",
    heroTitle: "ನಿಮ್ಮ ಕಾಸ್ಮಿಕ್ ವಿಧಿಯನ್ನು ಕಂಡುಕೊಳ್ಳಿ", heroSubtitle: "ಜ್ಯೋತಿಷಿ ಅರೂಪ್ ಶಾಸ್ತ್ರಿಯ ನಿಪುಣ ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ಸಲಹೆಗಳೊಂದಿಗೆ ವಿಶ್ವದ ರಹಸ್ಯಗಳನ್ನು ಅನ್ಲಾಕ್ ಮಾಡಿ", bookReadingNow: "ಈಗ ನಿಮ್ಮ ಓದುವಿಕೆಯನ್ನು ಬುಕ್ ಮಾಡಿ", exploreCourses: "ಕೋರ್ಸ್‌ಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    yearsExperience: "ವರ್ಷಗಳ ಅನುಭವ", satisfiedClients: "ತೃಪ್ತ ಗ್ರಾಹಕರು", countriesServed: "ದೇಶಗಳಿಗೆ ಸೇವೆ", meetAstrologer: "ಜ್ಯೋತಿಷಿ ಅರೂಪ್ ಶಾಸ್ತ್ರಿಯನ್ನು ಭೇಟಿಯಾಗಿ", welcome: "ಸ್ವಾಗತ", loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...", error: "ದೋಷ", success: "ಯಶಸ್ಸು"
  },
  
  or: { // Odia
    home: "ଘର", bookConsultation: "ପରାମର୍ଶ ବୁକ୍ କରନ୍ତୁ", courses: "ପାଠ୍ୟକ୍ରମ", homeTuition: "ହୋମ ଟ୍ୟୁସନ", products: "ଦ୍ରବ୍ୟ", adminDashboard: "ଆଡମିନ ଡ୍ୟାସବୋର୍ଡ", login: "ଲଗଇନ", logout: "ଲଗଆଉଟ",
    heroTitle: "ଆପଣଙ୍କ ମହାଜାଗତିକ ନିୟତି ଆବିଷ୍କାର କରନ୍ତୁ", heroSubtitle: "ଜ୍ୟୋତିଷ ଅରୂପ ଶାସ୍ତ୍ରୀଙ୍କ ବିଶେଷଜ୍ଞ ବୈଦିକ ଜ୍ୟୋତିଷ ପରାମର୍ଶ ସହିତ ବ୍ରହ୍ମାଣ୍ଡର ରହସ୍ୟ ଖୋଲନ୍ତୁ", bookReadingNow: "ଏବେ ଆପଣଙ୍କ ରିଡିଂ ବୁକ୍ କରନ୍ତୁ", exploreCourses: "ପାଠ୍ୟକ୍ରମ ଅନୁସନ୍ଧାନ କରନ୍ତୁ",
    yearsExperience: "ବର୍ଷର ଅଭିଜ୍ଞତା", satisfiedClients: "ସନ୍ତୁଷ୍ଟ ଗ୍ରାହକ", countriesServed: "ଦେଶ ସେବା", meetAstrologer: "ଜ୍ୟୋତିଷ ଅରୂପ ଶାସ୍ତ୍ରୀଙ୍କୁ ଭେଟନ୍ତୁ", welcome: "ସ୍ୱାଗତ", loading: "ଲୋଡ ହେଉଛି...", error: "ତ୍ରୁଟି", success: "ସଫଳତା"
  },
  
  pa: { // Punjabi
    home: "ਘਰ", bookConsultation: "ਸਲਾਹ ਬੁਕ ਕਰੋ", courses: "ਕੋਰਸ", homeTuition: "ਘਰ ਟਿਊਸ਼ਨ", products: "ਉਤਪਾਦ", adminDashboard: "ਐਡਮਿਨ ਡੈਸ਼ਬੋਰਡ", login: "ਲਾਗਇਨ", logout: "ਲਾਗਆਊਟ",
    heroTitle: "ਆਪਣੀ ਬ੍ਰਹਿਮੰਡੀ ਕਿਸਮਤ ਖੋਜੋ", heroSubtitle: "ਜੋਤਸ਼ੀ ਅਰੂਪ ਸ਼ਾਸਤ੍ਰੀ ਦੇ ਮਾਹਰ ਵੈਦਿਕ ਜੋਤਸ਼ ਸਲਾਹ ਨਾਲ ਬ੍ਰਹਿਮੰਡ ਦੇ ਰਾਜ਼ ਖੋਲ੍ਹੋ", bookReadingNow: "ਹੁਣੇ ਆਪਣੀ ਰੀਡਿੰਗ ਬੁਕ ਕਰੋ", exploreCourses: "ਕੋਰਸ ਪੜਚੋਲ ਕਰੋ",
    yearsExperience: "ਸਾਲ ਦਾ ਤਜਰਬਾ", satisfiedClients: "ਸੰਤੁਸ਼ਟ ਗ੍ਰਾਹਕ", countriesServed: "ਦੇਸ਼ ਸੇਵਾ", meetAstrologer: "ਜੋਤਸ਼ੀ ਅਰੂਪ ਸ਼ਾਸਤ੍ਰੀ ਨੂੰ ਮਿਲੋ", welcome: "ਸਵਾਗਤ", loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...", error: "ਗਲਤੀ", success: "ਸਫਲਤਾ"
  },
  
  ml: { // Malayalam
    home: "ഹോം", bookConsultation: "കൺസൾട്ടേഷൻ ബുക്ക് ചെയ്യുക", courses: "കോഴ്സുകൾ", homeTuition: "ഹോം ട്യൂഷൻ", products: "ഉൽപ്പന്നങ്ങൾ", adminDashboard: "അഡ്മിൻ ഡാഷ്ബോർഡ്", login: "ലോഗിൻ", logout: "ലോഗൗട്ട്",
    heroTitle: "നിങ്ങളുടെ കോസ്മിക് വിധി കണ്ടെത്തുക", heroSubtitle: "ജ്യോതിഷി അരൂപ് ശാസ്ത്രിയുടെ വിദഗ്ധ വൈദിക ജ്യോതിഷ കൺസൾട്ടേഷനുകളിലൂടെ പ്രപഞ്ചത്തിന്റെ രഹസ്യങ്ങൾ അൺലോക്ക് ചെയ്യുക", bookReadingNow: "ഇപ്പോൾ നിങ്ങളുടെ റീഡിംഗ് ബുക്ക് ചെയ്യുക", exploreCourses: "കോഴ്സുകൾ പര്യവേക്ഷണം ചെയ്യുക",
    yearsExperience: "വർഷത്തെ അനുഭവം", satisfiedClients: "സംതൃപ്തരായ ക്ലയന്റുകൾ", countriesServed: "രാജ്യങ്ങൾ സേവിച്ചു", meetAstrologer: "ജ്യോതിഷി അരൂപ് ശാസ്ത്രിയെ കാണുക", welcome: "സ്വാഗതം", loading: "ലോഡിംഗ്...", error: "പിശക്", success: "വിജയം"
  },
  
  as: { // Assamese
    home: "ঘৰ", bookConsultation: "পৰামৰ্শ বুক কৰক", courses: "পাঠ্যক্ৰম", homeTuition: "ঘৰুৱা শিক্ষা", products: "সামগ্ৰী", adminDashboard: "এডমিন ডেছবোৰ্ড", login: "লগিন", logout: "লগআউট",
    heroTitle: "আপোনাৰ মহাজাগতিক নিয়তি আৱিস্কাৰ কৰক", heroSubtitle: "জ্যোতিষী অৰূপ শাস্ত্ৰীৰ বিশেষজ্ঞ বৈদিক জ্যোতিষ পৰামৰ্শৰ সৈতে বিশ্বব্ৰহ্মাণ্ডৰ ৰহস্য উন্মোচন কৰক", bookReadingNow: "এতিয়াই আপোনাৰ ৰিডিং বুক কৰক", exploreCourses: "পাঠ্যক্ৰম অন্বেষণ কৰক",
    yearsExperience: "বছৰৰ অভিজ্ঞতা", satisfiedClients: "সন্তুষ্ট ক্লায়েণ্ট", countriesServed: "দেশ সেৱা কৰা", meetAstrologer: "জ্যোতিষী অৰূপ শাস্ত্ৰীক লগ পাওক", welcome: "স্বাগতম", loading: "ল'ড হৈছে...", error: "ত্ৰুটি", success: "সফলতা"
  },
  
  ur: { // Urdu
    home: "ہوم", bookConsultation: "مشاورت بک کریں", courses: "کورسز", homeTuition: "گھریلو تعلیم", products: "پروڈکٹس", adminDashboard: "ایڈمن ڈیش بورڈ", login: "لاگ ان", logout: "لاگ آؤٹ",
    heroTitle: "اپنی کاسمک تقدیر دریافت کریں", heroSubtitle: "نجومی ارپ شاستری کے ماہرانہ ویدک علم نجوم مشاورت کے ساتھ کائنات کے رازوں کو کھولیں", bookReadingNow: "اب اپنی ریڈنگ بک کریں", exploreCourses: "کورسز تلاش کریں",
    yearsExperience: "سال کا تجربہ", satisfiedClients: "مطمئن کلائنٹس", countriesServed: "ممالک کی خدمت", meetAstrologer: "نجومی ارپ شاستری سے ملیں", welcome: "خوش آمدید", loading: "لوڈ ہو رہا ہے...", error: "غلطی", success: "کامیابی"
  },
  
  sa: { // Sanskrit
    home: "गृहम्", bookConsultation: "परामर्शः आरक्षयतु", courses: "पाठ्यक्रमाः", homeTuition: "गृह-अध्ययनम्", products: "वस्तूनि", adminDashboard: "प्रशासक-पटलम्", login: "प्रवेशः", logout: "निर्गमः",
    heroTitle: "स्वस्य ब्राह्मिक नियतिं अन्वेषयतु", heroSubtitle: "ज्योतिषी अरूप शास्त्रिणः विशेषज्ञ वैदिक ज्योतिष परामर्शैः सह विश्वस्य रहस्यानि उद्घाटयतु", bookReadingNow: "अधुना स्वस्य पठनं आरक्षयतु", exploreCourses: "पाठ्यक्रमान् अन्वेषयतु",
    yearsExperience: "वर्षाणां अनुभवः", satisfiedClients: "सन्तुष्ट ग्राहकाः", countriesServed: "देशाः सेविताः", meetAstrologer: "ज्योतिषी अरूप शास्त्रिणा सह मिलतु", welcome: "स्वागतम्", loading: "आरोपयति...", error: "त्रुटिः", success: "सफलता"
  },
  
  // European Languages (Basic)
  nl: { // Dutch
    home: "Thuis", bookConsultation: "Consultatie Boeken", courses: "Cursussen", homeTuition: "Thuisbijles", products: "Producten", adminDashboard: "Admin Dashboard", login: "Inloggen", logout: "Uitloggen",
    heroTitle: "Ontdek Je Kosmische Bestemming", heroSubtitle: "Ontgrendel de geheimen van het universum met deskundige Vedische astrologie consulten door Astroloog Arup Shastri", bookReadingNow: "Boek Je Reading Nu", exploreCourses: "Verken Cursussen",
    yearsExperience: "Jaar Ervaring", satisfiedClients: "Tevreden Klanten", countriesServed: "Landen Bediend", meetAstrologer: "Ontmoet Astroloog Arup Shastri", welcome: "Welkom", loading: "Laden...", error: "Fout", success: "Succes"
  },
  
  sv: { // Swedish
    home: "Hem", bookConsultation: "Boka Konsultation", courses: "Kurser", homeTuition: "Hemundervisning", products: "Produkter", adminDashboard: "Admin Panel", login: "Logga in", logout: "Logga ut",
    heroTitle: "Upptäck Ditt Kosmiska Öde", heroSubtitle: "Lås upp universums hemligheter med expertvedisk astrologi konsultationer av Astrolog Arup Shastri", bookReadingNow: "Boka Din Läsning Nu", exploreCourses: "Utforska Kurser",
    yearsExperience: "År av Erfarenhet", satisfiedClients: "Nöjda Kunder", countriesServed: "Länder Betjänade", meetAstrologer: "Möt Astrolog Arup Shastri", welcome: "Välkommen", loading: "Laddar...", error: "Fel", success: "Framgång"
  },
  
  // Adding more languages with basic translations...
  th: { // Thai
    home: "หน้าแรก", bookConsultation: "จองการปรึกษา", courses: "หลักสูตร", homeTuition: "สอนพิเศษที่บ้าน", products: "ผลิตภัณฑ์", adminDashboard: "แผงผู้ดูแล", login: "เข้าสู่ระบบ", logout: "ออกจากระบบ",
    heroTitle: "ค้นหาชะตากรรมอันยิ่งใหญ่ของคุณ", heroSubtitle: "ปลดล็อกความลับของจักรวาลด้วยการปรึกษาโหราศาสตร์เวทตะจากผู้เชี่ยวชาญ อรุป ศาสตรี", bookReadingNow: "จองการอ่านของคุณตอนนี้", exploreCourses: "สำรวจหลักสูตร",
    yearsExperience: "ปีของประสบการณ์", satisfiedClients: "ลูกค้าที่พึงพอใจ", countriesServed: "ประเทศที่ให้บริการ", meetAstrologer: "พบกับโหรอรุป ศาสตรี", welcome: "ยินดีต้อนรับ", loading: "กำลังโหลด...", error: "ข้อผิดพลาด", success: "สำเร็จ"
  },
  
  vi: { // Vietnamese
    home: "Trang chủ", bookConsultation: "Đặt tư vấn", courses: "Khóa học", homeTuition: "Dạy kèm tại nhà", products: "Sản phẩm", adminDashboard: "Bảng điều khiển Admin", login: "Đăng nhập", logout: "Đăng xuất",
    heroTitle: "Khám phá định mệnh vũ trụ của bạn", heroSubtitle: "Mở khóa bí mật của vũ trụ với các buổi tư vấn chiêm tinh Vedic chuyên nghiệp bởi Thầy chiêm tinh Arup Shastri", bookReadingNow: "Đặt bói của bạn ngay", exploreCourses: "Khám phá khóa học",
    yearsExperience: "Năm kinh nghiệm", satisfiedClients: "Khách hàng hài lòng", countriesServed: "Quốc gia được phục vụ", meetAstrologer: "Gặp Thầy chiêm tinh Arup Shastri", welcome: "Chào mừng", loading: "Đang tải...", error: "Lỗi", success: "Thành công"
  },
  
  id: { // Indonesian
    home: "Beranda", bookConsultation: "Pesan Konsultasi", courses: "Kursus", homeTuition: "Les Privat", products: "Produk", adminDashboard: "Panel Admin", login: "Masuk", logout: "Keluar",
    heroTitle: "Temukan Takdir Kosmik Anda", heroSubtitle: "Buka rahasia alam semesta dengan konsultasi astrologi Veda ahli oleh Astrolog Arup Shastri", bookReadingNow: "Pesan Reading Anda Sekarang", exploreCourses: "Jelajahi Kursus",
    yearsExperience: "Tahun Pengalaman", satisfiedClients: "Klien Puas", countriesServed: "Negara Dilayani", meetAstrologer: "Temui Astrolog Arup Shastri", welcome: "Selamat datang", loading: "Memuat...", error: "Kesalahan", success: "Berhasil"
  },

  // Additional Languages with Basic Translations
  no: { // Norwegian
    home: "Hjem", bookConsultation: "Bestill Konsultasjon", courses: "Kurs", homeTuition: "Hjemmeundervisning", products: "Produkter", adminDashboard: "Admin Dashboard", login: "Logg inn", logout: "Logg ut",
    heroTitle: "Oppdag Din Kosmiske Skjebne", heroSubtitle: "Lås opp universets hemmeligheter med ekspert vedisk astrologi konsultasjoner av Astrolog Arup Shastri", bookReadingNow: "Bestill Din Lesning Nå", exploreCourses: "Utforsk Kurs",
    yearsExperience: "År med Erfaring", satisfiedClients: "Fornøyde Kunder", countriesServed: "Land Betjent", meetAstrologer: "Møt Astrolog Arup Shastri", welcome: "Velkommen", loading: "Laster...", error: "Feil", success: "Suksess"
  },
  
  da: { // Danish
    home: "Hjem", bookConsultation: "Book Konsultation", courses: "Kurser", homeTuition: "Hjemmeundervisning", products: "Produkter", adminDashboard: "Admin Dashboard", login: "Log ind", logout: "Log ud",
    heroTitle: "Opdag Dit Kosmiske Skæbne", heroSubtitle: "Lås op for universets hemmeligheder med ekspert vedisk astrologi konsultationer af Astrolog Arup Shastri", bookReadingNow: "Book Din Læsning Nu", exploreCourses: "Udforsk Kurser",
    yearsExperience: "Års Erfaring", satisfiedClients: "Tilfredse Kunder", countriesServed: "Lande Betjent", meetAstrologer: "Mød Astrolog Arup Shastri", welcome: "Velkommen", loading: "Indlæser...", error: "Fejl", success: "Succes"
  },
  
  fi: { // Finnish
    home: "Koti", bookConsultation: "Varaa Konsultaatio", courses: "Kurssit", homeTuition: "Kotiopetus", products: "Tuotteet", adminDashboard: "Admin Hallinta", login: "Kirjaudu", logout: "Kirjaudu ulos",
    heroTitle: "Löydä Kosminen Kohtalosi", heroSubtitle: "Avaa maailmankaikkeuden salaisuudet asiantuntija-astrologi Arup Shastrin vedisellä astrologialla", bookReadingNow: "Varaa Lukemisesi Nyt", exploreCourses: "Tutki Kursseja",
    yearsExperience: "Vuoden Kokemus", satisfiedClients: "Tyytyväiset Asiakkaat", countriesServed: "Palveltuja Maita", meetAstrologer: "Tapaa Astrologi Arup Shastri", welcome: "Tervetuloa", loading: "Ladataan...", error: "Virhe", success: "Onnistui"
  },
  
  pl: { // Polish
    home: "Strona główna", bookConsultation: "Zarezerwuj Konsultację", courses: "Kursy", homeTuition: "Korepetycje", products: "Produkty", adminDashboard: "Panel Admina", login: "Zaloguj", logout: "Wyloguj",
    heroTitle: "Odkryj Swój Kosmiczny Los", heroSubtitle: "Odblokuj sekrety wszechświata dzięki konsultacjom wedyjskiej astrologii eksperta Astrologa Arup Shastri", bookReadingNow: "Zarezerwuj Swoje Czytanie Teraz", exploreCourses: "Odkryj Kursy",
    yearsExperience: "Lat Doświadczenia", satisfiedClients: "Zadowoleni Klienci", countriesServed: "Obsługiwane Kraje", meetAstrologer: "Poznaj Astrologa Arup Shastri", welcome: "Witamy", loading: "Ładowanie...", error: "Błąd", success: "Sukces"
  },
  
  cs: { // Czech
    home: "Domů", bookConsultation: "Rezervovat Konzultaci", courses: "Kurzy", homeTuition: "Domácí Výuka", products: "Produkty", adminDashboard: "Admin Panel", login: "Přihlásit", logout: "Odhlásit",
    heroTitle: "Objevte Svůj Kosmický Osud", heroSubtitle: "Odemkněte tajemství vesmíru s expertními konzultacemi védské astrologie od Astrologa Arup Shastri", bookReadingNow: "Rezervujte Si Čtení Nyní", exploreCourses: "Prozkoumejte Kurzy",
    yearsExperience: "Let Zkušeností", satisfiedClients: "Spokojení Klienti", countriesServed: "Obsloužené Země", meetAstrologer: "Poznejte Astrologa Arup Shastri", welcome: "Vítejte", loading: "Načítání...", error: "Chyba", success: "Úspěch"
  },
  
  hu: { // Hungarian
    home: "Kezdőlap", bookConsultation: "Konzultáció Foglalása", courses: "Tanfolyamok", homeTuition: "Magánoktatás", products: "Termékek", adminDashboard: "Admin Panel", login: "Bejelentkezés", logout: "Kijelentkezés",
    heroTitle: "Fedezd Fel Kozmikus Sorsodat", heroSubtitle: "Nyisd ki az univerzum titkait Arup Shastri asztrológus szakértő védikus asztrológiai konzultációival", bookReadingNow: "Foglald Le Az Olvasásodat Most", exploreCourses: "Fedezd Fel A Tanfolyamokat",
    yearsExperience: "Év Tapasztalat", satisfiedClients: "Elégedett Ügyfelek", countriesServed: "Kiszolgált Országok", meetAstrologer: "Ismerd Meg Arup Shastri Asztrológust", welcome: "Üdvözöljük", loading: "Betöltés...", error: "Hiba", success: "Siker"
  },
  
  ro: { // Romanian
    home: "Acasă", bookConsultation: "Rezervă Consultație", courses: "Cursuri", homeTuition: "Meditații Acasă", products: "Produse", adminDashboard: "Panou Admin", login: "Conectare", logout: "Deconectare",
    heroTitle: "Descoperă-ți Destinul Cosmic", heroSubtitle: "Deblochează secretele universului cu consultații experte de astrologie vedică de la Astrologul Arup Shastri", bookReadingNow: "Rezervă-ți Citirea Acum", exploreCourses: "Explorează Cursurile",
    yearsExperience: "Ani de Experiență", satisfiedClients: "Clienți Mulțumiți", countriesServed: "Țări Servite", meetAstrologer: "Întâlnește Astrologul Arup Shastri", welcome: "Bun venit", loading: "Se încarcă...", error: "Eroare", success: "Succes"
  },
  
  el: { // Greek
    home: "Αρχική", bookConsultation: "Κλείστε Συμβουλή", courses: "Μαθήματα", homeTuition: "Ιδιαίτερα Μαθήματα", products: "Προϊόντα", adminDashboard: "Πίνακας Διαχείρισης", login: "Σύνδεση", logout: "Αποσύνδεση",
    heroTitle: "Ανακαλύψτε την Κοσμική σας Μοίρα", heroSubtitle: "Ξεκλειδώστε τα μυστικά του σύμπαντος με εξπέρ συμβουλές βεδικής αστρολογίας από τον Αστρολόγο Arup Shastri", bookReadingNow: "Κλείστε την Ανάγνωσή σας Τώρα", exploreCourses: "Εξερευνήστε Μαθήματα",
    yearsExperience: "Χρόνια Εμπειρίας", satisfiedClients: "Ικανοποιημένοι Πελάτες", countriesServed: "Χώρες που Εξυπηρετούνται", meetAstrologer: "Γνωρίστε τον Αστρολόγο Arup Shastri", welcome: "Καλώς ήρθατε", loading: "Φόρτωση...", error: "Σφάλμα", success: "Επιτυχία"
  },
  
  tr: { // Turkish
    home: "Ana Sayfa", bookConsultation: "Danışmanlık Rezerve Et", courses: "Kurslar", homeTuition: "Evde Ders", products: "Ürünler", adminDashboard: "Yönetici Paneli", login: "Giriş", logout: "Çıkış",
    heroTitle: "Kozmik Kaderinizi Keşfedin", heroSubtitle: "Astrolog Arup Shastri'nin uzman Vedik astroloji danışmanlıklarıyla evrenin sırlarını açığa çıkarın", bookReadingNow: "Okumamızı Şimdi Rezerve Edin", exploreCourses: "Kursları Keşfedin",
    yearsExperience: "Yıl Deneyim", satisfiedClients: "Memnun Müşteriler", countriesServed: "Hizmet Verilen Ülkeler", meetAstrologer: "Astrolog Arup Shastri ile Tanışın", welcome: "Hoş geldiniz", loading: "Yükleniyor...", error: "Hata", success: "Başarı"
  },
  
  fa: { // Persian
    home: "خانه", bookConsultation: "رزرو مشاوره", courses: "دوره‌ها", homeTuition: "تدریس خصوصی", products: "محصولات", adminDashboard: "پنل مدیریت", login: "ورود", logout: "خروج",
    heroTitle: "سرنوشت کیهانی خود را کشف کنید", heroSubtitle: "اسرار کیهان را با مشاوره‌های متخصص طالع‌بینی ودایی توسط منجم آروپ شاستری باز کنید", bookReadingNow: "همین الآن فال خود را رزرو کنید", exploreCourses: "دوره‌ها را کاوش کنید",
    yearsExperience: "سال تجربه", satisfiedClients: "مشتریان راضی", countriesServed: "کشورهای خدمات‌دهی", meetAstrologer: "با منجم آروپ شاستری آشنا شوید", welcome: "خوش آمدید", loading: "در حال بارگذاری...", error: "خطا", success: "موفقیت"
  },
  
  he: { // Hebrew
    home: "בית", bookConsultation: "הזמן ייעוץ", courses: "קורסים", homeTuition: "שיעורים פרטיים", products: "מוצרים", adminDashboard: "לוח בקרה", login: "התחבר", logout: "התנתק",
    heroTitle: "גלה את הגורל הקוסמי שלך", heroSubtitle: "פתח את סודות היקום עם ייעוץ מומחה באסטרולוגיה וודית על ידי האסטרולוג ארופ שאסטרי", bookReadingNow: "הזמן את הקריאה שלך עכשיו", exploreCourses: "חקור קורסים",
    yearsExperience: "שנות ניסיון", satisfiedClients: "לקוחות מרוצים", countriesServed: "מדינות בשירות", meetAstrologer: "פגש את האסטרולוג ארופ שאסטרי", welcome: "ברוכים הבאים", loading: "טוען...", error: "שגיאה", success: "הצלחה"
  },
  
  ms: { // Malay
    home: "Utama", bookConsultation: "Tempah Konsultasi", courses: "Kursus", homeTuition: "Tuisyen Rumah", products: "Produk", adminDashboard: "Panel Admin", login: "Log masuk", logout: "Log keluar",
    heroTitle: "Temui Takdir Kosmik Anda", heroSubtitle: "Buka rahsia alam semesta dengan perundingan astrologi Vedik pakar oleh Ahli Nujum Arup Shastri", bookReadingNow: "Tempah Bacaan Anda Sekarang", exploreCourses: "Jelajahi Kursus",
    yearsExperience: "Tahun Pengalaman", satisfiedClients: "Pelanggan Berpuas Hati", countriesServed: "Negara Dilayani", meetAstrologer: "Temui Ahli Nujum Arup Shastri", welcome: "Selamat datang", loading: "Memuatkan...", error: "Ralat", success: "Berjaya"
  },
  
  fil: { // Filipino
    home: "Tahanan", bookConsultation: "Mag-book ng Konsultasyon", courses: "Mga Kurso", homeTuition: "Home Tuition", products: "Mga Produkto", adminDashboard: "Admin Dashboard", login: "Mag-login", logout: "Mag-logout",
    heroTitle: "Tuklasin ang Inyong Cosmic na Kapalaran", heroSubtitle: "I-unlock ang mga lihim ng sansinukob gamit ang eksperto na Vedic astrology consultations ni Astrologer Arup Shastri", bookReadingNow: "I-book ang Inyong Reading Ngayon", exploreCourses: "I-explore ang mga Kurso",
    yearsExperience: "Taon ng Karanasan", satisfiedClients: "Mga Satisfied na Kliyente", countriesServed: "Mga Bansang Pinaglingkuran", meetAstrologer: "Kilalanin si Astrologer Arup Shastri", welcome: "Maligayang pagdating", loading: "Naglo-load...", error: "Error", success: "Tagumpay"
  },
  
  sw: { // Swahili
    home: "Nyumbani", bookConsultation: "Hifadhi Ushauri", courses: "Kozi", homeTuition: "Mafunzo ya Nyumbani", products: "Bidhaa", adminDashboard: "Dashibodi ya Msimamizi", login: "Ingia", logout: "Toka",
    heroTitle: "Gundua Hatima yako ya Cosmic", heroSubtitle: "Fungua siri za ulimwengu na ushauri wa kitaalamu wa falaki ya Vedic na Mnajimu Arup Shastri", bookReadingNow: "Hifadhi Kusoma kwako Sasa", exploreCourses: "Chunguza Kozi",
    yearsExperience: "Miaka ya Uzoefu", satisfiedClients: "Wateja Wenye Furaha", countriesServed: "Nchi Zilizotumikiwa", meetAstrologer: "Kutana na Mnajimu Arup Shastri", welcome: "Karibu", loading: "Inapakia...", error: "Hitilafu", success: "Mafanikio"
  },
  
  af: { // Afrikaans
    home: "Tuis", bookConsultation: "Bespreek Konsultasie", courses: "Kursusse", homeTuition: "Tuis Onderrig", products: "Produkte", adminDashboard: "Admin Paneel", login: "Meld aan", logout: "Meld af",
    heroTitle: "Ontdek Jou Kosmiese Noodlot", heroSubtitle: "Ontsluit die geheime van die heelal met kundige Vediese astrologie konsultasies deur Astroloog Arup Shastri", bookReadingNow: "Bespreek Jou Lees Nou", exploreCourses: "Verken Kursusse",
    yearsExperience: "Jaar Ondervinding", satisfiedClients: "Tevrede Kliënte", countriesServed: "Lande Bedien", meetAstrologer: "Ontmoet Astroloog Arup Shastri", welcome: "Welkom", loading: "Laai...", error: "Fout", success: "Sukses"
  },
  
  uk: { // Ukrainian
    home: "Головна", bookConsultation: "Забронювати Консультацію", courses: "Курси", homeTuition: "Домашнє Навчання", products: "Продукти", adminDashboard: "Адмін Панель", login: "Увійти", logout: "Вийти",
    heroTitle: "Відкрийте Свою Космічну Долю", heroSubtitle: "Розкрийте таємниці всесвіту з експертними консультаціями ведичної астрології від Астролога Арупа Шастрі", bookReadingNow: "Забронюйте Своє Читання Зараз", exploreCourses: "Дослідіть Курси",
    yearsExperience: "Років Досвіду", satisfiedClients: "Задоволені Клієнти", countriesServed: "Країни Обслуговуються", meetAstrologer: "Познайомтесь з Астрологом Арупом Шастрі", welcome: "Ласкаво просимо", loading: "Завантаження...", error: "Помилка", success: "Успіх"
  },
  
  bg: { // Bulgarian
    home: "Начало", bookConsultation: "Резервирайте Консултация", courses: "Курсове", homeTuition: "Домашно Обучение", products: "Продукти", adminDashboard: "Админ Панел", login: "Влизане", logout: "Излизане",
    heroTitle: "Открийте Вашата Космическа Съдба", heroSubtitle: "Отключете тайните на вселената с експертни консултации по ведическа астрология от Астролог Аруп Шастри", bookReadingNow: "Резервирайте Четенето си Сега", exploreCourses: "Разгледайте Курсовете",
    yearsExperience: "Години Опит", satisfiedClients: "Доволни Клиенти", countriesServed: "Обслужвани Страни", meetAstrologer: "Запознайте се с Астролог Аруп Шастри", welcome: "Добре дошли", loading: "Зарежда...", error: "Грешка", success: "Успех"
  },
  
  hr: { // Croatian
    home: "Početna", bookConsultation: "Rezerviraj Konzultaciju", courses: "Tečajevi", homeTuition: "Kućno Podučavanje", products: "Proizvodi", adminDashboard: "Admin Panel", login: "Prijavi se", logout: "Odjavi se",
    heroTitle: "Otkrijte Svoju Kozmičku Sudbinu", heroSubtitle: "Otključajte tajne svemira stručnim konzultacijama vedske astrologije od Astrologa Arup Shastrija", bookReadingNow: "Rezervirajte Svoje Čitanje Sada", exploreCourses: "Istražite Tečajeve",
    yearsExperience: "Godine Iskustva", satisfiedClients: "Zadovoljni Klijenti", countriesServed: "Opslužene Zemlje", meetAstrologer: "Upoznajte Astrologa Arup Shastrija", welcome: "Dobrodošli", loading: "Učitava...", error: "Greška", success: "Uspjeh"
  },
  
  sk: { // Slovak
    home: "Domov", bookConsultation: "Rezervovať Konzultáciu", courses: "Kurzy", homeTuition: "Domáce Vyučovanie", products: "Produkty", adminDashboard: "Admin Panel", login: "Prihlásiť", logout: "Odhlásiť",
    heroTitle: "Objavte Svoj Kosmický Osud", heroSubtitle: "Odomknite tajomstvá vesmíru s odbornými konzultáciami védskej astrológie od Astrológa Arup Shastri", bookReadingNow: "Rezervujte Si Čítanie Teraz", exploreCourses: "Preskúmajte Kurzy",
    yearsExperience: "Rokov Skúseností", satisfiedClients: "Spokojní Klienti", countriesServed: "Obslúžené Krajiny", meetAstrologer: "Spoznajte Astrológa Arup Shastri", welcome: "Vitajte", loading: "Načítava...", error: "Chyba", success: "Úspech"
  },
  
  sl: { // Slovenian
    home: "Domov", bookConsultation: "Rezerviraj Posvet", courses: "Tečaji", homeTuition: "Domače Inštrukcije", products: "Izdelki", adminDashboard: "Admin Panel", login: "Prijava", logout: "Odjava",
    heroTitle: "Odkrijte Svojo Kozmično Usodo", heroSubtitle: "Odklenite skrivnosti vesolja z strokovnimi posvetovanji vedske astrologije od Astrologa Arup Shastri", bookReadingNow: "Rezervirajte Svoje Branje Zdaj", exploreCourses: "Raziščite Tečaje",
    yearsExperience: "Let Izkušenj", satisfiedClients: "Zadovoljni Stranke", countriesServed: "Postrežene Države", meetAstrologer: "Spoznajte Astrologa Arup Shastri", welcome: "Dobrodošli", loading: "Nalaga...", error: "Napaka", success: "Uspeh"
  },
  
  et: { // Estonian
    home: "Avaleht", bookConsultation: "Broneeri Konsultatsioon", courses: "Kursused", homeTuition: "Koduõpe", products: "Tooted", adminDashboard: "Admin Panel", login: "Logi sisse", logout: "Logi välja",
    heroTitle: "Avasta Oma Kosmiline Saatus", heroSubtitle: "Ava universumi saladused ekspert veedilise astroloogia konsultatsioonidega Astroloogi Arup Shastri poolt", bookReadingNow: "Broneeri Oma Lugemine Kohe", exploreCourses: "Uuri Kursusi",
    yearsExperience: "Aastat Kogemust", satisfiedClients: "Rahulolev Kliendid", countriesServed: "Teenindatud Riigid", meetAstrologer: "Kohtu Astroloogi Arup Shastriga", welcome: "Tere tulemast", loading: "Laadib...", error: "Viga", success: "Edu"
  },
  
  lv: { // Latvian
    home: "Sākums", bookConsultation: "Rezervēt Konsultāciju", courses: "Kursi", homeTuition: "Mājas Apmācība", products: "Produkti", adminDashboard: "Admin Panelis", login: "Pieteikties", logout: "Atteikties",
    heroTitle: "Atklājiet Savu Kosmisko Likteni", heroSubtitle: "Atslēdziet visuma noslēpumus ar eksperta vēdiskās astroloģijas konsultācijām no Astrologa Arup Shastri", bookReadingNow: "Rezervējiet Savu Lasīšanu Tagad", exploreCourses: "Izpētiet Kursus",
    yearsExperience: "Gadu Pieredze", satisfiedClients: "Apmierināti Klienti", countriesServed: "Apkalpotās Valstis", meetAstrologer: "Iepazīstieties ar Astrologu Arup Shastri", welcome: "Laipni lūdzam", loading: "Ielādē...", error: "Kļūda", success: "Panākumi"
  },
  
  lt: { // Lithuanian
    home: "Pagrindinis", bookConsultation: "Užsisakyti Konsultaciją", courses: "Kursai", homeTuition: "Namų Korepetitorystė", products: "Produktai", adminDashboard: "Admin Skydelis", login: "Prisijungti", logout: "Atsijungti",
    heroTitle: "Atraskite Savo Kosminį Likimą", heroSubtitle: "Atirakinkite visatos paslaptis su eksperto vediškos astrologijos konsultacijomis nuo Astrologo Arup Shastri", bookReadingNow: "Užsisakykite Savo Skaitymą Dabar", exploreCourses: "Tyrinėkite Kursus",
    yearsExperience: "Metų Patirtis", satisfiedClients: "Patenkinti Klientai", countriesServed: "Aptarnautos Šalys", meetAstrologer: "Susipažinkite su Astrologu Arup Shastri", welcome: "Sveiki", loading: "Kraunasi...", error: "Klaida", success: "Sėkmė"
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const t = (key: string): string => {
    const currentTranslation = translations[currentLanguage]?.[key as keyof typeof translations['en']];
    const englishTranslation = translations.en[key as keyof typeof translations['en']];
    
    // If we have the translation in current language, return it
    if (currentTranslation) {
      return currentTranslation;
    }
    
    // If current language is English or we have English translation, return English
    if (currentLanguage === 'en' || englishTranslation) {
      return englishTranslation || key;
    }
    
    // For missing translations, return key (will be auto-translated by component)
    return key;
  };

  // Load saved language on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('preferred-language') as Language;
    if (saved && translations[saved]) {
      setCurrentLanguage(saved);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}