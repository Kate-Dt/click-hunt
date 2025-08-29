import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RandomService {
  index(maxExclusive: number): number {
    return Math.floor(Math.random() * maxExclusive);
  }
}
