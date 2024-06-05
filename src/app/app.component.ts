import { Component, OnInit } from '@angular/core';
import '@cds/core/icon/register.js';
import { ClarityIcons } from '@cds/core/icon';
import { AppConfigService } from './app-config.service';
import { themes } from './terminals/terminal-themes/themes';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private Config = this.config.getConfig();
  public title = this.Config.title || 'BashBrawl';
  private logo = this.Config.logo || '/assets/bashbrawl/bashbrawl_text.png';

  public themes = themes;
  public imprint = '';
  public privacyPolicy = '';

  constructor(private config: AppConfigService) {
    this.config.getLogo(this.logo).then((obj: string) => {
      ClarityIcons.addIcons(['logo', obj]);
    });

    if (this.Config.favicon) {
      const fi = <HTMLLinkElement>document.querySelector('#favicon');
      fi.href = this.Config.favicon;
    }

    if (environment.imprint && environment.imprint != '') {
      this.imprint = environment.imprint;
    }

    if (environment.privacypolicy && environment.privacypolicy != '') {
      this.privacyPolicy = environment.privacypolicy;
    }

    if (localStorage.getItem('score_server') != '') {
      this.imprint = '';
      this.privacyPolicy = '';
    }
  }
}
