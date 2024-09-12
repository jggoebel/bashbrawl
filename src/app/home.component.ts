import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { BashbrawlterminalComponent } from './terminals/bashbrawl/bashbrawlterminal.component';
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
      transition('normal <=> shrunk', animate('1000ms ease-in-out')),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  terminalState = 'hidden';
  shrinkState = 'normal';

  public lastScanned: { code: string; times: number };
  badgeScanningMode = false;
  scannedCode = false;
  scannerTimeoutId: number;
  code = '';
  scannerCode = '';
  cooldown = false;
  cooldownTime = '';

  @ViewChild('terminal', { static: false })
  private terms: BashbrawlterminalComponent;

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
    this.terminalState = 'large';
    this.terms.resize();
  }

  setSmallTerminal() {
    this.shrinkState = 'normal';
    this.terminalState = 'small';
  }

  setHiddenTerminal() {
    this.shrinkState = 'normal';
    this.terminalState = 'hidden';
  }

  resetToDefault() {
    this.code = '';
    this.scannedCode = false;

    if (this.terms) {
      this.terms.resetToDefaultShell();
      this.terms.clearTerminal();
    }
    if (this.badgeScanningMode) {
      this.setHiddenTerminal();
    } else {
      this.setSmallTerminal();
    }
  }

  onScan(code: string) {
    console.log('Scanned: ' + code);
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
    this.scannedCode = true;
    setTimeout(() => this.setSmallTerminal(), 100);
  }

  onCooldown(cooldownTimeEnd: string) {
    this.cooldown = true;
    this.cooldownTime = cooldownTimeEnd;
    this.scannedCode = false;
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
    setTimeout(() => this.terms.focusTerminal(), 0);
  }

  @HostListener('window:keypress', ['$event'])
  protected keyEvent(event: KeyboardEvent): void {
    window.clearTimeout(this.scannerTimeoutId);
    if (event.key === 'Enter' && this.scannerCode.length >= 2) {
      this.onScan(this.scannerCode);
      this.scannerCode = '';
    } else {
      if (!this.scannedCode) {
        this.scannerCode += event.key;
        // Reset scannerCode after 20ms to avoid normal keyboard inputs
        this.scannerTimeoutId = window.setTimeout(() => {
          this.scannerCode = '';
        }, 50);
      }
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
