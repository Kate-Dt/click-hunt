import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OutputEmitterRef, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GameStatus } from '../../../../core/models/types';

@Component({
  selector: 'game-controls',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form class="controls" (submit)="onSubmit($event)">
      <label>
        Click time:
        <input
          type="text"
          inputmode="numeric"
          [attr.min]="min()"
          [attr.max]="max()"
          [formControl]="nCtrl"
          [disabled]="status() === 'running'"
          aria-describedby="n-help"
          (blur)="commit()"
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

  // Allow free typing; normalize on blur/submit
  readonly nCtrl = new FormControl<string>(String(800), { nonNullable: true });

  ngOnChanges(): void {
    // Keep the text control in sync when parent changes n()
    const view = String(this.n());
    if (this.nCtrl.value !== view) {
      this.nCtrl.setValue(view, { emitEvent: false });
    }
  }

  /** Normalize current input to a clamped integer or revert if invalid. */
  private normalize(): number {
    const raw = this.nCtrl.value.trim();
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) {
      const min = this.min(),
        max = this.max();
      const clamped = Math.max(min, Math.min(max, Math.round(parsed)));
      // reflect normalized value back to the input without bouncing events
      this.nCtrl.setValue(String(clamped), { emitEvent: false });
      // inform parent about the new N
      this.nChange.emit(clamped);
      return clamped;
    } else {
      // revert to last valid value from parent
      const fallback = this.n();
      this.nCtrl.setValue(String(fallback), { emitEvent: false });
      return fallback;
    }
  }

  /** Called on input blur */
  commit(): void {
    this.normalize();
  }

  /** Called on form submit (Start) */
  onSubmit(e: Event): void {
    e.preventDefault();
    const value = this.normalize();
    this.start.emit(value);
  }
}
