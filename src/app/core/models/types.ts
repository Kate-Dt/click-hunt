export type CellState = 'blue' | 'yellow' | 'green' | 'red';

export interface Cell {
  id: number;   // 0..99
  row: number;  // 0..9
  col: number;  // 0..9
  state: CellState;
}

export type Board = Cell[];

export interface Score {
  player: number;
  computer: number;
}

export type GameStatus = 'idle' | 'running' | 'finished';

export interface GameResult {
  winner: 'player' | 'computer';
  player: number;
  computer: number;
}
