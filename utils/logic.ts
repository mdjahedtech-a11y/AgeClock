import { CalculatedAge, Language } from '../types';
import { ZODIAC_SIGNS } from './data';

export const getZodiacSign = (day: number, month: number, lang: Language): string => {
  // month is 0-indexed if coming from Date.getMonth(), but typically input is 1-12.
  // We will assume month is 1-12 here.
  const signs = ZODIAC_SIGNS[lang];
  
  // Logic:
  // Capricorn: Dec 22 - Jan 19 (Signs[0])
  // Aquarius: Jan 20 - Feb 18 (Signs[1])
  // ...
  
  // Simple check
  if ((month === 1 && day <= 19) || (month === 12 && day >= 22)) return signs[0];
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return signs[1];
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return signs[2];
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return signs[3];
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return signs[4];
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return signs[5];
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return signs[6];
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return signs[7];
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return signs[8];
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return signs[9];
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return signs[10];
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return signs[11];

  return "";
};

export const calculateAgeLogic = (dob: string, lang: Language): CalculatedAge => {
  const birthDate = new Date(dob);
  const today = new Date();

  // Validate date
  if (isNaN(birthDate.getTime())) {
    throw new Error("Invalid Date");
  }

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  // Adjust for negative days
  if (days < 0) {
    months--;
    // Get days in previous month
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }

  // Total Days
  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  // Next Birthday Logic
  const currentYear = today.getFullYear();
  const birthdayThisYear = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
  let nextBirthday = birthdayThisYear;
  
  if (today > birthdayThisYear) {
    nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
  }

  const diffNext = nextBirthday.getTime() - today.getTime();
  const nextBirthdayDays = Math.ceil(diffNext / (1000 * 60 * 60 * 24));
  
  // Check if today is birthday (ignore time, just date)
  const isBirthday = today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth();

  // Day Name
  const dayNamesEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayNamesBn = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
  const dayName = lang === 'en' ? dayNamesEn[birthDate.getDay()] : dayNamesBn[birthDate.getDay()];

  return {
    years,
    months,
    days,
    totalDays,
    nextBirthdayDays: isBirthday ? 0 : nextBirthdayDays,
    zodiac: getZodiacSign(birthDate.getDate(), birthDate.getMonth() + 1, lang),
    isBirthday,
    birthDayName: dayName
  };
};
