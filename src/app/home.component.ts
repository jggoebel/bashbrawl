import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  BashbrawlterminalComponent,
  GameFinished,
  LeaderboardWithLocalPlacement,
  Score,
} from './terminals/bashbrawl/bashbrawlterminal.component';
import { LanguageCommandService } from './terminals/bashbrawl/languages/language-command.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ScoreService } from './services/score.service';
import { HttpErrorResponse } from '@angular/common/http';
import { extractResponseContent } from './services/api.service';

export class Cooldown {
  cooldown: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
  animations: [
    trigger('terminalAnimation', [
      state(
        'hidden',
        style({
          width: '10vw',
          minWidth: '0',
          height: '10vh',
          opacity: 0,
        }),
      ),
      state(
        'small',
        style({
          width: '30vw',
          height: '30vh',
        }),
      ),
      state(
        'large',
        style({
          width: '50vw',
          height: '50vh',
        }),
      ),
      transition('small <=> large', animate('1000ms ease-in-out')),
      transition('small <=> hidden', animate('1000ms ease-in-out')),
    ]),
    trigger('shrinkAnimation', [
      state(
        'normal',
        style({
          opacity: 1,
          maxHeight: '35vh',
        }),
      ),
      state(
        'shrunk',
        style({
          opacity: 0,
          maxHeight: '0vh',
        }),
      ),
      state(
        'hidden',
        style({
          opacity: 0,
          maxHeight: '0vh',
        }),
      ),
      transition('normal <=> shrunk', animate('1000ms ease-in-out')),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  terminalState = 'hidden';
  shrinkState = 'normal';
  leaderboardState = 'normal';

  badgeScanningMode = false;
  gameStarted = false;
  advancedLeaderboard = false;
  scannerTimeoutId: number;
  code = '';
  scannerCode = '';
  cooldown = false;
  cooldownTime = '';

  winningScreen: boolean;
  leaderboardWithLocalPlacement: LeaderboardWithLocalPlacement;
  score: Score;

  @ViewChild('terminal', { static: false })
  private terms: BashbrawlterminalComponent;

  @ViewChild('instructions')
  private instructions: HTMLElement;

  constructor(
    private languageCommandService: LanguageCommandService,
    private scoreService: ScoreService,
  ) {
    this.badgeScanningMode = localStorage.getItem('badge_scanner')
      ? true
      : false;

    // in normal mode display the
  }
  ngOnInit(): void {
    this.terminalState = this.badgeScanningMode ? 'hidden' : 'small';
  }

  public dragEnd() {
    this.resizeTerminals();
  }

  resizeTerminals() {
    this.terms.resize();
  }

  getBrawlLanguages() {
    return this.languageCommandService.getLanguageNames().slice(0, 5);
  }

  setLargeTerminal() {
    this.shrinkState = 'shrunk';
    this.leaderboardState = 'hidden';
    this.terminalState = 'large';
    this.terms.resize();
  }

  setSmallTerminal() {
    this.shrinkState = 'normal';
    this.terminalState = 'small';
    this.leaderboardState = 'hidden';
  }

  setHiddenTerminal() {
    this.shrinkState = 'normal';
    this.terminalState = 'hidden';
    this.leaderboardState = 'normal';
  }

  resetToDefault() {
    this.code = '';
    this.gameStarted = false;
    this.winningScreen = false;

    if (this.terms) {
      this.terms.clearTerminal();
    }
    this.setHiddenTerminal();
  }

  gameEnded(gameFinished: GameFinished) {
    this.unfocusTerminal();

    if (gameFinished && gameFinished.success) {
      this.gameStarted = false;
      this.winningScreen = true;
      this.leaderboardState = 'normal';
      this.shrinkState = 'shrunk';
      this.terminalState = 'hidden';
      this.leaderboardWithLocalPlacement =
        gameFinished.leaderboardWithLocalPlacement;
      this.score = gameFinished.score;
    } else {
      this.resetToDefault();
    }
  }

  onScan(code: string) {
    this.code = code;
    this.cooldown = false;
    this.cooldownTime = '';

    this.scoreService.scan(code).subscribe({
      next: () => {
        this.onValidScan(code);
      },
      error: (errorResponse: HttpErrorResponse) => {
        const responseText = extractResponseContent(errorResponse.error);
        this.onCooldown(responseText.cooldown);
      },
    });
  }

  onValidScan(code: string) {
    this.code = code;
    this.gameStarted = true;
    setTimeout(() => this.setSmallTerminal(), 100);
  }

  onCooldown(cooldownTimeEnd: string) {
    this.cooldown = true;
    this.cooldownTime = cooldownTimeEnd;
    this.gameStarted = false;
    this.code = '';
    setTimeout(() => this.resetCooldownTimer(), 5000);
  }

  resetCooldownTimer() {
    this.cooldown = false;
    this.cooldownTime = '';
  }

  resize() {
    if (this.terms) {
      this.terms.resize();
    }
  }

  focusTerminal() {
    if (this.terminalState != 'hidden') {
      setTimeout(() => this.terms?.focusTerminal(), 0);
    }
  }

  unfocusTerminal() {
    this.terms?.blurTerminal();
  }

  @HostListener('window:keypress', ['$event'])
  protected keyEvent(event: KeyboardEvent): void {
    console.log(event.key);
    window.clearTimeout(this.scannerTimeoutId);

    if (event.code === 'Space') {
      this.advancedLeaderboard = true;
      return;
    }

    if (event.key === 'Enter' && this.winningScreen) {
      this.resetToDefault();
      return;
    }

    if (event.key === 'Enter' && !this.badgeScanningMode) {
      this.gameStarted = true;
      this.setSmallTerminal();
    } else if (event.key === 'Enter' && this.scannerCode.length >= 2) {
      this.onScan(this.scannerCode);
      this.scannerCode = '';
    } else {
      if (!this.gameStarted) {
        this.scannerCode += event.key;
        // Reset scannerCode after 20ms to avoid normal keyboard inputs
        this.scannerTimeoutId = window.setTimeout(() => {
          this.scannerCode = '';
        }, 50);
      }
    }

    event.preventDefault();
  }

  @HostListener('window:keyup', ['$event'])
  protected keyUpEvent(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      this.advancedLeaderboard = false;
    }
    event.preventDefault();
  }

  getFormattedTimeUntilDate(futureDate: string) {
    const now = new Date(); // Current date and time
    const future = new Date(futureDate); // Target future date and time

    let difference = future.getTime() - now.getTime(); // Difference in milliseconds

    if (difference < 0) {
      return '00:00'; // If the future date is in the past, return zero time
    }

    const minutes = Math.floor(difference / 60000); // Convert milliseconds to minutes
    difference %= 60000; // Get the remaining milliseconds after removing minutes
    const seconds = Math.floor(difference / 1000); // Convert remaining milliseconds to seconds

    const formattedMinutes = minutes.toString();
    const formattedSeconds = seconds.toString();

    return `${formattedMinutes} minutes and ${formattedSeconds} seconds`;
  }
}
