import { ChangeDetectionStrategy, Component, InputSignal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Score } from '../../../../core/models/types';

@Component({
  selector: 'scoreboard',
  imports: [CommonModule],
  template: `
    <div class="score" aria-live="polite">
      <span class="you">You: <strong>{{ score().player }}</strong></span>
      <span class="sep">/</span>
      <span class="cpu">Computer: <strong>{{ score().computer }}</strong></span>
    </div>
  `,
  styleUrls: ['./scoreboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreboardComponent {
  score: InputSignal<Score> = input.required<Score>();
}
