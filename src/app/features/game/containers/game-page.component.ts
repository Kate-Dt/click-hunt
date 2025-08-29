import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService, N_MAX, N_MIN } from '../../../core/services/game-engine.service';
import { GameBoardComponent } from '../components/game-board/game-board.component';
import { ControlsComponent } from '../components/controls/controls.component';
import { ScoreboardComponent } from '../components/scoreboard/scoreboard.component';
import { ModalComponent } from '../../../shared/ui/modal.component';

@Component({
  selector: 'game-page',
  imports: [CommonModule, GameBoardComponent, ControlsComponent, ScoreboardComponent, ModalComponent],
  templateUrl: 'game-page.component.html',
  styleUrls: ['game-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePageComponent {
  readonly engine = inject(GameEngineService);
  readonly N_MIN = N_MIN;
  readonly N_MAX = N_MAX;
}
