import { Injectable } from '@angular/core';
import { Subject, concat, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { themes } from '../terminals/terminal-themes/themes';
import { APIClientFactory } from './api.service';

export interface Settings {
  terminal_theme: typeof themes[number]['id'];
  terminal_fontSize: number;
  divider_position: number;
}

@Injectable()
export class SettingsService {
  constructor(private gcf: APIClientFactory) {}

  private subject = new Subject<Readonly<Settings>>();
  readonly settings$ = concat(this.fetch(), this.subject).pipe(shareReplay(1));

  fetch() {
    return of({
      terminal_theme: themes[0].id,
      terminal_fontSize: 16,
      divider_position: 40,
    } as Settings);
  }
}
