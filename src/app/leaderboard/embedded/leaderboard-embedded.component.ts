import { AfterViewInit, Component, Input, OnChanges } from '@angular/core';
import { ScoreService } from '../../services/score.service';
import {
  Leaderboard,
  LeaderboardWithLocalPlacement,
  Score,
} from '../../terminals/bashbrawl/bashbrawlterminal.component';

export class Cooldown {
  cooldown: string;
}

@Component({
  selector: 'app-leaderboard-embdedded',
  templateUrl: 'leaderboard-embedded.component.html',
  styleUrls: ['leaderboard-embedded.component.scss'],
})
export class EmbeddedLeaderboardComponent implements AfterViewInit, OnChanges {
  public leaderboard: Leaderboard;
  public leaderboardWithLocalPlacement: LeaderboardWithLocalPlacement;

  @Input()
  onlyTop = 10;

  @Input()
  embedded = false;

  @Input()
  advanced = false;

  @Input()
  showLocalScores: boolean;

  @Input()
  score: Score;

  @Input()
  leaderboardWithLocalPlacementInput: LeaderboardWithLocalPlacement;

  constructor(private scoreService: ScoreService) {}

  ngAfterViewInit(): void {
    this.scoreService.healthSubject.subscribe((ready: boolean) => {
      if (!ready) {
        return;
      }
      this.scoreService.getLeaderboard('all').subscribe((l) => {
        this.leaderboard = l;
      });
    });
  }

  ngOnChanges() {
    if (this.leaderboardWithLocalPlacementInput && this.score) {
      this.leaderboardWithLocalPlacement = structuredClone(
        this.leaderboardWithLocalPlacementInput,
      );
      if (this.leaderboardWithLocalPlacement.placement < 10) {
        this.onlyTop = this.showLocalScores ? 10 : 5;
        this.leaderboardWithLocalPlacement.scores.push(this.score);
        this.leaderboardWithLocalPlacement.scores =
          this.leaderboardWithLocalPlacement.scores.sort(
            (a, b) => b.score - a.score,
          );
      } else {
        this.leaderboardWithLocalPlacement.localscores.push(this.score);
        this.leaderboardWithLocalPlacement.localscores =
          this.leaderboardWithLocalPlacement.localscores.sort(
            (a, b) => b.score - a.score,
          );
      }

      this.leaderboard = {
        scores: this.leaderboardWithLocalPlacement.scores,
        language: this.leaderboardWithLocalPlacement.language,
      } as Leaderboard;
    }
  }

  getScores() {
    return this.leaderboard?.scores.slice(0, 10) ?? [];
  }

  hasLocalScores() {
    if (!this.showLocalScores) {
      return false;
    }
    return this.leaderboardWithLocalPlacement?.localscores.length > 0;
  }

  getLocalScores() {
    return this.hasLocalScores()
      ? this.leaderboardWithLocalPlacement.localscores
      : [];
  }

  getScoreIndex() {
    if (
      !this.leaderboardWithLocalPlacement ||
      this.leaderboardWithLocalPlacement.placement >= 10
    ) {
      return -1;
    }

    return this.leaderboardWithLocalPlacement.placement;
  }

  getLocalScoreIndex() {
    if (this.leaderboardWithLocalPlacement.placement < 10) {
      return -1;
    }

    const scoreIndex = this.leaderboardWithLocalPlacement.localscores.findIndex(
      (localScore) =>
        this.score.name === localScore.name &&
        this.score.score === localScore.score,
    );

    return scoreIndex;
  }

  getCodeBase64(code: string) {
    return btoa(code);
  }

  getUrl(code: string) {
    return (
      this.scoreService.getServer() +
      '/score/qrcode/' +
      this.getCodeBase64(code)
    );
  }
}
