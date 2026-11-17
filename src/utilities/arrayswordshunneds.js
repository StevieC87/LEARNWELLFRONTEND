export function dynamichunneds(lessonwords) {
  let array = [];
  let wordstart = 1;
  let wordend = lessonwords;
  let totalwords = 5000;
  let lessons = Math.ceil(totalwords / lessonwords);

  for (let i = 1; i <= lessons; i++) {
    array.push({ id: i, wordstart: wordstart, wordend: wordend });
    wordstart += lessonwords;
    wordend += lessonwords;
  }
  /* for (let i = 1; i <= lessonlength; i++) {
    array.push({ id: i, wordstart: start, wordend: end });
    start += 100;
    end += 100;
  } */
  return array;
}

export const arraywordshunneds = [
  { id: 1, words: "1-100" },
  { id: 2, words: "101-200" },
  { id: 3, words: "201-300" },
  { id: 4, words: "301-400" },
  { id: 5, words: "401-500" },
  { id: 6, words: "501-600" },
  { id: 7, words: "601-700" },
  { id: 8, words: "701-800" },
  { id: 9, words: "801-900" },
  { id: 10, words: "901-1000" },
  { id: 11, words: "1001-1100" },
  { id: 12, words: "1101-1200" },
  { id: 13, words: "1201-1300" },
  { id: 14, words: "1301-1400" },
  { id: 15, words: "1401-1500" },
  { id: 16, words: "1501-1600" },
  { id: 17, words: "1601-1700" },
  { id: 18, words: "1701-1800" },
  { id: 19, words: "1801-1900" },
  { id: 20, words: "1901-2000" },
  { id: 21, words: "2001-2100" },
  { id: 22, words: "2101-2200" },
  { id: 23, words: "2201-2300" },
  { id: 24, words: "2301-2400" },
  { id: 25, words: "2401-2500" },
  { id: 26, words: "2501-2600" },
  { id: 27, words: "2601-2700" },
  { id: 28, words: "2701-2800" },
  { id: 29, words: "2801-2900" },
  { id: 30, words: "2901-3000" },
  { id: 31, words: "3001-3100" },
  { id: 32, words: "3101-3200" },
  { id: 33, words: "3201-3300" },
  { id: 34, words: "3301-3400" },
  { id: 35, words: "3401-3500" },
  { id: 36, words: "3501-3600" },
  { id: 37, words: "3601-3700" },
  { id: 38, words: "3701-3800" },
  { id: 39, words: "3801-3900" },
  { id: 40, words: "3901-4000" },
  { id: 41, words: "4001-4100" },
  { id: 42, words: "4101-4200" },
  { id: 43, words: "4201-4300" },
  { id: 44, words: "4301-4400" },
  { id: 45, words: "4401-4500" },
  { id: 46, words: "4501-4600" },
  { id: 47, words: "4601-4700" },
  { id: 48, words: "4701-4800" },
  { id: 49, words: "4801-4900" },
  { id: 50, words: "4901-5000" },
];
