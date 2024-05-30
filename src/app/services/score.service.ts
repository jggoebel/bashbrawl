import {
  Leaderboard,
  LeaderboardWithLocalPlacement,
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

      let l = { language: language, scores: [] } as Leaderboard;
      let jsonLeaderboard =
        localStorage.getItem('leaderboard_' + language) ?? '';
      if (jsonLeaderboard && jsonLeaderboard != '') {
        l = JSON.parse(jsonLeaderboard);
      }
      let localPlacementLeaderboard = this.findLocalScores(l, score);

      l.scores.push(score);

      // TODO calculate local placement

      jsonLeaderboard = JSON.stringify(l);
      localStorage.setItem('leaderboard_' + language, jsonLeaderboard);

      return of(localPlacementLeaderboard);
    }

    // Set headers for JSON
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.garg
      .post('/add/' + language, score, { headers })
      .pipe(map(extractResponseContent));
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

  private findLocalScores(leaderboard: Leaderboard, newScore: Score) {
    // Create a deep copy of the scores and add the new score for sorting and placement
    const scores = [...leaderboard.scores];

    // Sort the scores array by score in descending order
    scores.sort((a, b) => b.score - a.score);

    // Determine the placement (number of scores greater than the current score)
    const placement =
      scores.filter((s) => s.score >= newScore.score).length - 1;

    // Create an array to hold local scores
    let localScores: Score[] = [];

    // Get two scores above the new score (if available)
    if (placement >= 10) {
      localScores = localScores.concat(
        scores.slice((Math.max(10, placement - 2), placement - 1)),
      );
      localScores = localScores.concat(
        scores.slice(placement + 1, Math.min(scores.length, placement + 1)),
      );
    }

    // Return the updated leaderboard object with localScores and placement
    return {
      language: leaderboard.language,
      scores: scores,
      localscores: localScores,
      placement: placement,
    } as LeaderboardWithLocalPlacement;
  }
}
