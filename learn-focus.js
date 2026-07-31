/**
 * Focus topics for Smart Learn — example sentences + mini stories.
 * @typedef {{ de: string, en: string }} Word
 * @typedef {{ id: string, text: string, meaning: string, words: Word[] }} LearnSentence
 * @typedef {{
 *   id: string,
 *   title: string,
 *   description: string,
 *   storyTitle: string,
 *   storyTitleEn: string,
 *   story: Array<{ de: string, en: string, words: Word[] }>,
 *   sentences: LearnSentence[]
 * }} LearnFocusTopic
 */

/** @type {Record<string, LearnFocusTopic>} */
const LEARN_FOCUS_TOPICS = {
  greetings: {
    id: "greetings",
    title: "Greetings",
    description: "Say hello, ask how someone is, and say goodbye politely.",
    storyTitle: "Guten Morgen im Café",
    storyTitleEn: "Good morning at the café",
    story: [
      {
        de: "Anna trifft Lisa am Morgen.",
        en: "Anna meets Lisa in the morning.",
        words: [
          { de: "Anna", en: "Anna" },
          { de: "trifft", en: "meets" },
          { de: "Lisa", en: "Lisa" },
          { de: "am", en: "in the" },
          { de: "Morgen.", en: "morning." },
        ],
      },
      {
        de: "Guten Morgen, Lisa! Wie geht’s dir?",
        en: "Good morning, Lisa! How are you?",
        words: [
          { de: "Guten", en: "good" },
          { de: "Morgen,", en: "morning," },
          { de: "Lisa!", en: "Lisa!" },
          { de: "Wie", en: "how" },
          { de: "geht’s", en: "goes it" },
          { de: "dir?", en: "to you?" },
        ],
      },
      {
        de: "Mir geht’s gut, danke. Und dir?",
        en: "I’m fine, thank you. And you?",
        words: [
          { de: "Mir", en: "to me" },
          { de: "geht’s", en: "goes it" },
          { de: "gut,", en: "well," },
          { de: "danke.", en: "thanks." },
          { de: "Und", en: "and" },
          { de: "dir?", en: "to you?" },
        ],
      },
      {
        de: "Auch gut. Bis später!",
        en: "Also good. See you later!",
        words: [
          { de: "Auch", en: "also" },
          { de: "gut.", en: "good." },
          { de: "Bis", en: "until" },
          { de: "später!", en: "later!" },
        ],
      },
    ],
    sentences: [
      {
        id: "lf-greet-1",
        text: "Guten Morgen!",
        meaning: "Good morning!",
        words: [
          { de: "Guten", en: "good" },
          { de: "Morgen!", en: "morning!" },
        ],
      },
      {
        id: "lf-greet-2",
        text: "Guten Tag!",
        meaning: "Good day / Hello!",
        words: [
          { de: "Guten", en: "good" },
          { de: "Tag!", en: "day!" },
        ],
      },
      {
        id: "lf-greet-3",
        text: "Guten Abend!",
        meaning: "Good evening!",
        words: [
          { de: "Guten", en: "good" },
          { de: "Abend!", en: "evening!" },
        ],
      },
      {
        id: "lf-greet-4",
        text: "Hallo, wie geht es dir?",
        meaning: "Hello, how are you?",
        words: [
          { de: "Hallo,", en: "hello," },
          { de: "wie", en: "how" },
          { de: "geht", en: "goes" },
          { de: "es", en: "it" },
          { de: "dir?", en: "to you?" },
        ],
      },
      {
        id: "lf-greet-5",
        text: "Mir geht es gut, danke.",
        meaning: "I am fine, thank you.",
        words: [
          { de: "Mir", en: "to me" },
          { de: "geht", en: "goes" },
          { de: "es", en: "it" },
          { de: "gut,", en: "well," },
          { de: "danke.", en: "thanks." },
        ],
      },
      {
        id: "lf-greet-6",
        text: "Freut mich, dich kennenzulernen.",
        meaning: "Nice to meet you.",
        words: [
          { de: "Freut", en: "pleases" },
          { de: "mich,", en: "me," },
          { de: "dich", en: "you" },
          { de: "kennenzulernen.", en: "to get to know." },
        ],
      },
      {
        id: "lf-greet-7",
        text: "Entschuldigung, sprechen Sie Deutsch?",
        meaning: "Excuse me, do you speak German?",
        words: [
          { de: "Entschuldigung,", en: "excuse me," },
          { de: "sprechen", en: "speak" },
          { de: "Sie", en: "you (formal)" },
          { de: "Deutsch?", en: "German?" },
        ],
      },
      {
        id: "lf-greet-8",
        text: "Tschüss, bis bald!",
        meaning: "Bye, see you soon!",
        words: [
          { de: "Tschüss,", en: "bye," },
          { de: "bis", en: "until" },
          { de: "bald!", en: "soon!" },
        ],
      },
      {
        id: "lf-greet-9",
        text: "Auf Wiedersehen!",
        meaning: "Goodbye!",
        words: [
          { de: "Auf", en: "on / until" },
          { de: "Wiedersehen!", en: "seeing again!" },
        ],
      },
      {
        id: "lf-greet-10",
        text: "Gute Nacht und schlaf gut!",
        meaning: "Good night and sleep well!",
        words: [
          { de: "Gute", en: "good" },
          { de: "Nacht", en: "night" },
          { de: "und", en: "and" },
          { de: "schlaf", en: "sleep" },
          { de: "gut!", en: "well!" },
        ],
      },
    ],
  },

  "numbers-time": {
    id: "numbers-time",
    title: "Numbers & time",
    description: "Count, tell the time, and talk about days and appointments.",
    storyTitle: "Wann beginnt der Kurs?",
    storyTitleEn: "When does the course start?",
    story: [
      {
        de: "Der Deutschkurs beginnt um neun Uhr.",
        en: "The German course starts at nine o’clock.",
        words: [
          { de: "Der", en: "the" },
          { de: "Deutschkurs", en: "German course" },
          { de: "beginnt", en: "begins" },
          { de: "um", en: "at" },
          { de: "neun", en: "nine" },
          { de: "Uhr.", en: "o’clock." },
        ],
      },
      {
        de: "Heute ist Montag, der erste Tag.",
        en: "Today is Monday, the first day.",
        words: [
          { de: "Heute", en: "today" },
          { de: "ist", en: "is" },
          { de: "Montag,", en: "Monday," },
          { de: "der", en: "the" },
          { de: "erste", en: "first" },
          { de: "Tag.", en: "day." },
        ],
      },
      {
        de: "Wir haben fünfzehn Minuten Pause.",
        en: "We have fifteen minutes break.",
        words: [
          { de: "Wir", en: "we" },
          { de: "haben", en: "have" },
          { de: "fünfzehn", en: "fifteen" },
          { de: "Minuten", en: "minutes" },
          { de: "Pause.", en: "break." },
        ],
      },
    ],
    sentences: [
      {
        id: "lf-num-1",
        text: "Wie spät ist es?",
        meaning: "What time is it?",
        words: [
          { de: "Wie", en: "how" },
          { de: "spät", en: "late" },
          { de: "ist", en: "is" },
          { de: "es?", en: "it?" },
        ],
      },
      {
        id: "lf-num-2",
        text: "Es ist halb drei.",
        meaning: "It is half past two (2:30).",
        words: [
          { de: "Es", en: "it" },
          { de: "ist", en: "is" },
          { de: "halb", en: "half" },
          { de: "drei.", en: "three." },
        ],
      },
      {
        id: "lf-num-3",
        text: "Der Zug fährt um 14 Uhr.",
        meaning: "The train leaves at 2 p.m.",
        words: [
          { de: "Der", en: "the" },
          { de: "Zug", en: "train" },
          { de: "fährt", en: "leaves / goes" },
          { de: "um", en: "at" },
          { de: "14", en: "14" },
          { de: "Uhr.", en: "o’clock." },
        ],
      },
      {
        id: "lf-num-4",
        text: "Ich habe zwei Brüder und eine Schwester.",
        meaning: "I have two brothers and one sister.",
        words: [
          { de: "Ich", en: "I" },
          { de: "habe", en: "have" },
          { de: "zwei", en: "two" },
          { de: "Brüder", en: "brothers" },
          { de: "und", en: "and" },
          { de: "eine", en: "a / one" },
          { de: "Schwester.", en: "sister." },
        ],
      },
      {
        id: "lf-num-5",
        text: "Heute ist der zwanzigste Mai.",
        meaning: "Today is the twentieth of May.",
        words: [
          { de: "Heute", en: "today" },
          { de: "ist", en: "is" },
          { de: "der", en: "the" },
          { de: "zwanzigste", en: "twentieth" },
          { de: "Mai.", en: "May." },
        ],
      },
      {
        id: "lf-num-6",
        text: "Die Pause dauert zehn Minuten.",
        meaning: "The break lasts ten minutes.",
        words: [
          { de: "Die", en: "the" },
          { de: "Pause", en: "break" },
          { de: "dauert", en: "lasts" },
          { de: "zehn", en: "ten" },
          { de: "Minuten.", en: "minutes." },
        ],
      },
      {
        id: "lf-num-7",
        text: "Am Wochenende habe ich Zeit.",
        meaning: "On the weekend I have time.",
        words: [
          { de: "Am", en: "on the" },
          { de: "Wochenende", en: "weekend" },
          { de: "habe", en: "have" },
          { de: "ich", en: "I" },
          { de: "Zeit.", en: "time." },
        ],
      },
      {
        id: "lf-num-8",
        text: "Mein Kurs beginnt um acht Uhr dreißig.",
        meaning: "My course starts at 8:30.",
        words: [
          { de: "Mein", en: "my" },
          { de: "Kurs", en: "course" },
          { de: "beginnt", en: "begins" },
          { de: "um", en: "at" },
          { de: "acht", en: "eight" },
          { de: "Uhr", en: "o’clock" },
          { de: "dreißig.", en: "thirty." },
        ],
      },
    ],
  },

  "sein-haben": {
    id: "sein-haben",
    title: "sein / haben",
    description: "Use ich bin / ich habe for identity, states, and possession.",
    storyTitle: "Wer ist das?",
    storyTitleEn: "Who is that?",
    story: [
      {
        de: "Das ist mein Freund Tom. Er ist Lehrer.",
        en: "That is my friend Tom. He is a teacher.",
        words: [
          { de: "Das", en: "that" },
          { de: "ist", en: "is" },
          { de: "mein", en: "my" },
          { de: "Freund", en: "friend" },
          { de: "Tom.", en: "Tom." },
          { de: "Er", en: "he" },
          { de: "ist", en: "is" },
          { de: "Lehrer.", en: "teacher." },
        ],
      },
      {
        de: "Er hat eine Wohnung in Berlin.",
        en: "He has an apartment in Berlin.",
        words: [
          { de: "Er", en: "he" },
          { de: "hat", en: "has" },
          { de: "eine", en: "an" },
          { de: "Wohnung", en: "apartment" },
          { de: "in", en: "in" },
          { de: "Berlin.", en: "Berlin." },
        ],
      },
      {
        de: "Wir sind heute sehr müde.",
        en: "We are very tired today.",
        words: [
          { de: "Wir", en: "we" },
          { de: "sind", en: "are" },
          { de: "heute", en: "today" },
          { de: "sehr", en: "very" },
          { de: "müde.", en: "tired." },
        ],
      },
    ],
    sentences: [
      {
        id: "lf-sein-1",
        text: "Ich bin Student.",
        meaning: "I am a student.",
        words: [
          { de: "Ich", en: "I" },
          { de: "bin", en: "am" },
          { de: "Student.", en: "student." },
        ],
      },
      {
        id: "lf-sein-2",
        text: "Du bist sehr nett.",
        meaning: "You are very nice.",
        words: [
          { de: "Du", en: "you" },
          { de: "bist", en: "are" },
          { de: "sehr", en: "very" },
          { de: "nett.", en: "nice." },
        ],
      },
      {
        id: "lf-sein-3",
        text: "Sie ist aus Österreich.",
        meaning: "She is from Austria.",
        words: [
          { de: "Sie", en: "she" },
          { de: "ist", en: "is" },
          { de: "aus", en: "from" },
          { de: "Österreich.", en: "Austria." },
        ],
      },
      {
        id: "lf-haben-1",
        text: "Ich habe ein Auto.",
        meaning: "I have a car.",
        words: [
          { de: "Ich", en: "I" },
          { de: "habe", en: "have" },
          { de: "ein", en: "a" },
          { de: "Auto.", en: "car." },
        ],
      },
      {
        id: "lf-haben-2",
        text: "Hast du Zeit?",
        meaning: "Do you have time?",
        words: [
          { de: "Hast", en: "have" },
          { de: "du", en: "you" },
          { de: "Zeit?", en: "time?" },
        ],
      },
      {
        id: "lf-haben-3",
        text: "Wir haben keine Kinder.",
        meaning: "We have no children.",
        words: [
          { de: "Wir", en: "we" },
          { de: "haben", en: "have" },
          { de: "keine", en: "no" },
          { de: "Kinder.", en: "children." },
        ],
      },
      {
        id: "lf-sein-4",
        text: "Das Wetter ist schön.",
        meaning: "The weather is nice.",
        words: [
          { de: "Das", en: "the" },
          { de: "Wetter", en: "weather" },
          { de: "ist", en: "is" },
          { de: "schön.", en: "nice." },
        ],
      },
      {
        id: "lf-haben-4",
        text: "Er hat Hunger und Durst.",
        meaning: "He is hungry and thirsty. (lit. has hunger and thirst)",
        words: [
          { de: "Er", en: "he" },
          { de: "hat", en: "has" },
          { de: "Hunger", en: "hunger" },
          { de: "und", en: "and" },
          { de: "Durst.", en: "thirst." },
        ],
      },
    ],
  },

  "nominative-basics": {
    id: "nominative-basics",
    title: "Nominative basics",
    description: "Identify the subject with der / die / das and nominative pronouns.",
    storyTitle: "Wer macht den Tee?",
    storyTitleEn: "Who makes the tea?",
    story: [
      {
        de: "Der Mann macht den Tee.",
        en: "The man makes the tea.",
        words: [
          { de: "Der", en: "the (m)" },
          { de: "Mann", en: "man" },
          { de: "macht", en: "makes" },
          { de: "den", en: "the (acc.)" },
          { de: "Tee.", en: "tea." },
        ],
      },
      {
        de: "Die Frau liest ein Buch.",
        en: "The woman reads a book.",
        words: [
          { de: "Die", en: "the (f)" },
          { de: "Frau", en: "woman" },
          { de: "liest", en: "reads" },
          { de: "ein", en: "a" },
          { de: "Buch.", en: "book." },
        ],
      },
      {
        de: "Das Kind spielt im Garten.",
        en: "The child plays in the garden.",
        words: [
          { de: "Das", en: "the (n)" },
          { de: "Kind", en: "child" },
          { de: "spielt", en: "plays" },
          { de: "im", en: "in the" },
          { de: "Garten.", en: "garden." },
        ],
      },
    ],
    sentences: [
      {
        id: "lf-nom-1",
        text: "Der Lehrer ist freundlich.",
        meaning: "The teacher is friendly.",
        words: [
          { de: "Der", en: "the (m)" },
          { de: "Lehrer", en: "teacher" },
          { de: "ist", en: "is" },
          { de: "freundlich.", en: "friendly." },
        ],
      },
      {
        id: "lf-nom-2",
        text: "Die Schule ist groß.",
        meaning: "The school is big.",
        words: [
          { de: "Die", en: "the (f)" },
          { de: "Schule", en: "school" },
          { de: "ist", en: "is" },
          { de: "groß.", en: "big." },
        ],
      },
      {
        id: "lf-nom-3",
        text: "Das Haus ist neu.",
        meaning: "The house is new.",
        words: [
          { de: "Das", en: "the (n)" },
          { de: "Haus", en: "house" },
          { de: "ist", en: "is" },
          { de: "neu.", en: "new." },
        ],
      },
      {
        id: "lf-nom-4",
        text: "Ich bin der Student.",
        meaning: "I am the student.",
        words: [
          { de: "Ich", en: "I" },
          { de: "bin", en: "am" },
          { de: "der", en: "the (m)" },
          { de: "Student.", en: "student." },
        ],
      },
      {
        id: "lf-nom-5",
        text: "Sie ist die Ärztin.",
        meaning: "She is the doctor (f).",
        words: [
          { de: "Sie", en: "she" },
          { de: "ist", en: "is" },
          { de: "die", en: "the (f)" },
          { de: "Ärztin.", en: "doctor (f)." },
        ],
      },
      {
        id: "lf-nom-6",
        text: "Wer ist das?",
        meaning: "Who is that?",
        words: [
          { de: "Wer", en: "who" },
          { de: "ist", en: "is" },
          { de: "das?", en: "that?" },
        ],
      },
      {
        id: "lf-nom-7",
        text: "Die Kinder sind laut.",
        meaning: "The children are loud.",
        words: [
          { de: "Die", en: "the (pl)" },
          { de: "Kinder", en: "children" },
          { de: "sind", en: "are" },
          { de: "laut.", en: "loud." },
        ],
      },
      {
        id: "lf-nom-8",
        text: "Mein Name ist Fahad.",
        meaning: "My name is Fahad.",
        words: [
          { de: "Mein", en: "my" },
          { de: "Name", en: "name" },
          { de: "ist", en: "is" },
          { de: "Fahad.", en: "Fahad." },
        ],
      },
    ],
  },

  "daily-routines": {
    id: "daily-routines",
    title: "Daily routines",
    description: "Describe a normal day from morning to night.",
    storyTitle: "Mein Tag",
    storyTitleEn: "My day",
    story: [
      {
        de: "Jeden Morgen stehe ich um sieben auf.",
        en: "Every morning I get up at seven.",
        words: [
          { de: "Jeden", en: "every" },
          { de: "Morgen", en: "morning" },
          { de: "stehe", en: "stand / get" },
          { de: "ich", en: "I" },
          { de: "um", en: "at" },
          { de: "sieben", en: "seven" },
          { de: "auf.", en: "up." },
        ],
      },
      {
        de: "Dann frühstücke ich und fahre zur Arbeit.",
        en: "Then I have breakfast and go to work.",
        words: [
          { de: "Dann", en: "then" },
          { de: "frühstücke", en: "have breakfast" },
          { de: "ich", en: "I" },
          { de: "und", en: "and" },
          { de: "fahre", en: "drive / go" },
          { de: "zur", en: "to the" },
          { de: "Arbeit.", en: "work." },
        ],
      },
      {
        de: "Am Abend koche ich und schaue fern.",
        en: "In the evening I cook and watch TV.",
        words: [
          { de: "Am", en: "in the" },
          { de: "Abend", en: "evening" },
          { de: "koche", en: "cook" },
          { de: "ich", en: "I" },
          { de: "und", en: "and" },
          { de: "schaue", en: "watch" },
          { de: "fern.", en: "TV." },
        ],
      },
    ],
    sentences: [
      {
        id: "lf-day-1",
        text: "Ich stehe um sechs Uhr auf.",
        meaning: "I get up at six o’clock.",
        words: [
          { de: "Ich", en: "I" },
          { de: "stehe", en: "get" },
          { de: "um", en: "at" },
          { de: "sechs", en: "six" },
          { de: "Uhr", en: "o’clock" },
          { de: "auf.", en: "up." },
        ],
      },
      {
        id: "lf-day-2",
        text: "Ich dusche mich und ziehe mich an.",
        meaning: "I shower and get dressed.",
        words: [
          { de: "Ich", en: "I" },
          { de: "dusche", en: "shower" },
          { de: "mich", en: "myself" },
          { de: "und", en: "and" },
          { de: "ziehe", en: "put on" },
          { de: "mich", en: "myself" },
          { de: "an.", en: "(separable)." },
        ],
      },
      {
        id: "lf-day-3",
        text: "Zum Frühstück trinke ich Kaffee.",
        meaning: "For breakfast I drink coffee.",
        words: [
          { de: "Zum", en: "for the" },
          { de: "Frühstück", en: "breakfast" },
          { de: "trinke", en: "drink" },
          { de: "ich", en: "I" },
          { de: "Kaffee.", en: "coffee." },
        ],
      },
      {
        id: "lf-day-4",
        text: "Ich gehe zu Fuß zur Arbeit.",
        meaning: "I walk to work.",
        words: [
          { de: "Ich", en: "I" },
          { de: "gehe", en: "go" },
          { de: "zu", en: "on" },
          { de: "Fuß", en: "foot" },
          { de: "zur", en: "to the" },
          { de: "Arbeit.", en: "work." },
        ],
      },
      {
        id: "lf-day-5",
        text: "Mittags esse ich in der Kantine.",
        meaning: "At midday I eat in the canteen.",
        words: [
          { de: "Mittags", en: "at midday" },
          { de: "esse", en: "eat" },
          { de: "ich", en: "I" },
          { de: "in", en: "in" },
          { de: "der", en: "the" },
          { de: "Kantine.", en: "canteen." },
        ],
      },
      {
        id: "lf-day-6",
        text: "Nach der Arbeit gehe ich einkaufen.",
        meaning: "After work I go shopping.",
        words: [
          { de: "Nach", en: "after" },
          { de: "der", en: "the" },
          { de: "Arbeit", en: "work" },
          { de: "gehe", en: "go" },
          { de: "ich", en: "I" },
          { de: "einkaufen.", en: "shopping." },
        ],
      },
      {
        id: "lf-day-7",
        text: "Abends lese ich ein Buch.",
        meaning: "In the evenings I read a book.",
        words: [
          { de: "Abends", en: "in the evenings" },
          { de: "lese", en: "read" },
          { de: "ich", en: "I" },
          { de: "ein", en: "a" },
          { de: "Buch.", en: "book." },
        ],
      },
      {
        id: "lf-day-8",
        text: "Um elf Uhr gehe ich schlafen.",
        meaning: "At eleven o’clock I go to sleep.",
        words: [
          { de: "Um", en: "at" },
          { de: "elf", en: "eleven" },
          { de: "Uhr", en: "o’clock" },
          { de: "gehe", en: "go" },
          { de: "ich", en: "I" },
          { de: "schlafen.", en: "to sleep." },
        ],
      },
    ],
  },

  shopping: {
    id: "shopping",
    title: "Shopping",
    description: "Ask for things, prices, and sizes in shops and markets.",
    storyTitle: "Auf dem Markt",
    storyTitleEn: "At the market",
    story: [
      {
        de: "Ich möchte zwei Äpfel und ein Brot, bitte.",
        en: "I would like two apples and a loaf of bread, please.",
        words: [
          { de: "Ich", en: "I" },
          { de: "möchte", en: "would like" },
          { de: "zwei", en: "two" },
          { de: "Äpfel", en: "apples" },
          { de: "und", en: "and" },
          { de: "ein", en: "a" },
          { de: "Brot,", en: "bread," },
          { de: "bitte.", en: "please." },
        ],
      },
      {
        de: "Wie viel kostet das alles?",
        en: "How much does all that cost?",
        words: [
          { de: "Wie", en: "how" },
          { de: "viel", en: "much" },
          { de: "kostet", en: "costs" },
          { de: "das", en: "that" },
          { de: "alles?", en: "everything?" },
        ],
      },
      {
        de: "Das macht acht Euro fünfzig.",
        en: "That comes to eight euros fifty.",
        words: [
          { de: "Das", en: "that" },
          { de: "macht", en: "makes / comes to" },
          { de: "acht", en: "eight" },
          { de: "Euro", en: "euros" },
          { de: "fünfzig.", en: "fifty." },
        ],
      },
    ],
    sentences: [
      {
        id: "lf-shop-1",
        text: "Was kostet das Hemd?",
        meaning: "What does the shirt cost?",
        words: [
          { de: "Was", en: "what" },
          { de: "kostet", en: "costs" },
          { de: "das", en: "the" },
          { de: "Hemd?", en: "shirt?" },
        ],
      },
      {
        id: "lf-shop-2",
        text: "Haben Sie das in Größe M?",
        meaning: "Do you have that in size M?",
        words: [
          { de: "Haben", en: "have" },
          { de: "Sie", en: "you" },
          { de: "das", en: "that" },
          { de: "in", en: "in" },
          { de: "Größe", en: "size" },
          { de: "M?", en: "M?" },
        ],
      },
      {
        id: "lf-shop-3",
        text: "Ich schaue nur, danke.",
        meaning: "I’m just looking, thanks.",
        words: [
          { de: "Ich", en: "I" },
          { de: "schaue", en: "look" },
          { de: "nur,", en: "only," },
          { de: "danke.", en: "thanks." },
        ],
      },
      {
        id: "lf-shop-4",
        text: "Kann ich bar oder mit Karte zahlen?",
        meaning: "Can I pay cash or by card?",
        words: [
          { de: "Kann", en: "can" },
          { de: "ich", en: "I" },
          { de: "bar", en: "cash" },
          { de: "oder", en: "or" },
          { de: "mit", en: "with" },
          { de: "Karte", en: "card" },
          { de: "zahlen?", en: "pay?" },
        ],
      },
      {
        id: "lf-shop-5",
        text: "Wo finde ich die Milch?",
        meaning: "Where can I find the milk?",
        words: [
          { de: "Wo", en: "where" },
          { de: "finde", en: "find" },
          { de: "ich", en: "I" },
          { de: "die", en: "the" },
          { de: "Milch?", en: "milk?" },
        ],
      },
      {
        id: "lf-shop-6",
        text: "Das ist zu teuer für mich.",
        meaning: "That is too expensive for me.",
        words: [
          { de: "Das", en: "that" },
          { de: "ist", en: "is" },
          { de: "zu", en: "too" },
          { de: "teuer", en: "expensive" },
          { de: "für", en: "for" },
          { de: "mich.", en: "me." },
        ],
      },
      {
        id: "lf-shop-7",
        text: "Ich nehme das, bitte.",
        meaning: "I’ll take that, please.",
        words: [
          { de: "Ich", en: "I" },
          { de: "nehme", en: "take" },
          { de: "das,", en: "that," },
          { de: "bitte.", en: "please." },
        ],
      },
      {
        id: "lf-shop-8",
        text: "Gibt es einen Rabatt?",
        meaning: "Is there a discount?",
        words: [
          { de: "Gibt", en: "is there" },
          { de: "es", en: "it" },
          { de: "einen", en: "a" },
          { de: "Rabatt?", en: "discount?" },
        ],
      },
    ],
  },

  "modal-verbs": {
    id: "modal-verbs",
    title: "Modal verbs",
    description: "Express ability, necessity, desire, and polite requests with können, müssen, wollen, möchten.",
    storyTitle: "Was möchtest du machen?",
    storyTitleEn: "What would you like to do?",
    story: [
      {
        de: "Ich möchte heute Abend ins Kino gehen.",
        en: "I would like to go to the cinema this evening.",
        words: [
          { de: "Ich", en: "I" },
          { de: "möchte", en: "would like" },
          { de: "heute", en: "today" },
          { de: "Abend", en: "evening" },
          { de: "ins", en: "into the" },
          { de: "Kino", en: "cinema" },
          { de: "gehen.", en: "to go." },
        ],
      },
      {
        de: "Leider muss ich noch arbeiten.",
        en: "Unfortunately I still have to work.",
        words: [
          { de: "Leider", en: "unfortunately" },
          { de: "muss", en: "must / have to" },
          { de: "ich", en: "I" },
          { de: "noch", en: "still" },
          { de: "arbeiten.", en: "to work." },
        ],
      },
      {
        de: "Können wir das Wochenende treffen?",
        en: "Can we meet on the weekend?",
        words: [
          { de: "Können", en: "can" },
          { de: "wir", en: "we" },
          { de: "das", en: "the" },
          { de: "Wochenende", en: "weekend" },
          { de: "treffen?", en: "meet?" },
        ],
      },
    ],
    sentences: [
      {
        id: "lf-mod-1",
        text: "Ich kann Deutsch sprechen.",
        meaning: "I can speak German.",
        words: [
          { de: "Ich", en: "I" },
          { de: "kann", en: "can" },
          { de: "Deutsch", en: "German" },
          { de: "sprechen.", en: "speak." },
        ],
      },
      {
        id: "lf-mod-2",
        text: "Du musst pünktlich sein.",
        meaning: "You have to be on time.",
        words: [
          { de: "Du", en: "you" },
          { de: "musst", en: "must" },
          { de: "pünktlich", en: "on time" },
          { de: "sein.", en: "be." },
        ],
      },
      {
        id: "lf-mod-3",
        text: "Wir wollen Pizza essen.",
        meaning: "We want to eat pizza.",
        words: [
          { de: "Wir", en: "we" },
          { de: "wollen", en: "want" },
          { de: "Pizza", en: "pizza" },
          { de: "essen.", en: "eat." },
        ],
      },
      {
        id: "lf-mod-4",
        text: "Möchtest du einen Kaffee?",
        meaning: "Would you like a coffee?",
        words: [
          { de: "Möchtest", en: "would like" },
          { de: "du", en: "you" },
          { de: "einen", en: "a" },
          { de: "Kaffee?", en: "coffee?" },
        ],
      },
      {
        id: "lf-mod-5",
        text: "Darf ich hier parken?",
        meaning: "May I park here?",
        words: [
          { de: "Darf", en: "may" },
          { de: "ich", en: "I" },
          { de: "hier", en: "here" },
          { de: "parken?", en: "park?" },
        ],
      },
      {
        id: "lf-mod-6",
        text: "Sie soll den Arzt anrufen.",
        meaning: "She is supposed to call the doctor.",
        words: [
          { de: "Sie", en: "she" },
          { de: "soll", en: "should / is to" },
          { de: "den", en: "the" },
          { de: "Arzt", en: "doctor" },
          { de: "anrufen.", en: "call." },
        ],
      },
      {
        id: "lf-mod-7",
        text: "Ich möchte Ihnen helfen.",
        meaning: "I would like to help you.",
        words: [
          { de: "Ich", en: "I" },
          { de: "möchte", en: "would like" },
          { de: "Ihnen", en: "you (dat.)" },
          { de: "helfen.", en: "help." },
        ],
      },
      {
        id: "lf-mod-8",
        text: "Wir können uns später treffen.",
        meaning: "We can meet later.",
        words: [
          { de: "Wir", en: "we" },
          { de: "können", en: "can" },
          { de: "uns", en: "each other" },
          { de: "später", en: "later" },
          { de: "treffen.", en: "meet." },
        ],
      },
    ],
  },

  "perfekt-intro": {
    id: "perfekt-intro",
    title: "Perfekt intro",
    description: "Talk about the recent past with haben / sein + Partizip II.",
    storyTitle: "Was hast du gestern gemacht?",
    storyTitleEn: "What did you do yesterday?",
    story: [
      {
        de: "Gestern bin ich früh aufgestanden.",
        en: "Yesterday I got up early.",
        words: [
          { de: "Gestern", en: "yesterday" },
          { de: "bin", en: "am / have (aux.)" },
          { de: "ich", en: "I" },
          { de: "früh", en: "early" },
          { de: "aufgestanden.", en: "gotten up." },
        ],
      },
      {
        de: "Dann habe ich Deutsch gelernt.",
        en: "Then I learned German.",
        words: [
          { de: "Dann", en: "then" },
          { de: "habe", en: "have" },
          { de: "ich", en: "I" },
          { de: "Deutsch", en: "German" },
          { de: "gelernt.", en: "learned." },
        ],
      },
      {
        de: "Am Abend sind wir ins Restaurant gegangen.",
        en: "In the evening we went to the restaurant.",
        words: [
          { de: "Am", en: "in the" },
          { de: "Abend", en: "evening" },
          { de: "sind", en: "are / have (aux.)" },
          { de: "wir", en: "we" },
          { de: "ins", en: "into the" },
          { de: "Restaurant", en: "restaurant" },
          { de: "gegangen.", en: "gone." },
        ],
      },
    ],
    sentences: [
      {
        id: "lf-perf-1",
        text: "Ich habe Pizza gegessen.",
        meaning: "I ate / have eaten pizza.",
        words: [
          { de: "Ich", en: "I" },
          { de: "habe", en: "have" },
          { de: "Pizza", en: "pizza" },
          { de: "gegessen.", en: "eaten." },
        ],
      },
      {
        id: "lf-perf-2",
        text: "Sie hat einen Brief geschrieben.",
        meaning: "She wrote / has written a letter.",
        words: [
          { de: "Sie", en: "she" },
          { de: "hat", en: "has" },
          { de: "einen", en: "a" },
          { de: "Brief", en: "letter" },
          { de: "geschrieben.", en: "written." },
        ],
      },
      {
        id: "lf-perf-3",
        text: "Wir sind nach Hause gekommen.",
        meaning: "We came / have come home.",
        words: [
          { de: "Wir", en: "we" },
          { de: "sind", en: "are (aux.)" },
          { de: "nach", en: "to" },
          { de: "Hause", en: "home" },
          { de: "gekommen.", en: "come." },
        ],
      },
      {
        id: "lf-perf-4",
        text: "Er ist mit dem Bus gefahren.",
        meaning: "He went / has gone by bus.",
        words: [
          { de: "Er", en: "he" },
          { de: "ist", en: "is (aux.)" },
          { de: "mit", en: "with" },
          { de: "dem", en: "the" },
          { de: "Bus", en: "bus" },
          { de: "gefahren.", en: "driven / gone." },
        ],
      },
      {
        id: "lf-perf-5",
        text: "Hast du den Film gesehen?",
        meaning: "Have you seen the film?",
        words: [
          { de: "Hast", en: "have" },
          { de: "du", en: "you" },
          { de: "den", en: "the" },
          { de: "Film", en: "film" },
          { de: "gesehen?", en: "seen?" },
        ],
      },
      {
        id: "lf-perf-6",
        text: "Ich habe meine Hausaufgaben gemacht.",
        meaning: "I did / have done my homework.",
        words: [
          { de: "Ich", en: "I" },
          { de: "habe", en: "have" },
          { de: "meine", en: "my" },
          { de: "Hausaufgaben", en: "homework" },
          { de: "gemacht.", en: "done." },
        ],
      },
      {
        id: "lf-perf-7",
        text: "Sie sind in Berlin geblieben.",
        meaning: "They stayed / have stayed in Berlin.",
        words: [
          { de: "Sie", en: "they" },
          { de: "sind", en: "are (aux.)" },
          { de: "in", en: "in" },
          { de: "Berlin", en: "Berlin" },
          { de: "geblieben.", en: "stayed." },
        ],
      },
      {
        id: "lf-perf-8",
        text: "Wir haben lange gesprochen.",
        meaning: "We talked / have talked for a long time.",
        words: [
          { de: "Wir", en: "we" },
          { de: "haben", en: "have" },
          { de: "lange", en: "long" },
          { de: "gesprochen.", en: "spoken." },
        ],
      },
    ],
  },
};

/** Compact builder for higher-level topics */
function __learnTopic(id, title, description, storyTitle, storyTitleEn, storyRows, sentenceRows) {
  const toWords = (pairs) => pairs.map(([de, en]) => ({ de, en }));
  const toSent = (row, prefix, i) => ({
    id: `${prefix}-${i + 1}`,
    text: row[0],
    meaning: row[1],
    words: toWords(row[2]),
  });
  return {
    id,
    title,
    description,
    storyTitle,
    storyTitleEn,
    story: storyRows.map((row) => ({
      de: row[0],
      en: row[1],
      words: toWords(row[2]),
    })),
    sentences: sentenceRows.map((row, i) => toSent(row, `lf-${id}`, i)),
  };
}

Object.assign(LEARN_FOCUS_TOPICS, {
  opinions: __learnTopic(
    "opinions",
    "Opinions",
    "Share what you think politely and clearly.",
    "Im Café",
    "At the café",
    [
      ["Ich finde den Film interessant.", "I find the film interesting.", [["Ich","I"],["finde","find"],["den","the"],["Film","film"],["interessant.","interesting."]]],
      ["Meiner Meinung nach ist er zu lang.", "In my opinion it is too long.", [["Meiner","my"],["Meinung","opinion"],["nach","after / according to"],["ist","is"],["er","it/he"],["zu","too"],["lang.","long."]]],
      ["Das sehe ich anders.", "I see that differently.", [["Das","that"],["sehe","see"],["ich","I"],["anders.","differently."]]],
    ],
    [
      ["Ich denke, das ist eine gute Idee.", "I think that is a good idea.", [["Ich","I"],["denke,","think,"],["das","that"],["ist","is"],["eine","a"],["gute","good"],["Idee.","idea."]]],
      ["Ich bin damit einverstanden.", "I agree with that.", [["Ich","I"],["bin","am"],["damit","with that"],["einverstanden.","agreed."]]],
      ["Das Argument überzeugt mich nicht.", "That argument does not convince me.", [["Das","the"],["Argument","argument"],["überzeugt","convinces"],["mich","me"],["nicht.","not."]]],
      ["Was hältst du davon?", "What do you think of that?", [["Was","what"],["hältst","hold / think"],["du","you"],["davon?","of it?"]]],
      ["Ich bin unsicher.", "I am unsure.", [["Ich","I"],["bin","am"],["unsicher.","unsure."]]],
      ["Kurz gesagt: Ich stimme zu.", "In short: I agree.", [["Kurz","short"],["gesagt:","said:"],["Ich","I"],["stimme","agree"],["zu.","(separable)."]]],
    ]
  ),
  "travel-work": __learnTopic(
    "travel-work",
    "Travel & work",
    "Handle tickets, meetings, and workplace small talk.",
    "Auf Dienstreise",
    "On a business trip",
    [
      ["Ich fliege morgen nach München.", "I fly to Munich tomorrow.", [["Ich","I"],["fliege","fly"],["morgen","tomorrow"],["nach","to"],["München.","Munich."]]],
      ["Haben Sie eine Reservierung?", "Do you have a reservation?", [["Haben","have"],["Sie","you"],["eine","a"],["Reservierung?","reservation?"]]],
      ["Das Meeting beginnt um zehn.", "The meeting starts at ten.", [["Das","the"],["Meeting","meeting"],["beginnt","begins"],["um","at"],["zehn.","ten."]]],
    ],
    [
      ["Wo ist der Bahnsteig?", "Where is the platform?", [["Wo","where"],["ist","is"],["der","the"],["Bahnsteig?","platform?"]]],
      ["Ich brauche eine Fahrkarte nach Hamburg.", "I need a ticket to Hamburg.", [["Ich","I"],["brauche","need"],["eine","a"],["Fahrkarte","ticket"],["nach","to"],["Hamburg.","Hamburg."]]],
      ["Können wir den Termin verschieben?", "Can we postpone the appointment?", [["Können","can"],["wir","we"],["den","the"],["Termin","appointment"],["verschieben?","postpone?"]]],
      ["Ich arbeite im Homeoffice.", "I work from home.", [["Ich","I"],["arbeite","work"],["im","in the"],["Homeoffice.","home office."]]],
      ["Die Präsentation war klar.", "The presentation was clear.", [["Die","the"],["Präsentation","presentation"],["war","was"],["klar.","clear."]]],
      ["Bitte schicken Sie mir die Unterlagen.", "Please send me the documents.", [["Bitte","please"],["schicken","send"],["Sie","you"],["mir","me"],["die","the"],["Unterlagen.","documents."]]],
    ]
  ),
  "weil-dass": __learnTopic(
    "weil-dass",
    "weil / dass",
    "Put the verb at the end in weil- and dass-clauses.",
    "Warum lernst du Deutsch?",
    "Why are you learning German?",
    [
      ["Ich lerne Deutsch, weil ich in Berlin arbeiten möchte.", "I learn German because I want to work in Berlin.", [["Ich","I"],["lerne","learn"],["Deutsch,","German,"],["weil","because"],["ich","I"],["in","in"],["Berlin","Berlin"],["arbeiten","to work"],["möchte.","would like."]]],
      ["Ich glaube, dass das möglich ist.", "I believe that that is possible.", [["Ich","I"],["glaube,","believe,"],["dass","that"],["das","that"],["möglich","possible"],["ist.","is."]]],
    ],
    [
      ["Ich bleibe zu Hause, weil ich krank bin.", "I stay home because I am sick.", [["Ich","I"],["bleibe","stay"],["zu","at"],["Hause,","home,"],["weil","because"],["ich","I"],["krank","sick"],["bin.","am."]]],
      ["Sie sagt, dass sie keine Zeit hat.", "She says that she has no time.", [["Sie","she"],["sagt,","says,"],["dass","that"],["sie","she"],["keine","no"],["Zeit","time"],["hat.","has."]]],
      ["Wir freuen uns, dass du kommst.", "We are happy that you are coming.", [["Wir","we"],["freuen","are glad"],["uns,","ourselves,"],["dass","that"],["du","you"],["kommst.","come."]]],
      ["Er lernt viel, weil die Prüfung bald ist.", "He studies a lot because the exam is soon.", [["Er","he"],["lernt","learns"],["viel,","a lot,"],["weil","because"],["die","the"],["Prüfung","exam"],["bald","soon"],["ist.","is."]]],
      ["Ich hoffe, dass alles gut geht.", "I hope that everything goes well.", [["Ich","I"],["hoffe,","hope,"],["dass","that"],["alles","everything"],["gut","well"],["geht.","goes."]]],
      ["Das Problem ist, dass wir warten müssen.", "The problem is that we have to wait.", [["Das","the"],["Problem","problem"],["ist,","is,"],["dass","that"],["wir","we"],["warten","wait"],["müssen.","must."]]],
    ]
  ),
  dative: __learnTopic(
    "dative",
    "Dative",
    "Use mir/dir/ihm and dem/der/den for the receiver.",
    "Wem hilfst du?",
    "Whom are you helping?",
    [
      ["Ich helfe meinem Bruder.", "I help my brother.", [["Ich","I"],["helfe","help"],["meinem","my (dat. m)"],["Bruder.","brother."]]],
      ["Sie gibt der Frau das Buch.", "She gives the woman the book.", [["Sie","she"],["gibt","gives"],["der","the (dat. f)"],["Frau","woman"],["das","the"],["Buch.","book."]]],
    ],
    [
      ["Das Geschenk gehört mir.", "The gift belongs to me.", [["Das","the"],["Geschenk","gift"],["gehört","belongs"],["mir.","to me."]]],
      ["Kannst du mir bitte helfen?", "Can you please help me?", [["Kannst","can"],["du","you"],["mir","me"],["bitte","please"],["helfen?","help?"]]],
      ["Wir danken Ihnen.", "We thank you (formal).", [["Wir","we"],["danken","thank"],["Ihnen.","you (dat.)."]]],
      ["Er schreibt seiner Mutter eine E-Mail.", "He writes his mother an email.", [["Er","he"],["schreibt","writes"],["seiner","his (dat. f)"],["Mutter","mother"],["eine","an"],["E-Mail.","email."]]],
      ["Ich antworte dem Lehrer.", "I answer the teacher.", [["Ich","I"],["antworte","answer"],["dem","the (dat. m)"],["Lehrer.","teacher."]]],
      ["Die Kinder gefallen mir.", "I like the children. (they please me)", [["Die","the"],["Kinder","children"],["gefallen","please"],["mir.","me."]]],
    ]
  ),
  debate: __learnTopic(
    "debate",
    "Debate language",
    "Argue both sides with clear structure.",
    "Pro und Contra",
    "Pros and cons",
    [
      ["Einerseits spart Homeoffice Zeit.", "On one hand, home office saves time.", [["Einerseits","on one hand"],["spart","saves"],["Homeoffice","home office"],["Zeit.","time."]]],
      ["Andererseits fehlt der direkte Kontakt.", "On the other hand, direct contact is missing.", [["Andererseits","on the other hand"],["fehlt","is missing"],["der","the"],["direkte","direct"],["Kontakt.","contact."]]],
    ],
    [
      ["Ich sehe das anders.", "I see that differently.", [["Ich","I"],["sehe","see"],["das","that"],["anders.","differently."]]],
      ["Das Argument ist schwach.", "That argument is weak.", [["Das","the"],["Argument","argument"],["ist","is"],["schwach.","weak."]]],
      ["Könnten wir einen Kompromiss finden?", "Could we find a compromise?", [["Könnten","could"],["wir","we"],["einen","a"],["Kompromiss","compromise"],["finden?","find?"]]],
      ["Im Grunde geht es um Fairness.", "Basically it is about fairness.", [["Im","in the"],["Grunde","basis"],["geht","goes"],["es","it"],["um","about"],["Fairness.","fairness."]]],
      ["Kurz gesagt: Wir brauchen Regeln.", "In short: we need rules.", [["Kurz","short"],["gesagt:","said:"],["Wir","we"],["brauchen","need"],["Regeln.","rules."]]],
      ["Darauf möchte ich näher eingehen.", "I’d like to go into that further.", [["Darauf","on that"],["möchte","would like"],["ich","I"],["näher","more closely"],["eingehen.","go into."]]],
    ]
  ),
  passive: __learnTopic(
    "passive",
    "Passive",
    "Form the passive with werden + Partizip II.",
    "Was wurde gemacht?",
    "What was done?",
    [
      ["Das Projekt wurde gestern vorgestellt.", "The project was presented yesterday.", [["Das","the"],["Projekt","project"],["wurde","was"],["gestern","yesterday"],["vorgestellt.","presented."]]],
      ["Die E-Mails werden jeden Morgen gelesen.", "The emails are read every morning.", [["Die","the"],["E-Mails","emails"],["werden","are"],["jeden","every"],["Morgen","morning"],["gelesen.","read."]]],
    ],
    [
      ["Das Haus wird renoviert.", "The house is being renovated.", [["Das","the"],["Haus","house"],["wird","is being"],["renoviert.","renovated."]]],
      ["Der Brief wurde geschrieben.", "The letter was written.", [["Der","the"],["Brief","letter"],["wurde","was"],["geschrieben.","written."]]],
      ["Hier darf nicht geraucht werden.", "Smoking is not allowed here.", [["Hier","here"],["darf","may"],["nicht","not"],["geraucht","smoked"],["werden.","be."]]],
      ["Die Entscheidung wird morgen getroffen.", "The decision will be made tomorrow.", [["Die","the"],["Entscheidung","decision"],["wird","will be"],["morgen","tomorrow"],["getroffen.","made."]]],
      ["Alles wurde rechtzeitig erledigt.", "Everything was finished on time.", [["Alles","everything"],["wurde","was"],["rechtzeitig","on time"],["erledigt.","finished."]]],
      ["Es wird oft diskutiert.", "It is often discussed.", [["Es","it"],["wird","is"],["oft","often"],["diskutiert.","discussed."]]],
    ]
  ),
  "konjunktiv-ii": __learnTopic(
    "konjunktiv-ii",
    "Konjunktiv II",
    "Make polite requests and talk about unreal wishes.",
    "Höflich bitten",
    "Asking politely",
    [
      ["Könnten Sie mir bitte helfen?", "Could you please help me?", [["Könnten","could"],["Sie","you"],["mir","me"],["bitte","please"],["helfen?","help?"]]],
      ["Ich würde gerne mehr Zeit haben.", "I would like to have more time.", [["Ich","I"],["würde","would"],["gerne","gladly"],["mehr","more"],["Zeit","time"],["haben.","have."]]],
    ],
    [
      ["Würden Sie das Fenster schließen?", "Would you close the window?", [["Würden","would"],["Sie","you"],["das","the"],["Fenster","window"],["schließen?","close?"]]],
      ["Wenn ich Zeit hätte, würde ich kommen.", "If I had time, I would come.", [["Wenn","if"],["ich","I"],["Zeit","time"],["hätte,","had,"],["würde","would"],["ich","I"],["kommen.","come."]]],
      ["Es wäre schön, wenn du anrufst.", "It would be nice if you call.", [["Es","it"],["wäre","would be"],["schön,","nice,"],["wenn","if"],["du","you"],["anrufst.","call."]]],
      ["Ich hätte gerne einen Termin.", "I would like an appointment.", [["Ich","I"],["hätte","would have"],["gerne","gladly"],["einen","an"],["Termin.","appointment."]]],
      ["Das wäre besser.", "That would be better.", [["Das","that"],["wäre","would be"],["besser.","better."]]],
      ["Könntest du das erklären?", "Could you explain that?", [["Könntest","could"],["du","you"],["das","that"],["erklären?","explain?"]]],
    ]
  ),
  relativsaetze: __learnTopic(
    "relativsaetze",
    "Relativsätze",
    "Add detail with der/die/das relative clauses.",
    "Die Person, die hilft",
    "The person who helps",
    [
      ["Das ist der Mann, der mir geholfen hat.", "That is the man who helped me.", [["Das","that"],["ist","is"],["der","the"],["Mann,","man,"],["der","who"],["mir","me"],["geholfen","helped"],["hat.","has."]]],
      ["Die Frau, die dort steht, ist meine Lehrerin.", "The woman who is standing there is my teacher.", [["Die","the"],["Frau,","woman,"],["die","who"],["dort","there"],["steht,","stands,"],["ist","is"],["meine","my"],["Lehrerin.","teacher."]]],
    ],
    [
      ["Das Buch, das ich lese, ist spannend.", "The book that I am reading is exciting.", [["Das","the"],["Buch,","book,"],["das","that"],["ich","I"],["lese,","read,"],["ist","is"],["spannend.","exciting."]]],
      ["Die Entscheidung, die wir getroffen haben, war richtig.", "The decision that we made was right.", [["Die","the"],["Entscheidung,","decision,"],["die","that"],["wir","we"],["getroffen","made"],["haben,","have,"],["war","was"],["richtig.","right."]]],
      ["Ich kenne jemanden, der Deutsch spricht.", "I know someone who speaks German.", [["Ich","I"],["kenne","know"],["jemanden,","someone,"],["der","who"],["Deutsch","German"],["spricht.","speaks."]]],
      ["Das ist alles, was ich weiß.", "That is everything that I know.", [["Das","that"],["ist","is"],["alles,","everything,"],["was","what/that"],["ich","I"],["weiß.","know."]]],
      ["Die Stadt, in der ich wohne, ist ruhig.", "The city in which I live is quiet.", [["Die","the"],["Stadt,","city,"],["in","in"],["der","which"],["ich","I"],["wohne,","live,"],["ist","is"],["ruhig.","quiet."]]],
      ["Er hat einen Freund, dem er vertraut.", "He has a friend whom he trusts.", [["Er","he"],["hat","has"],["einen","a"],["Freund,","friend,"],["dem","whom"],["er","he"],["vertraut.","trusts."]]],
    ]
  ),
  nuance: __learnTopic(
    "nuance",
    "Nuance",
    "Soften or strengthen statements with precise wording.",
    "Genau gesagt",
    "Precisely speaking",
    [
      ["Das ist durchaus möglich.", "That is quite possible.", [["Das","that"],["ist","is"],["durchaus","quite"],["möglich.","possible."]]],
      ["Ich bin eher zurückhaltend.", "I am rather reserved.", [["Ich","I"],["bin","am"],["eher","rather"],["zurückhaltend.","reserved."]]],
    ],
    [
      ["Das ist keineswegs klar.", "That is by no means clear.", [["Das","that"],["ist","is"],["keineswegs","by no means"],["klar.","clear."]]],
      ["Im Grunde genommen stimme ich zu.", "Basically I agree.", [["Im","in"],["Grunde","principle"],["genommen","taken"],["stimme","agree"],["ich","I"],["zu.","(sep.)."]]],
      ["Es kommt darauf an.", "It depends.", [["Es","it"],["kommt","comes"],["darauf","on that"],["an.","(sep.)."]]],
      ["Das lässt sich so nicht sagen.", "You can’t put it that way.", [["Das","that"],["lässt","lets"],["sich","itself"],["so","like that"],["nicht","not"],["sagen.","say."]]],
      ["Ich würde eher warten.", "I would rather wait.", [["Ich","I"],["würde","would"],["eher","rather"],["warten.","wait."]]],
      ["Das wirft Fragen auf.", "That raises questions.", [["Das","that"],["wirft","throws"],["Fragen","questions"],["auf.","up."]]],
    ]
  ),
  "academic-style": __learnTopic(
    "academic-style",
    "Academic style",
    "Write and speak with clearer academic structure.",
    "Eine kurze These",
    "A short thesis",
    [
      ["Die Studie zeigt, dass Übung hilft.", "The study shows that practice helps.", [["Die","the"],["Studie","study"],["zeigt,","shows,"],["dass","that"],["Übung","practice"],["hilft.","helps."]]],
      ["Daraus folgt eine klare Empfehlung.", "From that follows a clear recommendation.", [["Daraus","from that"],["folgt","follows"],["eine","a"],["klare","clear"],["Empfehlung.","recommendation."]]],
    ],
    [
      ["Im Folgenden wird das Problem erklärt.", "In the following the problem is explained.", [["Im","in the"],["Folgenden","following"],["wird","is"],["das","the"],["Problem","problem"],["erklärt.","explained."]]],
      ["Es gilt zu prüfen, ob das stimmt.", "It remains to check whether that is true.", [["Es","it"],["gilt","is necessary"],["zu","to"],["prüfen,","check,"],["ob","whether"],["das","that"],["stimmt.","is true."]]],
      ["Die Ergebnisse sind überzeugend.", "The results are convincing.", [["Die","the"],["Ergebnisse","results"],["sind","are"],["überzeugend.","convincing."]]],
      ["Zusammenfassend lässt sich sagen…", "In summary one can say…", [["Zusammenfassend","summarizing"],["lässt","lets"],["sich","itself"],["sagen…","say…"]]],
      ["Dies führt zu neuen Fragen.", "This leads to new questions.", [["Dies","this"],["führt","leads"],["zu","to"],["neuen","new"],["Fragen.","questions."]]],
      ["Die These bedarf weiterer Belege.", "The thesis needs further evidence.", [["Die","the"],["These","thesis"],["bedarf","requires"],["weiterer","further"],["Belege.","evidence."]]],
    ]
  ),
  participial: __learnTopic(
    "participial",
    "Partizipial",
    "Use participles as adjectives before nouns.",
    "Die gelesenen Bücher",
    "The books that were read",
    [
      ["Das geöffnete Fenster lässt Luft herein.", "The opened window lets air in.", [["Das","the"],["geöffnete","opened"],["Fenster","window"],["lässt","lets"],["Luft","air"],["herein.","in."]]],
      ["Die wartenden Gäste sind geduldig.", "The waiting guests are patient.", [["Die","the"],["wartenden","waiting"],["Gäste","guests"],["sind","are"],["geduldig.","patient."]]],
    ],
    [
      ["Die geschriebene E-Mail war klar.", "The written email was clear.", [["Die","the"],["geschriebene","written"],["E-Mail","email"],["war","was"],["klar.","clear."]]],
      ["Ein lachendes Kind steht dort.", "A laughing child is standing there.", [["Ein","a"],["lachendes","laughing"],["Kind","child"],["steht","stands"],["dort.","there."]]],
      ["Die gekauften Äpfel sind frisch.", "The bought apples are fresh.", [["Die","the"],["gekauften","bought"],["Äpfel","apples"],["sind","are"],["frisch.","fresh."]]],
      ["Das stehende Auto blockiert die Straße.", "The standing car blocks the street.", [["Das","the"],["stehende","standing"],["Auto","car"],["blockiert","blocks"],["die","the"],["Straße.","street."]]],
      ["Die erledigte Arbeit war wichtig.", "The completed work was important.", [["Die","the"],["erledigte","completed"],["Arbeit","work"],["war","was"],["wichtig.","important."]]],
      ["Ein überraschendes Ergebnis kam heraus.", "A surprising result came out.", [["Ein","a"],["überraschendes","surprising"],["Ergebnis","result"],["kam","came"],["heraus.","out."]]],
    ]
  ),
  idioms: __learnTopic(
    "idioms",
    "Idioms",
    "Use common fixed expressions naturally.",
    "Redewendungen",
    "Idiomatic phrases",
    [
      ["Er hat den Nagel auf den Kopf getroffen.", "He hit the nail on the head.", [["Er","he"],["hat","has"],["den","the"],["Nagel","nail"],["auf","on"],["den","the"],["Kopf","head"],["getroffen.","hit."]]],
      ["Das ist mir Wurst.", "I don’t care. (lit. that’s sausage to me)", [["Das","that"],["ist","is"],["mir","to me"],["Wurst.","sausage."]]],
    ],
    [
      ["Ich verstehe nur Bahnhof.", "I don’t understand a thing.", [["Ich","I"],["verstehe","understand"],["nur","only"],["Bahnhof.","station."]]],
      ["Das geht über die Hutschnur.", "That is the last straw / too much.", [["Das","that"],["geht","goes"],["über","over"],["die","the"],["Hutschnur.","hat cord."]]],
      ["Wir sitzen alle im gleichen Boot.", "We are all in the same boat.", [["Wir","we"],["sitzen","sit"],["alle","all"],["im","in the"],["gleichen","same"],["Boot.","boat."]]],
      ["Mach keine Fisimatenten!", "Don’t make a fuss!", [["Mach","make"],["keine","no"],["Fisimatenten!","fuss!"]]],
      ["Das kostet ein Auge und ein Bein? Nein — ein Vermögen.", "That costs a fortune.", [["Das","that"],["kostet","costs"],["ein","a"],["Vermögen.","fortune."]]],
      ["Schritt dich nicht zu weit aus dem Fenster.", "Don’t stick your neck out too far.", [["Lehn","lean"],["dich","yourself"],["nicht","not"],["zu","too"],["weit","far"],["aus","out of"],["dem","the"],["Fenster.","window."]]],
    ]
  ),
  "style-register": __learnTopic(
    "style-register",
    "Style & register",
    "Switch between casual and formal German.",
    "Formell oder locker?",
    "Formal or casual?",
    [
      ["Hallo! Wie geht’s? (locker)", "Hi! How’s it going? (casual)", [["Hallo!","Hi!"],["Wie","how"],["geht’s?","goes it?"]]],
      ["Guten Tag. Wie geht es Ihnen? (formell)", "Good day. How are you? (formal)", [["Guten","good"],["Tag.","day."],["Wie","how"],["geht","goes"],["es","it"],["Ihnen?","you?"]]],
    ],
    [
      ["Kannst du mir helfen? (du)", "Can you help me? (informal)", [["Kannst","can"],["du","you"],["mir","me"],["helfen?","help?"]]],
      ["Könnten Sie mir bitte helfen? (Sie)", "Could you please help me? (formal)", [["Könnten","could"],["Sie","you"],["mir","me"],["bitte","please"],["helfen?","help?"]]],
      ["Tschüss! / Auf Wiedersehen!", "Bye! / Goodbye!", [["Tschüss!","Bye!"],["Auf","until"],["Wiedersehen!","seeing again!"]]],
      ["Ich würde mich über eine Rückmeldung freuen.", "I would appreciate feedback.", [["Ich","I"],["würde","would"],["mich","myself"],["über","about"],["eine","a"],["Rückmeldung","feedback"],["freuen.","be glad."]]],
      ["Das passt mir gut. / Das ist akzeptabel.", "That works for me. / That is acceptable.", [["Das","that"],["passt","fits"],["mir","me"],["gut.","well."]]],
      ["Bitte teilen Sie uns Ihre Entscheidung mit.", "Please inform us of your decision.", [["Bitte","please"],["teilen","share"],["Sie","you"],["uns","us"],["Ihre","your"],["Entscheidung","decision"],["mit.","(sep.)."]]],
    ]
  ),
  rhetoric: __learnTopic(
    "rhetoric",
    "Rhetoric",
    "Structure persuasion with clarity and emphasis.",
    "Überzeugend sprechen",
    "Speaking persuasively",
    [
      ["Erstens brauchen wir Zeit. Zweitens brauchen wir Klarheit.", "First we need time. Second we need clarity.", [["Erstens","first"],["brauchen","need"],["wir","we"],["Zeit.","time."],["Zweitens","second"],["brauchen","need"],["wir","we"],["Klarheit.","clarity."]]],
      ["Die entscheidende Frage lautet: Warum jetzt?", "The decisive question is: why now?", [["Die","the"],["entscheidende","decisive"],["Frage","question"],["lautet:","reads:"],["Warum","why"],["jetzt?","now?"]]],
    ],
    [
      ["Lassen Sie mich das verdeutlichen.", "Let me make that clear.", [["Lassen","let"],["Sie","you"],["mich","me"],["das","that"],["verdeutlichen.","clarify."]]],
      ["Hierin liegt der Kern.", "Herein lies the core.", [["Hierin","herein"],["liegt","lies"],["der","the"],["Kern.","core."]]],
      ["Das Gegenteil wäre riskant.", "The opposite would be risky.", [["Das","the"],["Gegenteil","opposite"],["wäre","would be"],["riskant.","risky."]]],
      ["Ich komme zum Schluss.", "I come to the conclusion.", [["Ich","I"],["komme","come"],["zum","to the"],["Schluss.","conclusion."]]],
      ["Nichtsdestotrotz bleibt die Frage offen.", "Nevertheless the question remains open.", [["Nichtsdestotrotz","nevertheless"],["bleibt","remains"],["die","the"],["Frage","question"],["offen.","open."]]],
      ["Darauf kommt es an.", "That is what matters.", [["Darauf","on that"],["kommt","comes"],["es","it"],["an.","(sep.)."]]],
    ]
  ),
  "irony-tone": __learnTopic(
    "irony-tone",
    "Irony & tone",
    "Notice tone markers and careful irony.",
    "Wie klingt das?",
    "How does that sound?",
    [
      ["Na klar, das war ja ganz einfach…", "Sure, that was totally easy… (ironic)", [["Na","well"],["klar,","sure,"],["das","that"],["war","was"],["ja","indeed"],["ganz","totally"],["einfach…","easy…"]]],
      ["Schön, dass du pünktlich bist.", "Nice that you are on time. (can be sincere or ironic)", [["Schön,","nice,"],["dass","that"],["du","you"],["pünktlich","on time"],["bist.","are."]]],
    ],
    [
      ["Das meinst du ernst?", "Do you mean that seriously?", [["Das","that"],["meinst","mean"],["du","you"],["ernst?","seriously?"]]],
      ["Wirklich? Interessant.", "Really? Interesting.", [["Wirklich?","Really?"],["Interessant.","Interesting."]]],
      ["Na ja…", "Well… / hmm…", [["Na","well"],["ja…","yes…"]]],
      ["Das freut mich aber.", "I’m so glad about that. (tone depends on voice)", [["Das","that"],["freut","pleases"],["mich","me"],["aber.","though."]]],
      ["Wie schön für dich.", "How nice for you.", [["Wie","how"],["schön","nice"],["für","for"],["dich.","you."]]],
      ["Sagen wir mal: es war herausfordernd.", "Let’s say: it was challenging.", [["Sagen","say"],["wir","we"],["mal:","once:"],["es","it"],["war","was"],["herausfordernd.","challenging."]]],
    ]
  ),
  precision: __learnTopic(
    "precision",
    "Precision",
    "Choose exact words and tighten meaning.",
    "Präzise formulieren",
    "Formulating precisely",
    [
      ["Nicht viele, sondern die meisten.", "Not many, but most.", [["Nicht","not"],["viele,","many,"],["sondern","but rather"],["die","the"],["meisten.","most."]]],
      ["Es geht nicht um Tempo, sondern um Genauigkeit.", "It is not about speed, but about accuracy.", [["Es","it"],["geht","goes"],["nicht","not"],["um","about"],["Tempo,","tempo,"],["sondern","but"],["um","about"],["Genauigkeit.","accuracy."]]],
    ],
    [
      ["Das entzieht sich einer einfachen Erklärung.", "That defies a simple explanation.", [["Das","that"],["entzieht","withdraws"],["sich","itself"],["einer","a"],["einfachen","simple"],["Erklärung.","explanation."]]],
      ["Ich meine konkret Folgendes.", "I mean concretely the following.", [["Ich","I"],["meine","mean"],["konkret","concretely"],["Folgendes.","the following."]]],
      ["Das ist ein Unterschied.", "That is a difference.", [["Das","that"],["ist","is"],["ein","a"],["Unterschied.","difference."]]],
      ["Mit anderen Worten…", "In other words…", [["Mit","with"],["anderen","other"],["Worten…","words…"]]],
      ["Das lässt Raum für Interpretation.", "That leaves room for interpretation.", [["Das","that"],["lässt","leaves"],["Raum","room"],["für","for"],["Interpretation.","interpretation."]]],
      ["Darauf kommt es letztlich an.", "That is what it ultimately comes down to.", [["Darauf","on that"],["kommt","comes"],["es","it"],["letztlich","ultimately"],["an.","(sep.)."]]],
    ]
  ),
});
