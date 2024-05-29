import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  code = '';
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
    return this.languageCommandService.getLanguageNames();
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
      this.terms.clearTerminal();
    }
    this.setHiddenTerminal();
  }

  onScan(code: string) {
    this.cooldown = false;
    this.cooldownTime = '';
    // TODO Verify that no cooldown is active

    this.scoreService.scan(code).subscribe({
      next: () => {
        this.onValidScan(code);
      },
      error: (errorResponse: HttpErrorResponse) => {
        const responseText = extractResponseContent(errorResponse.error);
        this.onCooldown(responseText.cooldown);
      },
    });
    //OnCooldown(cooldown)
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
    setTimeout(() => this.resetCooldownTimer(), 3000);
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
    if (event.key === 'Enter') {
      this.onScan(this.code);
    } else {
      if (!this.scannedCode) {
        this.code += event.key;
      }
    }
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

    // Format the minutes and seconds with leading zeros if necessary
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedMinutes}m:${formattedSeconds}s`;
  }
}
