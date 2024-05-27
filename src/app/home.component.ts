import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BashbrawlterminalComponent } from './terminals/bashbrawl/bashbrawlterminal.component';
import { LanguageCommandService } from './terminals/bashbrawl/languages/language-command.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
  animations: [
    trigger('terminalAnimation', [
      state(
        'small',
        style({
          width: '30vw',
          minWidth: '500px',
          height: '30vh',
        }),
      ),
      state(
        'large',
        style({
          width: '50vw',
          minWidth: '500px',
          height: '50vh',
        }),
      ),
      transition('small <=> large', animate('1000ms ease-in-out')),
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
export class HomeComponent {
  terminalState = 'small';
  shrinkState = 'normal';

  @ViewChild('terminal', { static: true })
  private terms: BashbrawlterminalComponent;

  constructor(private languageCommandService: LanguageCommandService) {}

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

  resetToDefault() {
    if (this.terms) {
      this.terms.clearTerminal();
    }

    this.setSmallTerminal();
  }

  resize() {
    this.terms.resize();
  }
}
