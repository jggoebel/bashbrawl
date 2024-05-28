import {
  Leaderboard,
  Score,
} from '../terminals/bashbrawl/bashbrawlterminal.component';

import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { extractResponseContent, APIClientFactory } from './api.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

@Injectable()
export class ScoreService {
  constructor(private gcf: APIClientFactory) {}
  private garg = this.gcf.scopedClient('/score');

  public getLeaderboard(language: string) {
    if (!language || language == '') {
      language = 'all';
    }

    if (this.isLocal()) {
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

    if (this.isLocal()) {
      // Store in local leaderboard

      // Get leaderboard
      // add score
      // Store leaderboard

      this.getLeaderboard(language).subscribe((l: Leaderboard) => {
        l.scores.push(score);

        const jsonLeaderboard = JSON.stringify(l);
        localStorage.setItem('leaderboard_' + language, jsonLeaderboard);
      });
    }

    // Set headers for JSON
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.garg.post('/add/' + language, score, { headers });
  }

  private isLocal() {
    console.log(environment.server);
    
    return (
      !environment.server ||
      environment.server == '' ||
      environment.server == 'local'
    );
  }
}
