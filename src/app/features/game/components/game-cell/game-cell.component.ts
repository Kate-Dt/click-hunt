import { ChangeDetectionStrategy, Component, InputSignal, OutputEmitterRef, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellState } from '../../../../core/models/types';

@Component({
  selector: 'game-cell',
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="cell"
      [class.is-blue]="state() === 'blue'"
      [class.is-yellow]="state() === 'yellow'"
      [class.is-green]="state() === 'green'"
      [class.is-red]="state() === 'red'"
      role="button"
      [attr.aria-pressed]="state() === 'yellow'"
      (click)="clicked.emit()"
      (keyup.enter)="clicked.emit()"
      (keyup.space)="clicked.emit()"
      tabindex="0"
    ></button>
  `,
  styleUrls: ['./game-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCellComponent {
  state: InputSignal<CellState> = input.required<CellState>();
  clicked: OutputEmitterRef<void> = output<void>();
}
