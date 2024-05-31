import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { ScoreService } from '../services/score.service';
import { Leaderboard } from '../terminals/bashbrawl/bashbrawlterminal.component';

export class Cooldown {
  cooldown: string;
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: 'leaderboard.component.html',
  styleUrls: ['leaderboard.component.scss'],
})
export class LeaderboardComponent implements AfterViewInit {
  public leaderboard: Leaderboard;

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

  getScores() {
    return this.leaderboard?.scores ?? [];
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
