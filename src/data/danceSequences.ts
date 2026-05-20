import { DanceSequence, DanceMove } from '../types';

const ALL_MOVES: DanceMove[] = ['spin', 'jump', 'clap', 'kick', 'wave'];

function generateSequence(
  length: number,
  targetMove: DanceMove,
  targetCount: number,
  speed: number,
  multiplier?: number
): DanceSequence {
  const moves: DanceMove[] = [];
  let targetPlaced = 0;

  for (let i = 0; i < length; i++) {
    if (targetPlaced < targetCount && (Math.random() > 0.5 || length - i <= targetCount - targetPlaced)) {
      moves.push(targetMove);
      targetPlaced++;
    } else {
      const otherMoves = ALL_MOVES.filter(m => m !== targetMove);
      moves.push(otherMoves[Math.floor(Math.random() * otherMoves.length)]);
    }
  }

  return { moves, targetMove, speed, correctCount: targetCount, multiplier };
}

export const DANCE_SEQUENCES = {
  easy: [
    generateSequence(6, 'jump', 3, 1200),
    generateSequence(6, 'spin', 2, 1200),
    generateSequence(7, 'clap', 4, 1100),
    generateSequence(5, 'kick', 2, 1200),
  ],
  medium: [
    generateSequence(8, 'spin', 3, 900),
    generateSequence(9, 'jump', 4, 900),
    generateSequence(8, 'wave', 3, 900),
    generateSequence(10, 'clap', 5, 850),
  ],
  hard: [
    generateSequence(10, 'spin', 4, 700, 2),
    generateSequence(12, 'kick', 3, 700, 3),
    generateSequence(10, 'jump', 5, 650, 2),
    generateSequence(12, 'wave', 4, 650, 3),
  ],
};

export const MOVE_LABELS: Record<DanceMove, string> = {
  spin: 'περιστροφές',
  jump: 'αναπηδήσεις',
  clap: 'χειροκροτήματα',
  kick: 'κλωτσιές',
  wave: 'κυματισμούς',
};
