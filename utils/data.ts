import { Language, StatusMessage, CardStyle } from '../types';

export const ZODIAC_SIGNS: Record<Language, string[]> = {
  en: [
    "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini",
    "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"
  ],
  bn: [
    "মকর", "কুম্ভ", "মীন", "মেষ", "বৃষ", "মিথুন",
    "কর্কট", "সিংহ", "কন্যা", "তুলা", "বৃশ্চিক", "ধনু"
  ]
};

export const CARD_GRADIENTS: CardStyle[] = [
  { id: '1', gradient: 'from-purple-600 via-pink-500 to-red-500', textColor: 'text-white', name: 'Sunset' },
  { id: '2', gradient: 'from-blue-400 via-cyan-500 to-teal-500', textColor: 'text-white', name: 'Ocean' },
  { id: '3', gradient: 'from-gray-900 via-purple-900 to-violet-800', textColor: 'text-white', name: 'Midnight' },
  { id: '4', gradient: 'from-yellow-400 via-orange-400 to-red-400', textColor: 'text-white', name: 'Citrus' },
  { id: '5', gradient: 'from-pink-300 via-purple-300 to-indigo-400', textColor: 'text-white', name: 'Cotton Candy' },
  { id: '6', gradient: 'from-amber-200 via-yellow-400 to-orange-500', textColor: 'text-white', name: 'Golden Hour' },
  { id: '7', gradient: 'from-rose-500 via-purple-500 to-indigo-600', textColor: 'text-white', name: 'Neon Dreams' },
];

export const CARD_FONTS = [
  { id: 'sans', name: 'Modern' },
  { id: 'handwriting', name: 'Elegant' },
  { id: 'fun', name: 'Playful' },
  { id: 'fancy', name: 'Fancy' },
];

export const TRANSLATIONS = {
  en: {
    title: "Age Calculator",
    subtitle: "Discover your journey in time",
    namePlaceholder: "Enter your name",
    dobLabel: "Date of Birth",
    calculateBtn: "Calculate Age",
    years: "Years",
    months: "Months",
    days: "Days",
    totalDays: "Total Days Lived",
    nextBirthday: "Next Birthday In",
    zodiac: "Zodiac Sign",
    birthDayName: "Born On",
    happyBirthday: "Happy Birthday!",
    congrats: "Congratulations!",
    share: "Share",
    copy: "Copy",
    generateStatus: "Generate Status",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    greeting: "Hello",
    weeks: "Weeks",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    cardGenerator: "Birthday Card Generator",
    downloadCard: "Download Card",
    customizeCard: "Customize Card",
    uploadPhoto: "Upload Photo",
    selectTheme: "Select Theme",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    acceptCookies: "We use cookies to improve experience.",
    accept: "Accept",
    moreApps: "More Apps"
  },
  bn: {
    title: "বয়স ক্যালকুলেটর",
    subtitle: "সময়ের সাথে আপনার যাত্রা জানুন",
    namePlaceholder: "আপনার নাম লিখুন",
    dobLabel: "জন্ম তারিখ",
    calculateBtn: "বয়স হিসাব করুন",
    years: "বছর",
    months: "মাস",
    days: "দিন",
    totalDays: "মোট দিন অতিবাহিত",
    nextBirthday: "পরবর্তী জন্মদিন",
    zodiac: "রাশিফল",
    birthDayName: "জন্ম বার",
    happyBirthday: "শুভ জন্মদিন!",
    congrats: "অভিনন্দন!",
    share: "শেয়ার",
    copy: "কপি",
    generateStatus: "স্ট্যাটাস তৈরি করুন",
    darkMode: "ডার্ক মোড",
    lightMode: "লাইট মোড",
    greeting: "হ্যালো",
    weeks: "সপ্তাহ",
    hours: "ঘণ্টা",
    minutes: "মিনিট",
    seconds: "সেকেন্ড",
    cardGenerator: "জন্মদিনের কার্ড তৈরি করুন",
    downloadCard: "কার্ড ডাউনলোড করুন",
    customizeCard: "কার্ড সাজান",
    uploadPhoto: "ছবি আপলোড",
    selectTheme: "থিম নির্বাচন করুন",
    privacy: "গোপনীয়তা নীতি",
    terms: "শর্তাবলী",
    acceptCookies: "আমরা ভালো অভিজ্ঞতার জন্য কুকিজ ব্যবহার করি।",
    accept: "গ্রহণ করুন",
    moreApps: "আরও অ্যাপস"
  }
};

export const BIRTHDAY_QUOTES: Record<Language, StatusMessage[]> = {
  en: [
    { id: 1, text: "🎉 Happy Birthday! Wishing you happiness and success." },
    { id: 2, text: "🚀 Another year older, stronger and wiser! Keep shining." },
    { id: 3, text: "✨ May your dreams come true this year! Happy Birthday!" },
    { id: 4, text: "🎂 Wishing you a day filled with love and cheer!" },
    { id: 5, text: "🌟 You are special, and today is your day! Enjoy!" },
    { id: 6, text: "🎈 Cheers to another lap around the sun!" },
    { id: 7, text: "🎁 The best is yet to come. Happy Birthday!" }
  ],
  bn: [
    { id: 1, text: "🎂 শুভ জন্মদিন! তোমার জীবন সুখে ভরে উঠুক।" },
    { id: 2, text: "🤲 আল্লাহ তোমাকে সুস্থ ও সফল রাখুন। শুভ জন্মদিন!" },
    { id: 3, text: "✨ তোমার সব স্বপ্ন পূরণ হোক এই কামনা করি।" },
    { id: 4, text: "🎉 আজকের এই দিনটি তোমার জন্য বয়ে আনুক অনাবিল আনন্দ।" },
    { id: 5, text: "🌟 শুভ জন্মদিন! আগামীর পথচলা হোক সুন্দর ও মসৃণ।" },
    { id: 6, text: "🎈 নতুন বছরে নতুন উদ্যমে এগিয়ে যাও। শুভ জন্মদিন!" },
    { id: 7, text: "🎁 জন্মদিন মানেই নতুন করে শুরু। অনেক শুভকামনা।" }
  ]
};