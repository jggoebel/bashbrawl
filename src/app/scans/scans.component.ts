import { AfterViewInit, Component } from '@angular/core';
import { ScoreService } from '../services/score.service';

@Component({
  selector: 'app-scans',
  templateUrl: 'scans.component.html',
  styleUrls: ['scans.component.scss'],
})
export class ScansComponent implements AfterViewInit {
  public scans: string[];

  constructor(private scoreService: ScoreService) {}

  ngAfterViewInit(): void {
    this.scoreService.healthSubject.subscribe((ready: boolean) => {
      if (!ready) {
        return;
      }
      this.scoreService.getScannedCodes().subscribe((l) => {
        this.scans = l;
      });
    });
  }

  getCodeBase64Decoded(code: string) {
    return atob(code);
  }

  getScans() {
    return this.scans ?? [];
  }

  getUrl(code: string) {
    return this.scoreService.getServer() + '/score/qrcode/' + code;
  }
}
