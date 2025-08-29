import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'game' },
  {
    path: 'game',
    loadComponent: () =>
      import('./features/game/containers/game-page.component')
        .then(m => m.GamePageComponent),
  },
  { path: '**', redirectTo: 'game' },
];
