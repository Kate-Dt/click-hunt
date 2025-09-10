import { Injectable, Signal, computed, inject, signal, WritableSignal } from '@angular/core';
import { Board, Cell, GameResult, GameStatus, Score } from '../models/types';
import { RandomService } from './random.service';

const BOARD_SIZE = 10;
const WIN_SCORE = 10;
export const N_MIN = 200;
export const N_MAX = 3000;

@Injectable({ providedIn: 'root' })
export class GameEngineService {
  private readonly rng = inject(RandomService);

  // state
  readonly board: WritableSignal<Board> = signal<Board>(this.createBoard());
  readonly score: WritableSignal<Score> = signal<Score>({ player: 0, computer: 0 });
  readonly status: WritableSignal<GameStatus> = signal<GameStatus>('idle');
  readonly nMs: WritableSignal<number> = signal<number>(800);
  readonly targetId: WritableSignal<number | null> = signal<number | null>(null);
  // successful clicks reaction count
  private totalReactionMsAcc = 0;
  private bestReactionMsAcc = Infinity;
  private worstReactionMsAcc = 0;
  // round timing
  private roundStartedAt: number | null = null;
  readonly canStart: Signal<boolean> = computed(
    () => this.status() !== 'running' && this.nMs() >= N_MIN && this.nMs() <= N_MAX
  );

  private roundTimer: ReturnType<typeof setTimeout> | null = null;

  setN(n: number): void {
    const clamped = Math.max(N_MIN, Math.min(N_MAX, Math.floor(n)));
    this.nMs.set(clamped);
  }

  start(n?: number): void {
    if (typeof n === 'number') this.setN(n);
    if (!this.canStart()) return;
    this.resetBoardAndScores();
    this.status.set('running');
    this.nextRound();
  }

  reset(): void {
    this.clearTimer();
    this.resetBoardAndScores();
    this.status.set('idle');
    this.targetId.set(null);
    this.totalReactionMsAcc = 0;
    this.bestReactionMsAcc = Infinity;
    this.worstReactionMsAcc = 0;
    this.roundStartedAt = null;
  }

  handleCellClick(cellId: number): void {
    if (this.status() !== 'running') return;
    const current = this.targetId();
    if (current == null || current !== cellId) return;

    if (this.roundStartedAt != null) {
      const delta = performance.now() - this.roundStartedAt;
      this.totalReactionMsAcc += delta;
      this.bestReactionMsAcc = Math.min(this.bestReactionMsAcc, delta);
      this.worstReactionMsAcc = Math.max(this.worstReactionMsAcc, delta);
      this.roundStartedAt = null;
    }

    this.clearTimer();
    this.paint(cellId, 'green');
    this.bumpScore('player');
    if (this.checkFinish()) return;

    setTimeout(() => this.nextRound(), 120);
  }

  getResult(): GameResult | null {
    if (this.status() !== 'finished') return null;
    const { player, computer } = this.score();
    return {
      winner: player > computer ? 'player' : 'computer',
      player,
      computer,
    };
  }

  private nextRound(): void {
    // choose among blue cells only
    const candidates = this.board().filter((c) => c.state === 'blue');
    if (candidates.length === 0) {
      this.finishByScore();
      return;
    }
    const picked = candidates[this.rng.index(candidates.length)];
    this.paint(picked.id, 'yellow');
    this.targetId.set(picked.id);

    this.roundStartedAt = performance.now();

    this.roundTimer = setTimeout(() => {
      const cur = this.targetId();
      if (cur != null) {
        this.paint(cur, 'red');
        this.bumpScore('computer');
        this.targetId.set(null);
        this.roundStartedAt = null;
        if (this.checkFinish()) return;
        setTimeout(() => this.nextRound(), 120);
      }
    }, this.nMs());
  }

  private checkFinish(): boolean {
    const s = this.score();
    if (s.player >= WIN_SCORE || s.computer >= WIN_SCORE) {
      this.finishByScore();
      return true;
    }
    return false;
  }

  private finishByScore(): void {
    this.clearTimer();
    this.status.set('finished');
    this.targetId.set(null);
    this.roundStartedAt = null;
  }

  private bumpScore(who: 'player' | 'computer'): void {
    this.score.update((s) =>
      who === 'player' ? { ...s, player: s.player + 1 } : { ...s, computer: s.computer + 1 }
    );
  }

  private paint(id: number, state: Cell['state']): void {
    this.board.update((b) => b.map((c) => (c.id === id ? { ...c, state } : c)));
    if (state !== 'yellow') this.targetId.set(null);
  }

  private createBoard(): Board {
    const list: Board = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const id = row * BOARD_SIZE + col;
        list.push({ id, row, col, state: 'blue' });
      }
    }
    return list;
  }

  private resetBoardAndScores(): void {
    this.board.set(this.createBoard());
    this.score.set({ player: 0, computer: 0 });
  }

  private clearTimer(): void {
    if (this.roundTimer) {
      clearTimeout(this.roundTimer);
      this.roundTimer = null;
    }
  }

  getStats(): {
    avgReactionMs: number | null;
    bestReactionMs: number | null;
    worstReactionMs: number | null;
  } {
    const hits = this.score().player;
    if (hits <= 0) {
      return { avgReactionMs: null, bestReactionMs: null, worstReactionMs: null };
    }
    const avg = Math.round(this.totalReactionMsAcc / hits);
    const best = Math.round(this.bestReactionMsAcc);
    const worst = Math.round(this.worstReactionMsAcc);
    return {
      avgReactionMs: avg,
      bestReactionMs: Number.isFinite(best) ? best : null,
      worstReactionMs: worst,
    };
  }
}
