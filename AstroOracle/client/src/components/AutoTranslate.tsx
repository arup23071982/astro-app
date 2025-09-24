import React from 'react';

interface AutoTranslateProps {
  text: string;
  fallback?: string;
  className?: string;
  children?: React.ReactNode;
}

// Simplified AutoTranslate component that just renders text (fast fallback)
export const AutoTranslate: React.FC<AutoTranslateProps> = ({ 
  text, 
  fallback, 
  className,
  children 
}) => {
  // For now, just render the text as-is to get the app working quickly
  const displayText = text || fallback || '';
  
  if (children) {
    return <span className={className}>{displayText}</span>;
  }

  return (
    <span className={className}>
      {displayText}
    </span>
  );
};

// Simple hook fallback
export const useAutoTranslate = () => {
  const translate = async (text: string): Promise<string> => {
    return text; // Just return original text for now
  };
  
  return { translate, currentLanguage: 'en' };
};