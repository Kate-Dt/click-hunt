import { ChangeDetectionStrategy, Component, EventEmitter, InputSignal, OutputEmitterRef, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Board } from '../../../../core/models/types';
import { GameCellComponent } from '../game-cell/game-cell.component';

@Component({
  selector: 'game-board',
  imports: [CommonModule, GameCellComponent],
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoardComponent {
  board: InputSignal<Board> = input.required<Board>();
  cellClick: OutputEmitterRef<number> = output<number>();

  protected trackById = (index: number, c: { id: number }) => c.id;
}
