import { ChangeDetectionStrategy, Component, EventEmitter, InputSignal, OutputEmitterRef, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-modal',
  imports: [CommonModule],
  template: `
    @if (open()) {
      <div class="backdrop" (click)="onClose()"></div>
      <div class="modal" role="dialog" aria-modal="true" [attr.aria-label]="title() || 'Dialog'">
        <button class="close" type="button" (click)="onClose()" aria-label="Close">×</button>
        @if (title()) { <h2 class="title">{{ title() }}</h2> }
        <div class="content">
          <ng-content></ng-content>
          @if (message()) { <p>{{ message() }}</p> }
        </div>
        <div class="actions">
          <button class="primary" type="button" (click)="onClose()">OK</button>
        </div>
      </div>
    }
  `,
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  open: InputSignal<boolean> = input(false);
  title = input<string>('');
  message = input<string>('');
  close: OutputEmitterRef<void> = output<void>();

  protected onClose(): void {
    this.close.emit();
  }
}
