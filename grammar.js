/** @typedef {{ de: string, en: string }} Word */
/**
 * @typedef {{
 *   pattern: string,
 *   text: string,
 *   meaning: string,
 *   words: Word[]
 * }} GrammarExample
 */
/**
 * @typedef {{
 *   id: string,
 *   title: string,
 *   titleEn: string,
 *   tense: "present" | "past" | "future" | "mixed",
 *   description: string,
 *   tip: string,
 *   examples: GrammarExample[]
 * }} GrammarSection
 */

/** @type {GrammarSection[]} */
const GRAMMAR_SECTIONS = [
  {
    id: "present-basics",
    title: "Präsens",
    titleEn: "Present tense",
    tense: "present",
    description: "Talk about now, habits, and general truths.",
    tip: "In German, the present (Präsens) often covers both “I eat” and “I am eating”. Put the conjugated verb in second position.",
    examples: [
      {
        pattern: "Subject + verb + object",
        text: "Ich lerne Deutsch.",
        meaning: "I learn / am learning German.",
        words: [
          { de: "Ich", en: "I" },
          { de: "lerne", en: "learn / am learning" },
          { de: "Deutsch.", en: "German." },
        ],
      },
      {
        pattern: "Subject + verb + place",
        text: "Sie wohnt in Berlin.",
        meaning: "She lives in Berlin.",
        words: [
          { de: "Sie", en: "she" },
          { de: "wohnt", en: "lives" },
          { de: "in", en: "in" },
          { de: "Berlin.", en: "Berlin." },
        ],
      },
      {
        pattern: "Question with verb first",
        text: "Kommst du heute?",
        meaning: "Are you coming today?",
        words: [
          { de: "Kommst", en: "come" },
          { de: "du", en: "you" },
          { de: "heute?", en: "today?" },
        ],
      },
      {
        pattern: "Negation with nicht",
        text: "Wir verstehen das nicht.",
        meaning: "We do not understand that.",
        words: [
          { de: "Wir", en: "we" },
          { de: "verstehen", en: "understand" },
          { de: "das", en: "that" },
          { de: "nicht.", en: "not." },
        ],
      },
      {
        pattern: "Modal verb + infinitive at end",
        text: "Ich möchte Kaffee trinken.",
        meaning: "I would like to drink coffee.",
        words: [
          { de: "Ich", en: "I" },
          { de: "möchte", en: "would like" },
          { de: "Kaffee", en: "coffee" },
          { de: "trinken.", en: "to drink." },
        ],
      },
      {
        pattern: "Separable verb",
        text: "Er steht um sieben auf.",
        meaning: "He gets up at seven.",
        words: [
          { de: "Er", en: "he" },
          { de: "steht", en: "stands / gets" },
          { de: "um", en: "at" },
          { de: "sieben", en: "seven" },
          { de: "auf.", en: "up." },
        ],
      },
    ],
  },
  {
    id: "present-sein-haben",
    title: "sein & haben (Präsens)",
    titleEn: "Present: to be & to have",
    tense: "present",
    description: "The two most useful verbs for building basic sentences.",
    tip: "Memorize ich bin / du bist / er ist and ich habe / du hast / er hat — they appear everywhere.",
    examples: [
      {
        pattern: "sein + adjective",
        text: "Ich bin müde.",
        meaning: "I am tired.",
        words: [
          { de: "Ich", en: "I" },
          { de: "bin", en: "am" },
          { de: "müde.", en: "tired." },
        ],
      },
      {
        pattern: "sein + location",
        text: "Das Buch ist auf dem Tisch.",
        meaning: "The book is on the table.",
        words: [
          { de: "Das", en: "the (neut.)" },
          { de: "Buch", en: "book" },
          { de: "ist", en: "is" },
          { de: "auf", en: "on" },
          { de: "dem", en: "the" },
          { de: "Tisch.", en: "table." },
        ],
      },
      {
        pattern: "haben + noun",
        text: "Wir haben Zeit.",
        meaning: "We have time.",
        words: [
          { de: "Wir", en: "we" },
          { de: "haben", en: "have" },
          { de: "Zeit.", en: "time." },
        ],
      },
      {
        pattern: "haben + hunger/thirst",
        text: "Hast du Hunger?",
        meaning: "Are you hungry?",
        words: [
          { de: "Hast", en: "have" },
          { de: "du", en: "you" },
          { de: "Hunger?", en: "hunger?" },
        ],
      },
    ],
  },
  {
    id: "past-perfect",
    title: "Perfekt",
    titleEn: "Past tense (spoken past)",
    tense: "past",
    description: "The past tense Germans use most in everyday conversation.",
    tip: "Form: haben/sein (conjugated) + past participle at the end. Many verbs use ge-…-t (gemacht) or ge-…-en (gesehen).",
    examples: [
      {
        pattern: "haben + participle",
        text: "Ich habe Deutsch gelernt.",
        meaning: "I learned / have learned German.",
        words: [
          { de: "Ich", en: "I" },
          { de: "habe", en: "have" },
          { de: "Deutsch", en: "German" },
          { de: "gelernt.", en: "learned." },
        ],
      },
      {
        pattern: "haben + participle",
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
        pattern: "sein + motion participle",
        text: "Wir sind nach Hause gegangen.",
        meaning: "We went home.",
        words: [
          { de: "Wir", en: "we" },
          { de: "sind", en: "are / have (with motion)" },
          { de: "nach", en: "to" },
          { de: "Hause", en: "home" },
          { de: "gegangen.", en: "gone." },
        ],
      },
      {
        pattern: "sein + become/change",
        text: "Er ist Arzt geworden.",
        meaning: "He became a doctor.",
        words: [
          { de: "Er", en: "he" },
          { de: "ist", en: "is / has" },
          { de: "Arzt", en: "doctor" },
          { de: "geworden.", en: "become." },
        ],
      },
      {
        pattern: "Question in Perfekt",
        text: "Hast du das gesehen?",
        meaning: "Did you see that? / Have you seen that?",
        words: [
          { de: "Hast", en: "have" },
          { de: "du", en: "you" },
          { de: "das", en: "that" },
          { de: "gesehen?", en: "seen?" },
        ],
      },
      {
        pattern: "Negation in Perfekt",
        text: "Ich habe nichts gesagt.",
        meaning: "I said nothing. / I didn't say anything.",
        words: [
          { de: "Ich", en: "I" },
          { de: "habe", en: "have" },
          { de: "nichts", en: "nothing" },
          { de: "gesagt.", en: "said." },
        ],
      },
    ],
  },
  {
    id: "past-preterite",
    title: "Präteritum",
    titleEn: "Simple past (written past)",
    tense: "past",
    description: "Common in writing, stories, and with sein/haben/modals in speech.",
    tip: "For conversation, Perfekt is safer for most verbs. Learn Präteritum well for war, hatte, konnte, musste.",
    examples: [
      {
        pattern: "sein in the past",
        text: "Ich war gestern krank.",
        meaning: "I was sick yesterday.",
        words: [
          { de: "Ich", en: "I" },
          { de: "war", en: "was" },
          { de: "gestern", en: "yesterday" },
          { de: "krank.", en: "sick." },
        ],
      },
      {
        pattern: "haben in the past",
        text: "Wir hatten keine Zeit.",
        meaning: "We had no time.",
        words: [
          { de: "Wir", en: "we" },
          { de: "hatten", en: "had" },
          { de: "keine", en: "no" },
          { de: "Zeit.", en: "time." },
        ],
      },
      {
        pattern: "Modal in the past",
        text: "Er konnte nicht kommen.",
        meaning: "He could not come.",
        words: [
          { de: "Er", en: "he" },
          { de: "konnte", en: "could" },
          { de: "nicht", en: "not" },
          { de: "kommen.", en: "come." },
        ],
      },
      {
        pattern: "Story-style past",
        text: "Sie ging in den Park.",
        meaning: "She went to the park.",
        words: [
          { de: "Sie", en: "she" },
          { de: "ging", en: "went" },
          { de: "in", en: "into" },
          { de: "den", en: "the" },
          { de: "Park.", en: "park." },
        ],
      },
    ],
  },
  {
    id: "future",
    title: "Futur I",
    titleEn: "Future tense",
    tense: "future",
    description: "Talk about plans, predictions, and what will happen.",
    tip: "Form: werden (conjugated) + infinitive at the end. Germans also often use present + time word (Morgen gehe ich…) for near future.",
    examples: [
      {
        pattern: "werden + infinitive",
        text: "Ich werde Deutsch lernen.",
        meaning: "I will learn German.",
        words: [
          { de: "Ich", en: "I" },
          { de: "werde", en: "will" },
          { de: "Deutsch", en: "German" },
          { de: "lernen.", en: "learn." },
        ],
      },
      {
        pattern: "werden + infinitive",
        text: "Wir werden morgen ankommen.",
        meaning: "We will arrive tomorrow.",
        words: [
          { de: "Wir", en: "we" },
          { de: "werden", en: "will" },
          { de: "morgen", en: "tomorrow" },
          { de: "ankommen.", en: "arrive." },
        ],
      },
      {
        pattern: "Prediction",
        text: "Es wird Regen geben.",
        meaning: "There will be rain.",
        words: [
          { de: "Es", en: "it" },
          { de: "wird", en: "will" },
          { de: "Regen", en: "rain" },
          { de: "geben.", en: "give / be." },
        ],
      },
      {
        pattern: "Question in future",
        text: "Wirst du kommen?",
        meaning: "Will you come?",
        words: [
          { de: "Wirst", en: "will" },
          { de: "du", en: "you" },
          { de: "kommen?", en: "come?" },
        ],
      },
      {
        pattern: "Present used as future",
        text: "Morgen fahre ich nach München.",
        meaning: "Tomorrow I am going / will go to Munich.",
        words: [
          { de: "Morgen", en: "tomorrow" },
          { de: "fahre", en: "drive / go" },
          { de: "ich", en: "I" },
          { de: "nach", en: "to" },
          { de: "München.", en: "Munich." },
        ],
      },
      {
        pattern: "Intention",
        text: "Sie wird uns helfen.",
        meaning: "She will help us.",
        words: [
          { de: "Sie", en: "she" },
          { de: "wird", en: "will" },
          { de: "uns", en: "us" },
          { de: "helfen.", en: "help." },
        ],
      },
    ],
  },
  {
    id: "tense-compare",
    title: "Ein Satz, drei Zeiten",
    titleEn: "One idea across tenses",
    tense: "mixed",
    description: "See how the same meaning shifts from present to past to future.",
    tip: "Compare verb forms side by side: lerne → habe gelernt → werde lernen.",
    examples: [
      {
        pattern: "Present",
        text: "Ich lerne jeden Tag.",
        meaning: "I learn / study every day.",
        words: [
          { de: "Ich", en: "I" },
          { de: "lerne", en: "learn" },
          { de: "jeden", en: "every" },
          { de: "Tag.", en: "day." },
        ],
      },
      {
        pattern: "Past (Perfekt)",
        text: "Ich habe gestern gelernt.",
        meaning: "I studied yesterday.",
        words: [
          { de: "Ich", en: "I" },
          { de: "habe", en: "have" },
          { de: "gestern", en: "yesterday" },
          { de: "gelernt.", en: "studied / learned." },
        ],
      },
      {
        pattern: "Future",
        text: "Ich werde morgen lernen.",
        meaning: "I will study tomorrow.",
        words: [
          { de: "Ich", en: "I" },
          { de: "werde", en: "will" },
          { de: "morgen", en: "tomorrow" },
          { de: "lernen.", en: "study / learn." },
        ],
      },
      {
        pattern: "Present",
        text: "Sie geht zur Arbeit.",
        meaning: "She goes / is going to work.",
        words: [
          { de: "Sie", en: "she" },
          { de: "geht", en: "goes" },
          { de: "zur", en: "to the" },
          { de: "Arbeit.", en: "work." },
        ],
      },
      {
        pattern: "Past (Perfekt)",
        text: "Sie ist zur Arbeit gegangen.",
        meaning: "She went to work.",
        words: [
          { de: "Sie", en: "she" },
          { de: "ist", en: "has (with motion)" },
          { de: "zur", en: "to the" },
          { de: "Arbeit", en: "work" },
          { de: "gegangen.", en: "gone." },
        ],
      },
      {
        pattern: "Future",
        text: "Sie wird zur Arbeit gehen.",
        meaning: "She will go to work.",
        words: [
          { de: "Sie", en: "she" },
          { de: "wird", en: "will" },
          { de: "zur", en: "to the" },
          { de: "Arbeit", en: "work" },
          { de: "gehen.", en: "go." },
        ],
      },
    ],
  },
  {
    id: "sentence-building",
    title: "Satzbau",
    titleEn: "Sentence building",
    tense: "mixed",
    description: "Core word-order patterns for creating your own sentences.",
    tip: "Main clauses: conjugated verb in position 2. Yes/no questions: verb first. Subordinate clauses (weil…): verb goes to the end.",
    examples: [
      {
        pattern: "Time – Manner – Place",
        text: "Ich gehe heute mit Freunden ins Kino.",
        meaning: "I am going to the cinema with friends today.",
        words: [
          { de: "Ich", en: "I" },
          { de: "gehe", en: "go" },
          { de: "heute", en: "today" },
          { de: "mit", en: "with" },
          { de: "Freunden", en: "friends" },
          { de: "ins", en: "into the" },
          { de: "Kino.", en: "cinema." },
        ],
      },
      {
        pattern: "weil + verb at end",
        text: "Ich bleibe zu Hause, weil ich krank bin.",
        meaning: "I am staying home because I am sick.",
        words: [
          { de: "Ich", en: "I" },
          { de: "bleibe", en: "stay" },
          { de: "zu", en: "at" },
          { de: "Hause,", en: "home," },
          { de: "weil", en: "because" },
          { de: "ich", en: "I" },
          { de: "krank", en: "sick" },
          { de: "bin.", en: "am." },
        ],
      },
      {
        pattern: "Object pronoun",
        text: "Kannst du mir helfen?",
        meaning: "Can you help me?",
        words: [
          { de: "Kannst", en: "can" },
          { de: "du", en: "you" },
          { de: "mir", en: "me (dative)" },
          { de: "helfen?", en: "help?" },
        ],
      },
      {
        pattern: "Accusative object",
        text: "Ich kaufe einen Apfel.",
        meaning: "I buy / am buying an apple.",
        words: [
          { de: "Ich", en: "I" },
          { de: "kaufe", en: "buy" },
          { de: "einen", en: "an (masc. acc.)" },
          { de: "Apfel.", en: "apple." },
        ],
      },
    ],
  },
];
