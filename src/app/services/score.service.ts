import {
  Leaderboard,
  Score,
} from '../terminals/bashbrawl/bashbrawlterminal.component';

import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import {
  extractResponseContent,
  APIClientFactory,
  ScoreClient,
} from './api.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { utoa } from '../unicode';

@Injectable()
export class ScoreService {
  constructor(gcf: APIClientFactory) {
    this.garg = gcf.scopedClient(this.getServer(), '/score');
    this.validateHealth();
  }

  private garg: ScoreClient;
  private useLocal = true;

  public getLeaderboard(language: string) {
    if (!language || language == '') {
      language = 'all';
    }

    if (this.useLocal) {
      // Receive from leaderboard local storage

      let l = { language: language, scores: [] } as Leaderboard;
      const jsonLeaderboard =
        localStorage.getItem('leaderboard_' + language) ?? '';
      if (jsonLeaderboard && jsonLeaderboard != '') {
        l = JSON.parse(jsonLeaderboard);
      }

      return of(l);
    }

    return this.garg
      .get('/leaderboard/' + language)
      .pipe(map(extractResponseContent));
  }

  public setScoreForLanguage(language: string, score: Score) {
    if (!language || language == '') {
      language = 'all';
    }

    if (this.useLocal) {
      // Store in local leaderboard

      // Get leaderboard
      // add score
      // Store leaderboard

      this.getLeaderboard(language).subscribe((l: Leaderboard) => {
        l.scores.push(score);

        const jsonLeaderboard = JSON.stringify(l);
        localStorage.setItem('leaderboard_' + language, jsonLeaderboard);
      });
      return of(true);
    }

    // Set headers for JSON
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.garg.post('/add/' + language, score, { headers });
  }

  public scan(code: string) {
    if (this.useLocal) {
      // scanning in local environment does not make any sence.
      return of(true);
    }

    code = utoa(code);
    return this.garg
      .post('/scan/' + code, false)
      .pipe(map(extractResponseContent));
  }

  public validateHealth() {
    const server = this.getServer();
    if (!server || !server.startsWith('http')) {
      this.useLocal = true;
      return;
    }

    this.healthz().subscribe({
      next: () => {
        this.useLocal = false;
      },
      error: () => {
        this.useLocal = true;
        console.log(
          'Server ' + server + ' seems unhealthy, defaulting to local storage',
        );
      },
    });
  }

  private healthz() {
    return this.garg.get('/healthz');
  }

  private getServer() {
    return localStorage.getItem('score_server') ?? environment.server;
  }
}
