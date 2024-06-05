import { Component, HostListener } from '@angular/core';
import { ScoreService } from '../services/score.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export class Cooldown {
  cooldown: string;
}

@Component({
  selector: 'app-config',
  templateUrl: 'config.component.html',
  styleUrls: ['config.component.scss'],
})
export class ConfigComponent {
  badgeScanningMode: boolean;
  disableImprint: boolean;
  scannerTest: boolean;
  scannedCode = false;
  scannerTimeoutId: number;
  code = '';
  scannerCode = '';

  healthy = false;
  healthCheckPerformed = false;

  public settingsForm: FormGroup = new FormGroup(
    {
      server: new FormControl<string | null>(null, [Validators.required]),
      badge_scanner: new FormControl<string | null>(null, [
        Validators.required,
      ]),
      disable_imprint: new FormControl<string | null>(null, [
        Validators.required,
      ]),
    },
    {
      validators: ({ value: { new_password1: pw1, new_password1: pw2 } }) =>
        pw1 && pw1 == pw2 ? null : { passwordMismatch: true },
    },
  );

  constructor(private scoreService: ScoreService) {
    this.badgeScanningMode = localStorage.getItem('badge_scanner')
      ? true
      : false;

    this.disableImprint = localStorage.getItem('disable_imprint')
      ? true
      : false;

    this.settingsForm.setValue({
      server: localStorage.getItem('score_server'),
      badge_scanner: this.badgeScanningMode,
      disable_imprint: this.disableImprint,
    });

    // in normal mode display the
  }

  onScan(code: string) {
    console.log('Scanned: ' + code);
    this.code = code;
    // TODO Display scanned code
    this.scannedCode = false;
  }

  healthcheck() {
    this.scoreService.healthz().subscribe({
      next: () => {
        this.healthy = true;
        this.healthCheckPerformed = true;
      },
      error: () => {
        this.healthy = false;
        this.healthCheckPerformed = true;
      },
    });
  }

  storeSettings() {
    const server = this.settingsForm.controls['server'].value;
    localStorage.setItem('score_server', server);
    const badge_scanning_mode =
      this.settingsForm.controls['badge_scanner'].value;
    const disableImprint = this.settingsForm.controls['disable_imprint'].value;
    if (badge_scanning_mode == true) {
      localStorage.setItem('badge_scanner', 'true');
    } else {
      localStorage.removeItem('badge_scanner');
    }
    if (disableImprint == true) {
      localStorage.setItem('disable_imprint', 'true');
    } else {
      localStorage.removeItem('disable_imprint');
    }
    window.location.reload();
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
  }
}
