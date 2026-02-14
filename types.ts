export type Language = 'en' | 'bn';

export interface CalculatedAge {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthdayDays: number;
  zodiac: string;
  isBirthday: boolean;
  birthDayName: string;
}

export interface StatusMessage {
  text: string;
  id: number;
}

export type ThemeMode = 'light' | 'dark';

export interface CardStyle {
  id: string;
  gradient: string;
  textColor: string;
  name: string;
}

export type FontStyle = 'sans' | 'serif' | 'handwriting' | 'fun' | 'fancy';
