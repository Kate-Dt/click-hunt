import { ChangeDetectionStrategy, Component, InputSignal, OutputEmitterRef, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { GameStatus } from '../../../../core/models/types';

@Component({
  selector: 'game-controls',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form class="controls" (submit)="onStart($event)">
      <label>
        N (ms):
        <input
          type="number"
          [attr.min]="min()"
          [attr.max]="max()"
          [formControl]="nCtrl"
          [disabled]="status() === 'running'"
          aria-describedby="n-help"
        />
      </label>
      <small id="n-help">{{ min() }}–{{ max() }} ms</small>

      <button type="submit" [disabled]="!canStart()">Start</button>
      <button type="button" (click)="reset.emit()" [disabled]="status() === 'idle'">Reset</button>
    </form>
  `,
  styleUrls: ['./controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsComponent {
  // inputs
  n = input.required<number>();
  canStart = input.required<boolean>();
  status = input.required<GameStatus>();
  min = input<number>(200);
  max = input<number>(3000);

  // outputs
  nChange: OutputEmitterRef<number> = output<number>();
  start: OutputEmitterRef<number> = output<number>();
  reset: OutputEmitterRef<void> = output<void>();

  // reactive form control (non-nullable)
  readonly nCtrl = new FormControl<number>(800, {
    nonNullable: true,
    validators: [Validators.required],
  });

  constructor() {
    // emit changes to parent
    this.nCtrl.valueChanges.subscribe((val) => {
      // guard value by min/max
      const min = this.min(), max = this.max();
      const clamped = Math.max(min, Math.min(max, Math.floor(val)));
      if (clamped !== val) this.nCtrl.setValue(clamped, { emitEvent: false });
      this.nChange.emit(clamped);
    });
  }

  // keep control in sync with input n()
  ngOnChanges(): void {
    const incoming = this.n();
    if (this.nCtrl.value !== incoming) {
      this.nCtrl.setValue(incoming, { emitEvent: false });
    }
  }

  protected onStart(e: Event): void {
    e.preventDefault();
    this.start.emit(this.nCtrl.value);
  }
}
