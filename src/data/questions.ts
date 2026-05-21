import { WorldId, Question } from '../types';

interface WordProblemTemplate {
  text: string;
  answer: number;
  operation: 'multiplication' | 'division' | 'addition' | 'subtraction';
  tier: number;
}

const WORD_PROBLEMS: Record<WorldId, WordProblemTemplate[]> = {
  beauty: [
    { text: 'Η Μαρία βάφει 4 νύχια σε κάθε χέρι. Έχει 2 χέρια. Πόσα νύχια έβαψε;', answer: 8, operation: 'multiplication', tier: 1 },
    { text: 'Έχεις 18 κοκαλάκια και θέλεις να τα μοιράσεις σε 3 φίλες. Πόσα παίρνει η κάθε μία;', answer: 6, operation: 'division', tier: 2 },
    { text: 'Χρειάζεσαι 7 πετράδια για κάθε βραχιόλι. Φτιάχνεις 6 βραχιόλια. Πόσα πετράδια;', answer: 42, operation: 'multiplication', tier: 3 },
    { text: 'Έχεις 5 χρώματα βερνίκι και βάφεις 8 νύχια με κάθε χρώμα. Πόσα νύχια συνολικά;', answer: 40, operation: 'multiplication', tier: 3 },
    { text: 'Μοιράζεις 24 λουλούδια σε 6 ανθοδέσμες. Πόσα λουλούδια η κάθε μία;', answer: 4, operation: 'division', tier: 3 },
    { text: 'Κάθε βραχιόλι θέλει 9 χάντρες. Φτιάχνεις 4 βραχιόλια. Πόσες χάντρες;', answer: 36, operation: 'multiplication', tier: 4 },
    { text: 'Έχεις 36 κλιπ μαλλιών σε 4 κουτιά. Πόσα σε κάθε κουτί;', answer: 9, operation: 'division', tier: 4 },
  ],
  dance: [
    { text: 'Η χορογραφία έχει 8 βήματα. Τη χορεύεις 3 φορές. Πόσα βήματα;', answer: 24, operation: 'multiplication', tier: 2 },
    { text: '24 χορευτές χωρίζονται σε 4 ομάδες. Πόσοι σε κάθε ομάδα;', answer: 6, operation: 'division', tier: 2 },
    { text: 'Κάθε τραγούδι έχει 5 αλλαγές χορού. Χόρεψες 9 τραγούδια. Πόσες αλλαγές;', answer: 45, operation: 'multiplication', tier: 4 },
    { text: 'Η σκηνή έχει 7 σειρές με 6 χορευτές. Πόσοι χορευτές;', answer: 42, operation: 'multiplication', tier: 3 },
    { text: 'Πρόβα 48 λεπτών σε 8 τραγούδια. Πόσα λεπτά ανά τραγούδι;', answer: 6, operation: 'division', tier: 3 },
    { text: 'Κάνεις 12 στροφές σε κάθε τραγούδι. Χόρεψες 3 τραγούδια. Πόσες στροφές;', answer: 36, operation: 'multiplication', tier: 2 },
    { text: '56 χορεύτριες σε 7 γραμμές. Πόσες σε κάθε γραμμή;', answer: 8, operation: 'division', tier: 3 },
  ],
  singing: [
    { text: 'Κάθε στροφή έχει 4 στίχους. 6 στροφές. Πόσοι στίχοι;', answer: 24, operation: 'multiplication', tier: 2 },
    { text: '36 τραγούδια σε 6 μέρες. Πόσα την ημέρα;', answer: 6, operation: 'division', tier: 3 },
    { text: '3 χορωδίες με 12 παιδιά η κάθε μία. Πόσα παιδιά τραγουδάνε;', answer: 36, operation: 'multiplication', tier: 4 },
    { text: 'Κάθε μάθημα φωνητικής κρατάει 9 λεπτά. 4 μαθήματα. Πόσα λεπτά;', answer: 36, operation: 'multiplication', tier: 4 },
    { text: '56 νότες σε 7 γραμμές. Πόσες νότες ανά γραμμή;', answer: 8, operation: 'division', tier: 3 },
    { text: 'Τραγουδάς 5 τραγούδια με 10 στίχους το καθένα. Πόσοι στίχοι;', answer: 50, operation: 'multiplication', tier: 1 },
    { text: '45 δευτερόλεπτα μοιρασμένα σε 5 στροφές. Πόσα ανά στροφή;', answer: 9, operation: 'division', tier: 4 },
  ],
  chocolate: [
    { text: 'Η σοκολάτα έχει 4 σειρές με 6 κομμάτια. Πόσα κομμάτια συνολικά;', answer: 24, operation: 'multiplication', tier: 2 },
    { text: 'Μοιράζεις 36 σοκολατάκια σε 9 φίλες. Πόσα παίρνει η κάθε μία;', answer: 4, operation: 'division', tier: 4 },
    { text: 'Κάθε κουτί έχει 8 τρούφες. Αγόρασες 7 κουτιά. Πόσες τρούφες;', answer: 56, operation: 'multiplication', tier: 3 },
    { text: 'Φτιάχνεις 5 πιάτα με 12 μπισκότα σοκολάτας το καθένα. Πόσα μπισκότα;', answer: 60, operation: 'multiplication', tier: 4 },
    { text: 'Έχεις 48 σοκολατένιες καρδιές σε 6 σακουλάκια. Πόσες σε κάθε σακουλάκι;', answer: 8, operation: 'division', tier: 3 },
    { text: 'Η τούρτα θέλει 3 στρώσεις σοκολάτας. Κάθε στρώση θέλει 9 κομμάτια. Πόσα κομμάτια;', answer: 27, operation: 'multiplication', tier: 4 },
    { text: 'Μοιράζεις 42 πραλίνες σε 7 κουτάκια δώρου. Πόσες σε κάθε κουτάκι;', answer: 6, operation: 'division', tier: 3 },
  ],
  parrots: [
    { text: 'Κάθε παπαγάλος τρώει 6 σπόρους την ώρα. Έχεις 4 παπαγάλους. Πόσοι σπόροι;', answer: 24, operation: 'multiplication', tier: 2 },
    { text: 'Στο pet shop υπάρχουν 35 παπαγάλοι σε 5 κλουβιά. Πόσοι σε κάθε κλουβί;', answer: 7, operation: 'division', tier: 1 },
    { text: 'Ο παπαγάλος λέει 8 λέξεις. Τις επαναλαμβάνει 3 φορές. Πόσες λέξεις ακούς;', answer: 24, operation: 'multiplication', tier: 2 },
    { text: 'Αγόρασες 7 παιχνίδια για κάθε παπαγάλο. Έχεις 3 παπαγάλους. Πόσα παιχνίδια;', answer: 21, operation: 'multiplication', tier: 2 },
    { text: 'Υπάρχουν 54 φτερά στο πάτωμα. 6 παπαγάλοι τα έριξαν εξίσου. Πόσα ο καθένας;', answer: 9, operation: 'division', tier: 3 },
    { text: 'Κάθε παπαγάλος κάνει 11 ακροβατικά. Βλέπεις 4 παπαγάλους. Πόσα ακροβατικά;', answer: 44, operation: 'multiplication', tier: 4 },
    { text: 'Μοιράζεις 72 σπόρους ηλίανθου σε 8 παπαγάλους. Πόσοι ο καθένας;', answer: 9, operation: 'division', tier: 3 },
  ],
  aek: [
    { text: 'Η ΑΕΚ βάζει 3 γκολ σε κάθε αγώνα. Παίζει 8 αγώνες. Πόσα γκολ;', answer: 24, operation: 'multiplication', tier: 2 },
    { text: 'Στο γήπεδο υπάρχουν 44 παίκτες σε 4 ομάδες. Πόσοι σε κάθε ομάδα;', answer: 11, operation: 'division', tier: 4 },
    { text: 'Κάθε παίκτης κάνει 6 πάσες ανά λεπτό. Πόσες πάσες σε 7 λεπτά;', answer: 42, operation: 'multiplication', tier: 3 },
    { text: 'Η ΑΕΚ έχει 12 αμυντικούς ασκήσεις. Κάνουν 3 σετ. Πόσες ασκήσεις συνολικά;', answer: 36, operation: 'multiplication', tier: 4 },
    { text: 'Μοιράζονται 63 μπάλες σε 9 γήπεδα. Πόσες σε κάθε γήπεδο;', answer: 7, operation: 'division', tier: 4 },
    { text: 'Κάθε ημίχρονο έχει 45 λεπτά. Πόσα λεπτά σε 2 ημίχρονα;', answer: 90, operation: 'multiplication', tier: 4 },
    { text: 'Η ομάδα κέρδισε 5 αγώνες. Κάθε νίκη = 3 βαθμοί. Πόσοι βαθμοί;', answer: 15, operation: 'multiplication', tier: 2 },
    { text: 'Υπάρχουν 56 φίλαθλοι σε 8 σειρές κερκίδας. Πόσοι ανά σειρά;', answer: 7, operation: 'division', tier: 3 },
  ],
  coffee: [
    { text: 'Κάθε τραπέζι έχει 4 καρέκλες. Υπάρχουν 9 τραπέζια. Πόσες καρέκλες;', answer: 36, operation: 'multiplication', tier: 4 },
    { text: 'Παρήγγειλαν 48 κρουασάν για 6 τραπέζια. Πόσα ανά τραπέζι;', answer: 8, operation: 'division', tier: 3 },
    { text: 'Φτιάχνεις 7 φραπέδες. Κάθε φραπές θέλει 3 κουταλιές ζάχαρη. Πόσες κουταλιές;', answer: 21, operation: 'multiplication', tier: 2 },
    { text: 'Η καφετέρια πουλάει 11 γλυκά την ώρα. Σε 5 ώρες πόσα γλυκά;', answer: 55, operation: 'multiplication', tier: 4 },
    { text: 'Μοιράζεις 36 ζαχαρωτά σε 4 βαζάκια. Πόσα σε κάθε βαζάκι;', answer: 9, operation: 'division', tier: 2 },
    { text: 'Κάθε smoothie θέλει 8 φράουλες. Φτιάχνεις 6 smoothies. Πόσες φράουλες;', answer: 48, operation: 'multiplication', tier: 3 },
    { text: 'Η βιτρίνα έχει 3 ράφια με 12 κέικ στο καθένα. Πόσα κέικ;', answer: 36, operation: 'multiplication', tier: 4 },
    { text: 'Παραγγέλνουν 72 μπαλόνια για πάρτι σε 9 τραπέζια. Πόσα ανά τραπέζι;', answer: 8, operation: 'division', tier: 4 },
  ],
  eurovision: [
    { text: 'Η Ελλάδα πήρε 12 βαθμούς από 5 χώρες. Πόσοι βαθμοί συνολικά;', answer: 60, operation: 'multiplication', tier: 2 },
    { text: 'Κάθε χώρα δίνει 10 βαθμούς. 8 χώρες ψήφισαν. Πόσοι βαθμοί;', answer: 80, operation: 'multiplication', tier: 2 },
    { text: 'Η Nemo πήρε 72 βαθμούς από 6 κριτές. Πόσοι ανά κριτή;', answer: 12, operation: 'division', tier: 3 },
    { text: 'Το televote έδωσε 4 φορές 12 βαθμούς. Πόσοι βαθμοί;', answer: 48, operation: 'multiplication', tier: 3 },
    { text: 'Η Marina Satti πήρε 54 βαθμούς από 9 χώρες. Πόσοι ανά χώρα;', answer: 6, operation: 'division', tier: 3 },
    { text: 'Η κριτική επιτροπή έδωσε 7 βαθμούς από 8 χώρες. Πόσοι συνολικά;', answer: 56, operation: 'multiplication', tier: 3 },
    { text: 'Η Ελβετία πήρε 365 βαθμούς και η Κροατία 287. Πόση η διαφορά;', answer: 78, operation: 'subtraction', tier: 4 },
    { text: 'Η κριτική επιτροπή έδωσε 150 βαθμούς και το televote 215. Πόσοι συνολικά;', answer: 365, operation: 'addition', tier: 4 },
    { text: 'Η Ελλάδα πήρε 126 βαθμούς. Η 10η χώρα πήρε 152. Πόση η διαφορά;', answer: 26, operation: 'subtraction', tier: 3 },
    { text: 'Κάθε τραγούδι διαρκεί 3 λεπτά. Ακούς 8 τραγούδια. Πόσα λεπτά;', answer: 24, operation: 'multiplication', tier: 2 },
    { text: 'Η πρόβα έχει 6 τραγούδια × 4 λεπτά. Πόσα λεπτά συνολικά;', answer: 24, operation: 'multiplication', tier: 2 },
    { text: 'Ο τελικός έχει 26 τραγούδια × 3 λεπτά. Πόσα λεπτά;', answer: 78, operation: 'multiplication', tier: 4 },
    { text: 'Η Ελλάδα τραγούδησε 3 λεπτά. Η πρόβα ήταν 5 φορές. Πόσα λεπτά πρόβας;', answer: 15, operation: 'multiplication', tier: 2 },
    { text: 'Η ψηφοφορία διαρκεί 4 γύρους × 12 λεπτά. Πόσα λεπτά;', answer: 48, operation: 'multiplication', tier: 3 },
    { text: 'Ψήφισαν 36 χώρες σε 6 γκρουπ. Πόσες χώρες ανά γκρουπ;', answer: 6, operation: 'division', tier: 3 },
    { text: 'Κάθε ημιτελικός έχει 9 λεπτά διαφήμιση × 4 διαλείμματα. Πόσα λεπτά;', answer: 36, operation: 'multiplication', tier: 4 },
    { text: 'Στον τελικό ψήφισαν 120 εκατομμύρια. Μοιράστηκαν σε 6 ζώνες. Πόσα ανά ζώνη;', answer: 20, operation: 'division', tier: 4 },
  ],
};

function generateDistractors(correct: number): number[] {
  const distractors = new Set<number>();
  const spread = Math.max(3, Math.ceil(correct * 0.15));

  const candidates = [
    correct + 1,
    correct - 1,
    correct + spread,
    correct - spread,
    correct + Math.ceil(spread * 1.5),
    correct - Math.ceil(spread * 0.7),
    correct * 2,
    Math.floor(correct / 2),
    correct + 10,
  ];

  for (const c of candidates) {
    if (c > 0 && c !== correct) {
      distractors.add(c);
    }
    if (distractors.size >= 3) break;
  }

  while (distractors.size < 3) {
    const range = Math.max(5, Math.ceil(correct * 0.2));
    const rand = correct + Math.floor(Math.random() * range * 2) - range;
    if (rand > 0 && rand !== correct) {
      distractors.add(rand);
    }
  }

  return Array.from(distractors).slice(0, 3);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface TierConfig {
  multiplyBy: number[];
  divideBy: number[];
}

const TIER_CONFIGS: Record<number, TierConfig> = {
  1: { multiplyBy: [1, 2, 5, 10], divideBy: [2, 5] },
  2: { multiplyBy: [3, 4], divideBy: [3, 4] },
  3: { multiplyBy: [6, 7, 8], divideBy: [6, 7, 8] },
  4: { multiplyBy: [9, 11, 12], divideBy: [9, 11, 12] },
  5: { multiplyBy: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], divideBy: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
};

function generatePlainQuestion(tier: number): Question {
  const config = TIER_CONFIGS[tier] || TIER_CONFIGS[5];
  const isMultiplication = Math.random() > 0.4;

  let answer: number;
  let text: string;
  const operation = isMultiplication ? 'multiplication' : 'division';

  if (isMultiplication) {
    const factor = config.multiplyBy[Math.floor(Math.random() * config.multiplyBy.length)];
    const other = Math.floor(Math.random() * 10) + 2;
    answer = factor * other;
    text = `${factor} × ${other} = ;`;
  } else {
    const divisor = config.divideBy[Math.floor(Math.random() * config.divideBy.length)];
    const quotient = Math.floor(Math.random() * 10) + 2;
    const dividend = divisor * quotient;
    answer = quotient;
    text = `${dividend} ÷ ${divisor} = ;`;
  }

  const distractors = generateDistractors(answer);
  const options = shuffleArray([answer, ...distractors]);

  return { text, correctAnswer: answer, options, operation, tier };
}

export function generateQuestions(worldId: WorldId, tier: number, count: number = 10): Question[] {
  const worldProblems = WORD_PROBLEMS[worldId].filter(p => p.tier <= tier);
  const questions: Question[] = [];

  const wordProblemCount = Math.min(Math.floor(count * 0.4), worldProblems.length);
  const selectedWordProblems = shuffleArray(worldProblems).slice(0, wordProblemCount);

  for (const wp of selectedWordProblems) {
    const distractors = generateDistractors(wp.answer);
    const options = shuffleArray([wp.answer, ...distractors]);
    questions.push({
      text: wp.text,
      correctAnswer: wp.answer,
      options,
      operation: wp.operation,
      tier: wp.tier,
    });
  }

  while (questions.length < count) {
    questions.push(generatePlainQuestion(tier));
  }

  return shuffleArray(questions);
}
